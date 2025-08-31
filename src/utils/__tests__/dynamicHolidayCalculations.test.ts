import { describe, test, expect, vi } from 'vitest';
import { calculateHourlyWageWithDynamicHolidays } from '../dynamicHolidayCalculations';
import type { SalaryCalculationData } from '../../types';

describe('dynamicHolidayCalculations', () => {
  const createBaseData = (): SalaryCalculationData => ({
    salaryType: 'monthly',
    salaryAmount: 200000,
    annualHolidays: 119,
    dailyWorkingHours: 8,
    workingHoursType: 'daily',
    useDynamicHolidays: true,
    holidayYear: 2024,
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
  });

  // holidayServiceのモック
  const mockHolidayService = {
    getHolidayCount: vi.fn()
  };

  // モジュールのモック
  vi.mock('../../services/holidayService', () => ({
    holidayService: {
      getHolidayCount: vi.fn().mockResolvedValue({
        weekendDays: 104,
        publicHolidays: 16,
        totalHolidays: 120,
        holidayDetails: []
      })
    }
  }));

  describe('calculateHourlyWageWithDynamicHolidays', () => {
    test('動的祝日計算による基本的な時給計算', async () => {
      const data = createBaseData();
      const result = await calculateHourlyWageWithDynamicHolidays(data);

      expect(result).toHaveProperty('hourlyWage');
      expect(result).toHaveProperty('actualAnnualIncome');
      expect(result).toHaveProperty('actualMonthlyIncome');
      expect(result).toHaveProperty('totalWorkingHours');
      expect(result).toHaveProperty('totalAnnualHolidays');

      expect(result.hourlyWage).toBeGreaterThan(0);
      expect(result.actualAnnualIncome).toBe(2400000); // 200,000 * 12
      expect(result.actualMonthlyIncome).toBe(200000);
    });

    test('年度ベースの祝日計算', async () => {
      const data = createBaseData();
      data.holidayYearType = 'fiscal';

      const result = await calculateHourlyWageWithDynamicHolidays(data, { year: 2024 });

      expect(result.hourlyWage).toBeGreaterThan(0);
      expect(result.totalAnnualHolidays).toBeGreaterThan(0);
    });

    test('暦年ベースの祝日計算', async () => {
      const data = createBaseData();
      data.holidayYearType = 'calendar';

      const result = await calculateHourlyWageWithDynamicHolidays(data, { year: 2024 });

      expect(result.hourlyWage).toBeGreaterThan(0);
      expect(result.totalAnnualHolidays).toBeGreaterThan(0);
    });

    test('エラー時のフォールバック計算', async () => {
      // holidayServiceのエラーをモック
      vi.mocked(mockHolidayService.getHolidayCount).mockRejectedValueOnce(new Error('API Error'));

      const data = createBaseData();
      const result = await calculateHourlyWageWithDynamicHolidays(data);

      // フォールバック計算でも結果が返されることを確認
      expect(result.hourlyWage).toBeGreaterThanOrEqual(0);
      expect(result.actualAnnualIncome).toBeGreaterThan(0);
    });

    test('特別休暇の計算', async () => {
      const data = createBaseData();
      data.goldenWeekHolidays = true;
      data.obon = true;
      data.yearEndNewYear = true;
      data.customHolidays = 5;

      const result = await calculateHourlyWageWithDynamicHolidays(data);

      // 特別休暇が追加されることで労働時間が減り、時給が上がる
      const baseResult = await calculateHourlyWageWithDynamicHolidays(createBaseData());
      expect(result.hourlyWage).toBeGreaterThan(baseResult.hourlyWage);
      expect(result.totalAnnualHolidays).toBeGreaterThan(baseResult.totalAnnualHolidays);
    });

    test('福利厚生の計算', async () => {
      const data = createBaseData();
      data.welfareInputMethod = 'total';
      data.welfareAmount = 80000;
      data.welfareType = 'monthly';

      const result = await calculateHourlyWageWithDynamicHolidays(data);

      expect(result.actualAnnualIncome).toBe(2400000 + (80000 * 12));
    });

    test('ボーナス計算', async () => {
      const data = createBaseData();
      data.summerBonus = 500000;
      data.winterBonus = 500000;

      const result = await calculateHourlyWageWithDynamicHolidays(data);

      expect(result.actualAnnualIncome).toBe(2400000 + 500000 + 500000);
    });

    test('境界値: 給与額0円', async () => {
      const data = createBaseData();
      data.salaryAmount = 0;

      const result = await calculateHourlyWageWithDynamicHolidays(data);

      expect(result.hourlyWage).toBe(0);
      expect(result.actualAnnualIncome).toBe(0);
    });

    test('境界値: 負の値のハンドリング', async () => {
      const data = createBaseData();
      data.salaryAmount = -100000;
      data.dailyWorkingHours = -1;
      data.customHolidays = -5;

      const result = await calculateHourlyWageWithDynamicHolidays(data);

      expect(result.hourlyWage).toBe(0);
      expect(result.actualAnnualIncome).toBe(0);
    });
  });
});