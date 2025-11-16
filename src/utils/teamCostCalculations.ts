import type {
  TeamCostData,
  CostCalculationResult,
  Position
} from '../types/teamCost';

// 役職ごとの年収を計算
export const calculateAnnualSalary = (amount: number, type: 'hourly' | 'monthly' | 'annual'): number => {
  switch (type) {
    case 'hourly':
      return amount * 8 * 250; // 時給 × 8時間 × 250日
    case 'monthly':
      return amount * 10000 * 12; // 万円/月 → 円/年
    case 'annual':
      return amount * 10000; // 万円/年 → 円/年
    default:
      return 0;
  }
};

// 時給を計算
export const calculateHourlyRate = (annualSalary: number): number => {
  return annualSalary / (8 * 250); // 年収 ÷ (8時間 × 250日)
};

// メインのコスト計算関数
export const calculateTeamCost = (data: TeamCostData): CostCalculationResult => {
  // 役職別の内訳を計算
  const positionBreakdown = data.positions.map(position => {
    const salaryInfo = data.salaryData.positions[position.name] || { type: 'monthly', amount: 0 };
    const annualSalaryPerPerson = calculateAnnualSalary(salaryInfo.amount, salaryInfo.type);
    const totalAnnualSalary = annualSalaryPerPerson * position.count;
    const hourlyRate = calculateHourlyRate(annualSalaryPerPerson);

    return {
      positionName: position.name,
      count: position.count,
      annualSalaryPerPerson,
      totalAnnualSalary,
      hourlyRate,
    };
  });

  // 全体の合計を計算（役職別給与の総計）
  const totalAnnualCost = positionBreakdown.reduce((sum, pos) => sum + pos.totalAnnualSalary, 0);

  // 総労働時間を計算（年間労働日数 × 8時間 × 総メンバー数）
  const totalMembers = data.positions.reduce((sum, pos) => sum + pos.count, 0);
  const totalAnnualHours = 250 * 8 * totalMembers;
  const totalMonthlyHours = totalAnnualHours / 12;

  return {
    totalAnnualCost,
    totalMonthlyHours,
    totalAnnualHours,
    positionBreakdown,
  };
};

// デフォルトデータを作成
export const createDefaultTeamCostData = (): TeamCostData => {
  const defaultPositions: Position[] = [
    { id: `pos_${Date.now()}_1`, name: 'リーダー', count: 1 },
    { id: `pos_${Date.now()}_2`, name: 'ミドル', count: 1 },
    { id: `pos_${Date.now()}_3`, name: 'ジュニア', count: 3 },
  ];

  return {
    id: `team_${Date.now()}`,
    name: '作業チーム',
    positions: defaultPositions,
    salaryData: {
      positions: {
        'リーダー': { type: 'monthly', amount: 55 },
        'ミドル': { type: 'monthly', amount: 40 },
        'ジュニア': { type: 'monthly', amount: 20 },
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// データの検証
export const validateTeamCostData = (data: TeamCostData): string[] => {
  const errors: string[] = [];

  if (data.positions.length === 0) {
    errors.push('メンバー構成が設定されていません');
  }

  const positionNames = data.positions.map(p => p.name);
  const missingSalaries = positionNames.filter(name =>
    !(name in data.salaryData.positions) || !data.salaryData.positions[name] || data.salaryData.positions[name].amount === 0
  );

  if (missingSalaries.length > 0) {
    errors.push(`給与が設定されていない役職があります: ${missingSalaries.join(', ')}`);
  }

  return errors;
};