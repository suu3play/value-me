import { useState, useEffect, useCallback } from 'react';
import type { CalculationHistoryEntry, SalaryCalculationData, CalculationResult } from '../types';

const HISTORY_STORAGE_KEY = 'value-me-calculation-history';
const HISTORY_VERSION = '1.0.0';
const MAX_HISTORY_ENTRIES = 50;

interface HistoryStorageData {
  version: string;
  entries: CalculationHistoryEntry[];
}

interface UseCalculationHistoryReturn {
  history: CalculationHistoryEntry[];
  addToHistory: (inputData: SalaryCalculationData, result: CalculationResult, label?: string) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  getHistoryEntry: (id: string) => CalculationHistoryEntry | undefined;
  isSupported: boolean;
}

const isLocalStorageSupported = (): boolean => {
  try {
    const testKey = '__localStorage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};

const loadHistoryFromStorage = (): CalculationHistoryEntry[] => {
  try {
    if (!isLocalStorageSupported()) {
      return [];
    }

    const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored) as HistoryStorageData;

    // バージョン互換性チェック
    if (parsed.version !== HISTORY_VERSION) {
      console.warn('Calculation history version mismatch. Clearing old history data.');
      localStorage.removeItem(HISTORY_STORAGE_KEY);
      return [];
    }

    return parsed.entries || [];
  } catch (error) {
    console.error('Failed to load calculation history:', error);
    return [];
  }
};

const saveHistoryToStorage = (entries: CalculationHistoryEntry[]): boolean => {
  try {
    if (!isLocalStorageSupported()) {
      return false;
    }

    const storageData: HistoryStorageData = {
      version: HISTORY_VERSION,
      entries,
    };

    const serialized = JSON.stringify(storageData);
    localStorage.setItem(HISTORY_STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save calculation history:', error);
    return false;
  }
};

const generateHistoryId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const limitHistoryEntries = (entries: CalculationHistoryEntry[]): CalculationHistoryEntry[] => {
  if (entries.length <= MAX_HISTORY_ENTRIES) {
    return entries;
  }

  // 新しいものから最大件数まで保持（古いものを削除）
  return entries
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, MAX_HISTORY_ENTRIES);
};

export const useCalculationHistory = (): UseCalculationHistoryReturn => {
  const [history, setHistory] = useState<CalculationHistoryEntry[]>([]);
  const isSupported = isLocalStorageSupported();

  // 初期化時に履歴を読み込み
  useEffect(() => {
    const loadedHistory = loadHistoryFromStorage();
    setHistory(loadedHistory);
  }, []);

  // 履歴に新しいエントリを追加（重複チェック付き）
  const addToHistory = useCallback((
    inputData: SalaryCalculationData,
    result: CalculationResult,
    label?: string
  ) => {
    if (!isSupported) {
      return;
    }

    setHistory(prevHistory => {
      // 同じ計算結果の重複チェック（最新エントリのみチェック）
      if (prevHistory.length > 0) {
        const latestEntry = prevHistory[0];
        const isSameResult = 
          latestEntry.result.hourlyWage === result.hourlyWage &&
          latestEntry.result.actualAnnualIncome === result.actualAnnualIncome &&
          latestEntry.result.actualMonthlyIncome === result.actualMonthlyIncome;
        
        if (isSameResult) {
          console.log('重複した計算結果のため履歴追加をスキップしました');
          return prevHistory; // 重複の場合は追加しない
        }
      }

      const newEntry: CalculationHistoryEntry = {
        id: generateHistoryId(),
        timestamp: Date.now(),
        inputData: { ...inputData },
        result: { ...result },
        label,
      };

      const updatedHistory = [newEntry, ...prevHistory];
      const limitedHistory = limitHistoryEntries(updatedHistory);
      saveHistoryToStorage(limitedHistory);
      return limitedHistory;
    });
  }, [isSupported]);

  // 指定されたIDの履歴エントリを削除
  const removeFromHistory = useCallback((id: string) => {
    setHistory(prevHistory => {
      const filteredHistory = prevHistory.filter(entry => entry.id !== id);
      saveHistoryToStorage(filteredHistory);
      return filteredHistory;
    });
  }, []);

  // 履歴を全削除
  const clearHistory = useCallback(() => {
    try {
      if (isSupported) {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
      }
      setHistory([]);
    } catch (error) {
      console.error('Failed to clear calculation history:', error);
    }
  }, [isSupported]);

  // 指定されたIDの履歴エントリを取得
  const getHistoryEntry = useCallback((id: string): CalculationHistoryEntry | undefined => {
    return history.find(entry => entry.id === id);
  }, [history]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    getHistoryEntry,
    isSupported,
  };
};