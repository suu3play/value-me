import { useState, useEffect, useCallback } from 'react';
import type { SalaryCalculationData } from '../types';

const STORAGE_KEY = 'value-me-salary-data';
const STORAGE_VERSION = '1.0.0';

interface StorageData {
  version: string;
  timestamp: number;
  data: SalaryCalculationData;
  isEnabled: boolean;
}

interface UseLocalStorageReturn {
  data: SalaryCalculationData | null;
  isEnabled: boolean;
  saveData: (data: SalaryCalculationData) => void;
  clearData: () => void;
  toggleEnabled: (enabled: boolean) => void;
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

const getStoredData = (): StorageData | null => {
  try {
    if (!isLocalStorageSupported()) {
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored) as StorageData;
    
    // バージョン互換性チェック
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('LocalStorage data version mismatch. Clearing old data.');
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Failed to retrieve data from LocalStorage:', error);
    return null;
  }
};

const saveStoredData = (storageData: StorageData): boolean => {
  try {
    if (!isLocalStorageSupported()) {
      return false;
    }

    const serialized = JSON.stringify(storageData);
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch (error) {
    console.error('Failed to save data to LocalStorage:', error);
    return false;
  }
};

export const useLocalStorage = (initialData: SalaryCalculationData): UseLocalStorageReturn => {
  const [isEnabled, setIsEnabled] = useState<boolean>(false);
  const [data, setData] = useState<SalaryCalculationData | null>(null);
  const isSupported = isLocalStorageSupported();

  // 初期化時にデータを読み込み
  useEffect(() => {
    const stored = getStoredData();
    if (stored && stored.isEnabled) {
      setData(stored.data);
      setIsEnabled(true);
    } else {
      // データ保存が無効の場合は設定のみ復元
      setIsEnabled(stored?.isEnabled ?? false);
    }
  }, []);

  // データを保存
  const saveData = useCallback((newData: SalaryCalculationData) => {
    if (!isEnabled || !isSupported) {
      return;
    }

    const storageData: StorageData = {
      version: STORAGE_VERSION,
      timestamp: Date.now(),
      data: newData,
      isEnabled: true,
    };

    const success = saveStoredData(storageData);
    if (success) {
      setData(newData);
    }
  }, [isEnabled, isSupported]);

  // データをクリア
  const clearData = useCallback(() => {
    try {
      if (isSupported) {
        localStorage.removeItem(STORAGE_KEY);
      }
      setData(null);
    } catch (error) {
      console.error('Failed to clear LocalStorage data:', error);
    }
  }, [isSupported]);

  // 保存機能のON/OFF切り替え
  const toggleEnabled = useCallback((enabled: boolean) => {
    setIsEnabled(enabled);

    if (!enabled) {
      // 無効にする場合は保存データをクリア
      clearData();
    } else if (isSupported) {
      // 有効にする場合は設定を保存
      const storageData: StorageData = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        data: initialData,
        isEnabled: true,
      };
      saveStoredData(storageData);
    }
  }, [clearData, initialData, isSupported]);

  return {
    data,
    isEnabled,
    saveData,
    clearData,
    toggleEnabled,
    isSupported,
  };
};