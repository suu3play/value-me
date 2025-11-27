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
    const workingRate = position.workingRate ?? 100; // デフォルト100%
    const annualSalaryPerPerson = calculateAnnualSalary(salaryInfo.amount, salaryInfo.type);
    // 稼働率を考慮した給与計算
    const adjustedAnnualSalary = annualSalaryPerPerson * (workingRate / 100);
    const totalAnnualSalary = adjustedAnnualSalary * position.count;
    const hourlyRate = calculateHourlyRate(annualSalaryPerPerson);

    return {
      positionName: position.name,
      count: position.count,
      workingRate,
      annualSalaryPerPerson: adjustedAnnualSalary,
      totalAnnualSalary,
      hourlyRate,
    };
  });

  // 基本給与の合計
  const baseSalaryCost = positionBreakdown.reduce((sum, pos) => sum + pos.totalAnnualSalary, 0);

  // 法定福利費の計算
  const welfareRate = data.welfareRate ?? 15; // デフォルト15%
  const welfareCost = data.includeWelfareCost ? baseSalaryCost * (welfareRate / 100) : 0;

  // 間接費の計算
  const overheadRate = data.overheadRate ?? 25; // デフォルト25%
  const overheadCost = data.includeOverheadCost ? baseSalaryCost * (overheadRate / 100) : 0;

  // 総コスト
  const totalAnnualCost = baseSalaryCost + welfareCost + overheadCost;

  // 総労働時間を計算（年間労働日数 × 8時間 × 総メンバー数 × 稼働率）
  const totalAnnualHours = data.positions.reduce((sum, pos) => {
    const workingRate = pos.workingRate ?? 100;
    return sum + (250 * 8 * pos.count * (workingRate / 100));
  }, 0);
  const totalMonthlyHours = totalAnnualHours / 12;

  return {
    totalAnnualCost,
    totalMonthlyHours,
    totalAnnualHours,
    positionBreakdown,
    baseSalaryCost,
    welfareCost,
    overheadCost,
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
    // eslint-disable-next-line security/detect-object-injection
    !(name in data.salaryData.positions) || !data.salaryData.positions[name] || data.salaryData.positions[name].amount === 0
  );

  if (missingSalaries.length > 0) {
    errors.push(`給与が設定されていない役職があります: ${missingSalaries.join(', ')}`);
  }

  return errors;
};