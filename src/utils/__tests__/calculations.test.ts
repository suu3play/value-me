import { describe, test, expect } from 'vitest';
import { calculateHourlyWage } from '../calculations';
import type { SalaryCalculationData } from '../../types';

describe('calculateHourlyWage', () => {
  const createBaseData = (): SalaryCalculationData => ({
    salaryType: 'monthly',
    salaryAmount: 200000,
    annualHolidays: 119,
    dailyWorkingHours: 8,
    workingHoursType: 'daily',
    useDynamicHolidays: false,
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

  describe('基本計算', () => {
    test('月給200,000円の場合の時給計算', () => {
      const data = createBaseData();
      const result = calculateHourlyWage(data);

      expect(result.hourlyWage).toBeGreaterThan(0);
      expect(result.actualAnnualIncome).toBe(2400000); // 200,000 * 12
      expect(result.actualMonthlyIncome).toBe(200000);
    });

    test('年収3,000,000円の場合の時給計算', () => {
      const data = createBaseData();
      data.salaryType = 'annual';
      data.salaryAmount = 3000000;

      const result = calculateHourlyWage(data);

      expect(result.hourlyWage).toBeGreaterThan(0);
      expect(result.actualAnnualIncome).toBe(3000000);
      expect(result.actualMonthlyIncome).toBe(250000);
    });

    test('時給計算の精度確認', () => {
      const data = createBaseData();
      data.salaryAmount = 240000; // 月給24万円
      data.annualHolidays = 120;
      data.dailyWorkingHours = 8;

      const result = calculateHourlyWage(data);
      
      // 年間労働日数: 365 - 120 = 245日
      // 年間労働時間: 245 * 8 = 1960時間
      // 年収: 240,000 * 12 = 2,880,000円
      // 時給: 2,880,000 / 1960 ≈ 1469.39円
      // 実際の関数はMath.roundで整数化している
      const expectedHourlyWage = Math.round(2880000 / (245 * 8));
      
      expect(result.hourlyWage).toBe(expectedHourlyWage);
    });
  });

  describe('境界値テスト', () => {
    test('給与額0円の場合', () => {
      const data = createBaseData();
      data.salaryAmount = 0;

      const result = calculateHourlyWage(data);

      expect(result.hourlyWage).toBe(0);
      expect(result.actualAnnualIncome).toBe(0);
    });

    test('負の給与額の場合', () => {
      const data = createBaseData();
      data.salaryAmount = -100000;

      const result = calculateHourlyWage(data);

      expect(result.hourlyWage).toBe(0);
      expect(result.actualAnnualIncome).toBe(0);
    });

    test('休日日数が365日を超える場合', () => {
      const data = createBaseData();
      data.annualHolidays = 400;

      const result = calculateHourlyWage(data);

      expect(result.hourlyWage).toBe(0);
    });

    test('労働時間0時間の場合', () => {
      const data = createBaseData();
      data.dailyWorkingHours = 0;

      const result = calculateHourlyWage(data);

      expect(result.hourlyWage).toBe(0);
    });

    test('負の労働時間の場合', () => {
      const data = createBaseData();
      data.dailyWorkingHours = -1;

      const result = calculateHourlyWage(data);

      expect(result.hourlyWage).toBe(0);
    });
  });

  describe('福利厚生計算', () => {
    test('住宅手当月額50,000円の場合', () => {
      const data = createBaseData();
      data.housingAllowance = 50000;

      const result = calculateHourlyWage(data);

      expect(result.actualAnnualIncome).toBe(2400000 + (50000 * 12));
      expect(result.hourlyWage).toBeGreaterThan(1000); // 手当込みで時給が上がる
    });

    test('複数手当の合算', () => {
      const data = createBaseData();
      data.housingAllowance = 30000;
      data.regionalAllowance = 10000;
      data.familyAllowance = 15000;
      data.qualificationAllowance = 5000;

      const result = calculateHourlyWage(data);

      const totalAllowance = (30000 + 10000 + 15000 + 5000) * 12;
      expect(result.actualAnnualIncome).toBe(2400000 + totalAllowance);
    });

    test('福利厚生一括入力（月額）', () => {
      const data = createBaseData();
      data.welfareInputMethod = 'total';
      data.welfareAmount = 80000;
      data.welfareType = 'monthly';

      const result = calculateHourlyWage(data);

      expect(result.actualAnnualIncome).toBe(2400000 + (80000 * 12));
    });

    test('福利厚生一括入力（年額）', () => {
      const data = createBaseData();
      data.welfareInputMethod = 'total';
      data.welfareAmount = 500000;
      data.welfareType = 'annual';

      const result = calculateHourlyWage(data);

      expect(result.actualAnnualIncome).toBe(2400000 + 500000);
    });
  });

  describe('ボーナス計算', () => {
    test('夏冬ボーナス各50万円の場合', () => {
      const data = createBaseData();
      data.summerBonus = 500000;
      data.winterBonus = 500000;

      const result = calculateHourlyWage(data);

      expect(result.actualAnnualIncome).toBe(2400000 + 500000 + 500000);
    });

    test('全種類のボーナス', () => {
      const data = createBaseData();
      data.summerBonus = 400000;
      data.winterBonus = 400000;
      data.settlementBonus = 200000;
      data.otherBonus = 100000;

      const result = calculateHourlyWage(data);

      expect(result.actualAnnualIncome).toBe(2400000 + 400000 + 400000 + 200000 + 100000);
    });
  });

  describe('エラーハンドリング', () => {
    test('NaNの入力値', () => {
      const data = createBaseData();
      data.salaryAmount = NaN;
      data.annualHolidays = NaN;
      data.dailyWorkingHours = NaN;

      const result = calculateHourlyWage(data);

      expect(result.hourlyWage).toBe(0);
      expect(result.actualAnnualIncome).toBe(0);
    });

    test('無効なallowance値', () => {
      const data = createBaseData();
      data.housingAllowance = NaN;
      data.regionalAllowance = -5000;

      const result = calculateHourlyWage(data);

      // 無効な値は0として処理される
      expect(result.actualAnnualIncome).toBe(2400000);
    });
  });

  describe('特別休暇計算', () => {
    test('GW・お盆・年末年始の休日追加', () => {
      const data = createBaseData();
      data.goldenWeekHolidays = true;
      data.obon = true;
      data.yearEndNewYear = true;

      const result = calculateHourlyWage(data);

      // 特別休暇が追加されることで労働時間が減り、時給が上がる
      const baseResult = calculateHourlyWage(createBaseData());
      expect(result.hourlyWage).toBeGreaterThan(baseResult.hourlyWage);
    });

    test('カスタム休日の追加', () => {
      const data = createBaseData();
      data.customHolidays = 10;

      const result = calculateHourlyWage(data);

      const baseResult = calculateHourlyWage(createBaseData());
      expect(result.hourlyWage).toBeGreaterThan(baseResult.hourlyWage);
    });
  });
});