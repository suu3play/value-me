import { describe, test, expect } from 'vitest';
import { 
  calculateAnnualSalary,
  calculateHourlyRate,
  calculateAnnualExecutions,
  calculateTeamAverageHourlyRate,
  calculateTeamCost,
  createDefaultTeamCostData,
  validateTeamCostData
} from '../teamCostCalculations';
import type { TeamCostData, Position, WorkItem, SalaryData } from '../../types/teamCost';

describe('teamCostCalculations', () => {
  const createTestSalaryData = (): SalaryData => ({
    type: 'monthly',
    positions: {
      'リーダー': 50,
      'ミドル': 35,
      'ジュニア': 20,
    }
  });

  const createTestPositions = (): Position[] => [
    { id: 'pos-1', name: 'リーダー', count: 1 },
    { id: 'pos-2', name: 'ミドル', count: 2 },
    { id: 'pos-3', name: 'ジュニア', count: 3 }
  ];

  const createTestWorkItems = (): WorkItem[] => [
    { id: 'work-1', name: '定例会', frequency: 'weekly', hours: 1 },
    { id: 'work-2', name: 'ドキュメント作成', frequency: 'monthly', hours: 4 },
    { id: 'work-3', name: '日次ミーティング', frequency: 'daily', hours: 0.5 }
  ];

  const createTestTeamCostData = (): TeamCostData => ({
    id: 'team-test',
    name: 'テストチーム',
    positions: createTestPositions(),
    workItems: createTestWorkItems(),
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
      const result = calculateAnnualSalary(100, 'invalid' as unknown as 'monthly' | 'annual');
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

  describe('calculateAnnualExecutions', () => {
    test('日次実行頻度', () => {
      const result = calculateAnnualExecutions('daily');
      expect(result).toBe(365);
    });

    test('週次実行頻度', () => {
      const result = calculateAnnualExecutions('weekly');
      expect(result).toBe(52);
    });

    test('月次実行頻度', () => {
      const result = calculateAnnualExecutions('monthly');
      expect(result).toBe(12);
    });

    test('年次実行頻度', () => {
      const result = calculateAnnualExecutions('yearly');
      expect(result).toBe(1);
    });
  });

  describe('calculateTeamAverageHourlyRate', () => {
    test('複数役職の平均時給計算', () => {
      const positions = createTestPositions();
      const salaryData = createTestSalaryData();
      
      const result = calculateTeamAverageHourlyRate(positions, salaryData);
      
      expect(result).toBeGreaterThan(0);
      // リーダー1人、ミドル2人、ジュニア3人の平均時給が計算される
    });

    test('メンバーが0人の場合', () => {
      const positions: Position[] = [];
      const salaryData = createTestSalaryData();
      
      const result = calculateTeamAverageHourlyRate(positions, salaryData);
      
      expect(result).toBe(0);
    });

    test('給与データが未設定の役職を含む場合', () => {
      const positions: Position[] = [
        { id: 'pos-1', name: 'リーダー', count: 1 },
        { id: 'pos-2', name: '未設定役職', count: 1 }
      ];
      const salaryData = createTestSalaryData();
      
      const result = calculateTeamAverageHourlyRate(positions, salaryData);
      
      // 未設定役職は0円として計算される
      expect(result).toBeGreaterThan(0);
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
      expect(result).toHaveProperty('workBreakdown');

      expect(result.totalAnnualCost).toBeGreaterThan(0);
      expect(result.totalAnnualHours).toBeGreaterThan(0);
      expect(result.positionBreakdown).toHaveLength(3); // リーダー、ミドル、ジュニア
      expect(result.workBreakdown).toHaveLength(3); // 定例会、ドキュメント作成、日次ミーティング
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

    test('作業別内訳の計算', () => {
      const teamData = createTestTeamCostData();
      const result = calculateTeamCost(teamData);

      const weeklyWork = result.workBreakdown.find(w => w.frequency === 'weekly');
      const monthlyWork = result.workBreakdown.find(w => w.frequency === 'monthly');
      const dailyWork = result.workBreakdown.find(w => w.frequency === 'daily');

      expect(weeklyWork).toBeDefined();
      expect(monthlyWork).toBeDefined();
      expect(dailyWork).toBeDefined();

      expect(weeklyWork!.annualExecutions).toBe(52);
      expect(monthlyWork!.annualExecutions).toBe(12);
      expect(dailyWork!.annualExecutions).toBe(365);

      // 日次作業の年間総時間が最も多い
      expect(dailyWork!.totalAnnualHours).toBeGreaterThan(weeklyWork!.totalAnnualHours);
      expect(dailyWork!.totalAnnualHours).toBeGreaterThan(monthlyWork!.totalAnnualHours);
    });
  });

  describe('createDefaultTeamCostData', () => {
    test('デフォルトチームデータの作成', () => {
      const result = createDefaultTeamCostData();

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('positions');
      expect(result).toHaveProperty('workItems');
      expect(result).toHaveProperty('salaryData');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');

      expect(result.name).toBe('作業チーム');
      expect(result.positions).toHaveLength(3); // リーダー、ミドル、ジュニア
      expect(result.workItems).toHaveLength(3); // 定例会、ドキュメント作成、日次MTG
      expect(result.salaryData.type).toBe('monthly');
    });

    test('デフォルトの役職設定', () => {
      const result = createDefaultTeamCostData();
      
      const positions = result.positions;
      expect(positions.find(p => p.name === 'リーダー')).toBeDefined();
      expect(positions.find(p => p.name === 'ミドル')).toBeDefined();
      expect(positions.find(p => p.name === 'ジュニア')).toBeDefined();

      expect(result.salaryData.positions['リーダー']).toBe(55);
      expect(result.salaryData.positions['ミドル']).toBe(40);
      expect(result.salaryData.positions['ジュニア']).toBe(20);
    });

    test('デフォルトの作業項目設定', () => {
      const result = createDefaultTeamCostData();
      
      const workItems = result.workItems;
      expect(workItems.find(w => w.name === '定例会')).toBeDefined();
      expect(workItems.find(w => w.name === 'ドキュメント作成')).toBeDefined();
      expect(workItems.find(w => w.name === '日次MTG')).toBeDefined();
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

    test('作業項目が空の場合', () => {
      const teamData = createTestTeamCostData();
      teamData.workItems = [];
      
      const errors = validateTeamCostData(teamData);
      
      expect(errors).toContain('作業項目が設定されていません');
    });

    test('給与が未設定の役職がある場合', () => {
      const teamData = createTestTeamCostData();
      teamData.positions.push({ id: 'pos-4', name: '新役職', count: 1 });
      
      const errors = validateTeamCostData(teamData);
      
      expect(errors).toContain('給与が設定されていない役職があります: 新役職');
    });

    test('複数のエラーが検出される場合', () => {
      const teamData: TeamCostData = {
        id: 'invalid-team',
        name: '無効チーム',
        positions: [],
        workItems: [],
        salaryData: { type: 'monthly', positions: {} },
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      };
      
      const errors = validateTeamCostData(teamData);
      
      expect(errors).toHaveLength(2);
      expect(errors).toContain('メンバー構成が設定されていません');
      expect(errors).toContain('作業項目が設定されていません');
    });
  });
});