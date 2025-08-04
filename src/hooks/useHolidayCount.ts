import { useState, useEffect } from 'react';
import { holidayService, type HolidayCount } from '../services/holidayService';
import type { SalaryCalculationData } from '../types';

export interface HolidayTypeCount {
  weeklyTwoDay: number; // 週休二日制（土日）
  weeklyTwoDayWithHolidays: number; // 週休二日制（土日祝）
  fullWeekendOnly: number; // 完全週休二日制（土日）
  fullWeekendWithHolidays: number; // 完全週休二日制（土日祝）
}

export const useHolidayCount = (data: SalaryCalculationData) => {
  const [holidayCount, setHolidayCount] = useState<HolidayCount | null>(null);
  const [holidayTypeCount, setHolidayTypeCount] = useState<HolidayTypeCount | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const calculateHolidayCount = async () => {
      if (!data.useDynamicHolidays || !data.holidayYear) {
        setHolidayCount(null);
        setHolidayTypeCount(null);
        return;
      }

      setLoading(true);
      try {
        const isFiscal = data.holidayYearType === 'fiscal';
        const count = await holidayService.getHolidayCount(data.holidayYear, isFiscal);
        setHolidayCount(count);

        // 各休日タイプの日数を計算
        const typeCount = calculateHolidayTypeCount(count);
        setHolidayTypeCount(typeCount);
      } catch (error) {
        console.warn('休日日数の取得に失敗しました:', error);
        setHolidayCount(null);
        setHolidayTypeCount(null);
      } finally {
        setLoading(false);
      }
    };

    calculateHolidayCount();
  }, [data.holidayYear, data.holidayYearType, data.useDynamicHolidays]);

  return { holidayCount, holidayTypeCount, loading };
};

function calculateHolidayTypeCount(holidayCount: HolidayCount): HolidayTypeCount {
  // 月一回の土日出勤を考慮（年12回）
  const monthlyWeekendWork = 12;
  
  return {
    // 週休二日制（土日）：基本土日休み、月1回土日出勤、祝日は出勤
    weeklyTwoDay: holidayCount.weekendDays - monthlyWeekendWork,
    
    // 週休二日制（土日祝）：基本土日祝休み、月1回土日出勤
    weeklyTwoDayWithHolidays: holidayCount.totalHolidays - monthlyWeekendWork,
    
    // 完全週休二日制（土日）：完全土日休み、祝日は出勤
    fullWeekendOnly: holidayCount.weekendDays,
    
    // 完全週休二日制（土日祝）：完全土日祝休み
    fullWeekendWithHolidays: holidayCount.totalHolidays
  };
}