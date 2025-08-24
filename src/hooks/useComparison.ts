import { useState, useCallback, useEffect } from 'react';
import type { 
  ComparisonItem, 
  ComparisonState, 
  ComparisonResult, 
  SalaryCalculationData,
  CalculationResult 
} from '../types';
import { calculateHourlyWage } from '../utils/calculations';
import { calculateHourlyWageWithDynamicHolidays } from '../utils/dynamicHolidayCalculations';

const STORAGE_KEY = 'value-me-comparison-state';

export const useComparison = (singleCalculationData?: SalaryCalculationData) => {
  const [state, setState] = useState<ComparisonState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          items: parsed.items || [],
          activeItemId: parsed.activeItemId || null,
          mode: parsed.mode || 'single',
        };
      }
    } catch (error) {
      console.warn('比較状態の復元に失敗:', error);
    }
    
    return {
      items: [],
      activeItemId: null,
      mode: 'single',
    };
  });

  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // ローカルストレージに状態を保存
  const saveToStorage = useCallback((newState: ComparisonState) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.warn('比較状態の保存に失敗:', error);
    }
  }, []);

  // 計算処理
  const calculateResults = useCallback(async (data: SalaryCalculationData): Promise<CalculationResult> => {
    try {
      return await calculateHourlyWageWithDynamicHolidays(data, { useCurrentYear: true });
    } catch (error) {
      console.warn('動的祝日計算に失敗。フォールバック計算を使用:', error);
      return calculateHourlyWage(data);
    }
  }, []);

  // 比較結果の更新
  const updateComparisonResult = useCallback(async (items: ComparisonItem[]) => {
    if (items.length === 0) {
      setComparisonResult(null);
      return;
    }

    setIsCalculating(true);
    
    try {
      // 全アイテムの計算を実行
      const itemsWithResults = await Promise.all(
        items.map(async (item) => {
          const result = await calculateResults(item.data);
          return { ...item, result };
        })
      );

      // 最高・最低値を特定
      const hourlyWages = itemsWithResults.map(item => ({
        item,
        value: item.result?.hourlyWage || 0,
      }));
      
      const annualIncomes = itemsWithResults.map(item => ({
        item,
        value: item.result?.actualAnnualIncome || 0,
      }));

      const highestHourlyWage = hourlyWages.reduce((max, current) => 
        current.value > max.value ? current : max
      );
      
      const lowestHourlyWage = hourlyWages.reduce((min, current) => 
        current.value < min.value ? current : min
      );

      const highestAnnualIncome = annualIncomes.reduce((max, current) => 
        current.value > max.value ? current : max
      );
      
      const lowestAnnualIncome = annualIncomes.reduce((min, current) => 
        current.value < min.value ? current : min
      );

      // 差分計算
      const maxHourlyWageDiff = highestHourlyWage.value - lowestHourlyWage.value;
      const maxAnnualIncomeDiff = highestAnnualIncome.value - lowestAnnualIncome.value;

      const result: ComparisonResult = {
        items: itemsWithResults,
        highest: {
          hourlyWage: highestHourlyWage.item,
          annualIncome: highestAnnualIncome.item,
        },
        lowest: {
          hourlyWage: lowestHourlyWage.item,
          annualIncome: lowestAnnualIncome.item,
        },
        differences: {
          maxHourlyWageDiff,
          maxAnnualIncomeDiff,
        },
      };

      setComparisonResult(result);
    } catch (error) {
      console.error('比較結果の計算に失敗:', error);
      setComparisonResult(null);
    } finally {
      setIsCalculating(false);
    }
  }, [calculateResults]);

  // アイテム追加
  const addItem = useCallback((label: string, data: SalaryCalculationData) => {
    const newItem: ComparisonItem = {
      id: `comparison-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label,
      data,
    };

    const newState = {
      ...state,
      items: [...state.items, newItem],
      activeItemId: newItem.id,
      mode: 'comparison' as const,
    };

    setState(newState);
    saveToStorage(newState);
  }, [state, saveToStorage]);

  // アイテム削除
  const removeItem = useCallback((id: string) => {
    const newItems = state.items.filter(item => item.id !== id);
    const newActiveItemId = state.activeItemId === id 
      ? (newItems.length > 0 ? newItems[0].id : null)
      : state.activeItemId;

    const newState = {
      ...state,
      items: newItems,
      activeItemId: newActiveItemId,
      mode: newItems.length === 0 ? 'single' as const : state.mode,
    };

    setState(newState);
    saveToStorage(newState);
  }, [state, saveToStorage]);

  // アイテム更新
  const updateItem = useCallback((id: string, data: SalaryCalculationData) => {
    const newItems = state.items.map(item => 
      item.id === id ? { ...item, data } : item
    );

    const newState = {
      ...state,
      items: newItems,
    };

    setState(newState);
    saveToStorage(newState);
  }, [state, saveToStorage]);

  // ラベル更新
  const updateLabel = useCallback((id: string, label: string) => {
    const newItems = state.items.map(item => 
      item.id === id ? { ...item, label } : item
    );

    const newState = {
      ...state,
      items: newItems,
    };

    setState(newState);
    saveToStorage(newState);
  }, [state, saveToStorage]);

  // アクティブアイテム設定
  const setActiveItem = useCallback((id: string) => {
    const newState = {
      ...state,
      activeItemId: id,
    };

    setState(newState);
    saveToStorage(newState);
  }, [state, saveToStorage]);

  // モード切り替え
  const setMode = useCallback((mode: 'single' | 'comparison') => {
    let newState = { ...state, mode };

    // 比較モードに切り替える時の処理
    if (mode === 'comparison') {
      // 単一計算データがある場合は比較元として使用
      const sourceData = singleCalculationData || {
        salaryType: 'monthly',
        salaryAmount: 200000,
        annualHolidays: 119,
        dailyWorkingHours: 8,
        workingHoursType: 'daily',
        useDynamicHolidays: true,
        holidayYear: (() => {
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();
          return currentMonth >= 4 ? currentYear : currentYear - 1;
        })(),
        holidayYearType: 'fiscal',
        enableBenefits: false,
        welfareAmount: 0,
        welfareType: 'monthly',
        welfareInputMethod: 'individual',
        housingAllowance: 0,
        regionalAllowance: 0,
        familyAllowance: 0,
        qualificationAllowance: 0,
        otherAllowance: 0,
        summerBonus: 0,
        winterBonus: 0,
        settlementBonus: 0,
        otherBonus: 0,
        goldenWeekHolidays: false,
        obon: false,
        yearEndNewYear: false,
        customHolidays: 0,
      } as const;

      const sourceItem: ComparisonItem = {
        id: `comparison-source-${Date.now()}`,
        label: '比較元',
        data: sourceData,
      };

      const targetItem: ComparisonItem = {
        id: `comparison-target-${Date.now()}`,
        label: '比較先',
        data: { ...sourceData, salaryAmount: sourceData.salaryAmount + 50000 },
      };

      newState = {
        ...newState,
        items: [sourceItem, targetItem],
        activeItemId: sourceItem.id,
      };
    }

    setState(newState);
    saveToStorage(newState);
  }, [state, saveToStorage, singleCalculationData]);

  // 全クリア
  const clearAll = useCallback(() => {
    const newState = {
      items: [],
      activeItemId: null,
      mode: 'single' as const,
    };

    setState(newState);
    saveToStorage(newState);
    setComparisonResult(null);
  }, [saveToStorage]);

  // アイテムが変更された時に比較結果を更新
  useEffect(() => {
    if (state.mode === 'comparison' && state.items.length > 0) {
      updateComparisonResult(state.items);
    } else {
      setComparisonResult(null);
    }
  }, [state.items, state.mode, updateComparisonResult]);

  return {
    state,
    comparisonResult,
    isCalculating,
    addItem,
    removeItem,
    updateItem,
    updateLabel,
    setActiveItem,
    setMode,
    clearAll,
  };
};