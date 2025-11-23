import { describe, test, expect } from 'vitest';
import {
  calculateAnnualSalary,
  calculateHourlyRate,
  calculateTeamCost,
  createDefaultTeamCostData,
  validateTeamCostData
} from '../teamCostCalculations';
import type { TeamCostData, Position, SalaryData } from '../../types/teamCost';

describe('teamCostCalculations', () => {
  const createTestSalaryData = (): SalaryData => ({
    positions: {
      'リーダー': { type: 'monthly', amount: 50 },
      'ミドル': { type: 'monthly', amount: 35 },
      'ジュニア': { type: 'monthly', amount: 20 },
    }
  });

  const createTestPositions = (): Position[] => [
    { id: 'pos-1', name: 'リーダー', count: 1 },
    { id: 'pos-2', name: 'ミドル', count: 2 },
    { id: 'pos-3', name: 'ジュニア', count: 3 }
  ];

  const createTestTeamCostData = (): TeamCostData => ({
    id: 'team-test',
    name: 'テストチーム',
    positions: createTestPositions(),
    salaryData: createTestSalaryData(),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  });

  describe('calculateAnnualSalary', () => {
    test('時給から年収計算', () => {
      const result = calculateAnnualSalary(3000, 'hourly');
      expect(result).toBe(3000 * 8 * 250); // 時給 × 8時間 × 250日
    });

    test('月給から年収計算', () => {
      const result = calculateAnnualSalary(30, 'monthly'); // 30万円/月
      expect(result).toBe(30 * 10000 * 12); // 万円を円に変換 × 12ヶ月
    });

    test('年俸から年収計算', () => {
      const result = calculateAnnualSalary(500, 'annual'); // 500万円/年
      expect(result).toBe(500 * 10000); // 万円を円に変換
    });

    test('無効なタイプの場合', () => {
      const result = calculateAnnualSalary(100, 'invalid' as unknown as 'hourly' | 'monthly' | 'annual');
      expect(result).toBe(0);
    });
  });

  describe('calculateHourlyRate', () => {
    test('年収から時給計算', () => {
      const annualSalary = 6000000; // 600万円
      const result = calculateHourlyRate(annualSalary);
      expect(result).toBe(6000000 / (8 * 250)); // 年収 ÷ (8時間 × 250日)
    });

    test('0円年収の場合', () => {
      const result = calculateHourlyRate(0);
      expect(result).toBe(0);
    });
  });

  describe('calculateTeamCost', () => {
    test('基本的なチームコスト計算', () => {
      const teamData = createTestTeamCostData();
      const result = calculateTeamCost(teamData);

      expect(result).toHaveProperty('totalAnnualCost');
      expect(result).toHaveProperty('totalMonthlyHours');
      expect(result).toHaveProperty('totalAnnualHours');
      expect(result).toHaveProperty('positionBreakdown');

      expect(result.totalAnnualCost).toBeGreaterThan(0);
      expect(result.totalAnnualHours).toBeGreaterThan(0);
      expect(result.positionBreakdown).toHaveLength(3); // リーダー、ミドル、ジュニア
    });

    test('役職別内訳の計算', () => {
      const teamData = createTestTeamCostData();
      const result = calculateTeamCost(teamData);

      const leaderBreakdown = result.positionBreakdown.find(p => p.positionName === 'リーダー');
      const middleBreakdown = result.positionBreakdown.find(p => p.positionName === 'ミドル');
      const juniorBreakdown = result.positionBreakdown.find(p => p.positionName === 'ジュニア');

      expect(leaderBreakdown).toBeDefined();
      expect(middleBreakdown).toBeDefined();
      expect(juniorBreakdown).toBeDefined();

      expect(leaderBreakdown!.count).toBe(1);
      expect(middleBreakdown!.count).toBe(2);
      expect(juniorBreakdown!.count).toBe(3);

      // リーダーの年収がミドルより高い
      expect(leaderBreakdown!.annualSalaryPerPerson).toBeGreaterThan(middleBreakdown!.annualSalaryPerPerson);
      // ミドルの年収がジュニアより高い
      expect(middleBreakdown!.annualSalaryPerPerson).toBeGreaterThan(juniorBreakdown!.annualSalaryPerPerson);
    });

    test('メンバー個別の給与形式に対応', () => {
      const teamData: TeamCostData = {
        id: 'team-mixed',
        name: '混合チーム',
        positions: [
          { id: 'pos-1', name: '正社員', count: 2 },
          { id: 'pos-2', name: '業務委託', count: 1 },
        ],
        salaryData: {
          positions: {
            '正社員': { type: 'monthly', amount: 40 }, // 月収40万円
            '業務委託': { type: 'hourly', amount: 4000 }, // 時給4000円
          }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      const result = calculateTeamCost(teamData);

      const regularBreakdown = result.positionBreakdown.find(p => p.positionName === '正社員');
      const contractBreakdown = result.positionBreakdown.find(p => p.positionName === '業務委託');

      expect(regularBreakdown).toBeDefined();
      expect(contractBreakdown).toBeDefined();

      // 正社員: 40万円/月 × 12 = 480万円/年
      expect(regularBreakdown!.annualSalaryPerPerson).toBe(40 * 10000 * 12);
      // 業務委託: 4000円/時 × 8時間 × 250日 = 800万円/年
      expect(contractBreakdown!.annualSalaryPerPerson).toBe(4000 * 8 * 250);
    });

    test('総労働時間の計算', () => {
      const teamData = createTestTeamCostData();
      const result = calculateTeamCost(teamData);

      // 総メンバー数: 1 + 2 + 3 = 6人
      // 年間労働時間: 6人 × 8時間 × 250日 = 12,000時間
      const totalMembers = 1 + 2 + 3;
      const expectedAnnualHours = totalMembers * 8 * 250;
      const expectedMonthlyHours = expectedAnnualHours / 12;

      expect(result.totalAnnualHours).toBe(expectedAnnualHours);
      expect(result.totalMonthlyHours).toBe(expectedMonthlyHours);
    });
  });

  describe('createDefaultTeamCostData', () => {
    test('デフォルトチームデータの作成', () => {
      const result = createDefaultTeamCostData();

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('positions');
      expect(result).toHaveProperty('salaryData');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');

      expect(result.name).toBe('作業チーム');
      expect(result.positions).toHaveLength(3); // リーダー、ミドル、ジュニア
    });

    test('デフォルトの役職設定', () => {
      const result = createDefaultTeamCostData();

      const positions = result.positions;
      expect(positions.find(p => p.name === 'リーダー')).toBeDefined();
      expect(positions.find(p => p.name === 'ミドル')).toBeDefined();
      expect(positions.find(p => p.name === 'ジュニア')).toBeDefined();

      const leaderSalary = result.salaryData.positions['リーダー'];
      const middleSalary = result.salaryData.positions['ミドル'];
      const juniorSalary = result.salaryData.positions['ジュニア'];

      expect(leaderSalary).toBeDefined();
      expect(middleSalary).toBeDefined();
      expect(juniorSalary).toBeDefined();

      expect(leaderSalary!.amount).toBe(55);
      expect(middleSalary!.amount).toBe(40);
      expect(juniorSalary!.amount).toBe(20);
    });

    test('デフォルトの給与形式設定', () => {
      const result = createDefaultTeamCostData();

      const leaderSalary = result.salaryData.positions['リーダー'];
      const middleSalary = result.salaryData.positions['ミドル'];
      const juniorSalary = result.salaryData.positions['ジュニア'];

      expect(leaderSalary).toBeDefined();
      expect(middleSalary).toBeDefined();
      expect(juniorSalary).toBeDefined();

      // 各役職が個別に給与形式を持つ
      expect(leaderSalary!.type).toBe('monthly');
      expect(middleSalary!.type).toBe('monthly');
      expect(juniorSalary!.type).toBe('monthly');
    });
  });

  describe('validateTeamCostData', () => {
    test('有効なデータの検証', () => {
      const teamData = createTestTeamCostData();
      const errors = validateTeamCostData(teamData);

      expect(errors).toHaveLength(0);
    });

    test('メンバー構成が空の場合', () => {
      const teamData = createTestTeamCostData();
      teamData.positions = [];

      const errors = validateTeamCostData(teamData);

      expect(errors).toContain('メンバー構成が設定されていません');
    });

    test('給与が未設定の役職がある場合', () => {
      const teamData = createTestTeamCostData();
      teamData.positions.push({ id: 'pos-4', name: '新役職', count: 1 });

      const errors = validateTeamCostData(teamData);

      expect(errors).toContain('給与が設定されていない役職があります: 新役職');
    });

    test('給与額が0の役職がある場合', () => {
      const teamData: TeamCostData = {
        id: 'team-zero',
        name: '給与0チーム',
        positions: [
          { id: 'pos-1', name: 'ゼロ給与', count: 1 }
        ],
        salaryData: {
          positions: {
            'ゼロ給与': { type: 'monthly', amount: 0 }
          }
        },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };

      const errors = validateTeamCostData(teamData);

      expect(errors).toContain('給与が設定されていない役職があります: ゼロ給与');
    });
  });
});
