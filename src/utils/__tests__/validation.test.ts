import { describe, test, expect } from 'vitest';
import {
  validateSalary,
  validateHolidays,
  validateWorkingHours,
  validateCustomHolidays,
  validateWelfareAmount,
  validateAllowance,
  validateBonus
} from '../validation';

describe('validation', () => {
  describe('validateSalary', () => {
    test('有効な給与額', () => {
      const result = validateSalary(300000);
      expect(result.isValid).toBe(true);
      expect(result.errorMessage).toBeUndefined();
    });

    test('境界値: 0円', () => {
      const result = validateSalary(0);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 1億円', () => {
      const result = validateSalary(100000000);
      expect(result.isValid).toBe(true);
    });

    test('負の値', () => {
      const result = validateSalary(-1000);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('年収は0円以上で入力してください');
    });

    test('1億円超過', () => {
      const result = validateSalary(100000001);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('年収は1億円以下で入力してください');
    });

    test('NaN', () => {
      const result = validateSalary(NaN);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('年収は0円以上で入力してください');
    });
  });

  describe('validateHolidays', () => {
    test('有効な休日数', () => {
      const result = validateHolidays(120);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 0日', () => {
      const result = validateHolidays(0);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 366日', () => {
      const result = validateHolidays(366);
      expect(result.isValid).toBe(true);
    });

    test('負の値', () => {
      const result = validateHolidays(-1);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('年間休日は0日以上で入力してください');
    });

    test('366日超過', () => {
      const result = validateHolidays(367);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('年間休日は366日以下で入力してください');
    });

    test('NaN', () => {
      const result = validateHolidays(NaN);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('年間休日は0日以上で入力してください');
    });
  });

  describe('validateWorkingHours', () => {
    test('有効な労働時間', () => {
      const result = validateWorkingHours(8);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 0.5時間', () => {
      const result = validateWorkingHours(0.5);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 24時間', () => {
      const result = validateWorkingHours(24);
      expect(result.isValid).toBe(true);
    });

    test('0.5時間未満', () => {
      const result = validateWorkingHours(0.4);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('労働時間は0.5時間以上で入力してください');
    });

    test('負の値', () => {
      const result = validateWorkingHours(-1);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('労働時間は0.5時間以上で入力してください');
    });

    test('24時間超過', () => {
      const result = validateWorkingHours(25);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('労働時間は24時間以下で入力してください');
    });
  });

  describe('validateCustomHolidays', () => {
    test('有効なカスタム休日数', () => {
      const result = validateCustomHolidays(10);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 0日', () => {
      const result = validateCustomHolidays(0);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 365日', () => {
      const result = validateCustomHolidays(365);
      expect(result.isValid).toBe(true);
    });

    test('負の値', () => {
      const result = validateCustomHolidays(-1);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('カスタム休日は0日以上で入力してください');
    });

    test('365日超過', () => {
      const result = validateCustomHolidays(366);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('カスタム休日は365日以下で入力してください');
    });
  });

  describe('validateWelfareAmount', () => {
    test('有効な福利厚生額', () => {
      const result = validateWelfareAmount(50000);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 0円', () => {
      const result = validateWelfareAmount(0);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 1000万円', () => {
      const result = validateWelfareAmount(10000000);
      expect(result.isValid).toBe(true);
    });

    test('負の値', () => {
      const result = validateWelfareAmount(-1000);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('福利厚生額は0円以上で入力してください');
    });

    test('1000万円超過', () => {
      const result = validateWelfareAmount(10000001);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('福利厚生額は1,000万円以下で入力してください');
    });
  });

  describe('validateAllowance', () => {
    test('有効な手当額', () => {
      const result = validateAllowance(30000);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 0円', () => {
      const result = validateAllowance(0);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 1000万円', () => {
      const result = validateAllowance(10000000);
      expect(result.isValid).toBe(true);
    });

    test('負の値', () => {
      const result = validateAllowance(-1000);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('手当は0円以上で入力してください');
    });

    test('1000万円超過', () => {
      const result = validateAllowance(10000001);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('手当は1,000万円以下で入力してください');
    });
  });

  describe('validateBonus', () => {
    test('有効なボーナス額', () => {
      const result = validateBonus(500000);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 0円', () => {
      const result = validateBonus(0);
      expect(result.isValid).toBe(true);
    });

    test('境界値: 1000万円', () => {
      const result = validateBonus(10000000);
      expect(result.isValid).toBe(true);
    });

    test('負の値', () => {
      const result = validateBonus(-10000);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('ボーナスは0円以上で入力してください');
    });

    test('1000万円超過', () => {
      const result = validateBonus(10000001);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('ボーナスは1,000万円以下で入力してください');
    });
  });

  describe('複合テスト', () => {
    test('複数のバリデーション関数の組み合わせ', () => {
      // 正常な値のセット
      expect(validateSalary(3000000).isValid).toBe(true);
      expect(validateHolidays(120).isValid).toBe(true);
      expect(validateWorkingHours(8).isValid).toBe(true);

      // 異常な値のセット
      expect(validateSalary(-1000000).isValid).toBe(false);
      expect(validateHolidays(400).isValid).toBe(false);
      expect(validateWorkingHours(0).isValid).toBe(false);
    });

    test('エッジケース: 極端に小さい値', () => {
      expect(validateSalary(1).isValid).toBe(true);
      expect(validateWorkingHours(0.5).isValid).toBe(true);
      expect(validateAllowance(1).isValid).toBe(true);
    });

    test('エッジケース: 極端に大きい値', () => {
      expect(validateSalary(99999999).isValid).toBe(true);
      expect(validateBonus(9999999).isValid).toBe(true);
      expect(validateWelfareAmount(9999999).isValid).toBe(true);
    });
  });
});