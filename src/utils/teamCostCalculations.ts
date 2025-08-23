import type { 
  TeamCostData, 
  CostCalculationResult, 
  Position, 
  WorkItem, 
  SalaryData,
  FREQUENCY_MULTIPLIERS 
} from '../types/teamCost';

// 役職ごとの年収を計算
export const calculateAnnualSalary = (amount: number, type: SalaryData['type']): number => {
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

// 年間実行回数を計算
export const calculateAnnualExecutions = (frequency: WorkItem['frequency']): number => {
  const multipliers = {
    daily: 365,
    weekly: 52,
    monthly: 12,
    yearly: 1,
  };
  return multipliers[frequency];
};

// チームの平均時給を計算
export const calculateTeamAverageHourlyRate = (
  positions: Position[], 
  salaryData: SalaryData
): number => {
  const totalMembers = positions.reduce((sum, pos) => sum + pos.count, 0);
  if (totalMembers === 0) return 0;

  const totalHourlyCost = positions.reduce((sum, pos) => {
    const annualSalary = calculateAnnualSalary(
      salaryData.positions[pos.name] || 0, 
      salaryData.type
    );
    const hourlyRate = calculateHourlyRate(annualSalary);
    return sum + (hourlyRate * pos.count);
  }, 0);

  return totalHourlyCost / totalMembers;
};

// メインのコスト計算関数
export const calculateTeamCost = (data: TeamCostData): CostCalculationResult => {
  // 役職別の内訳を計算
  const positionBreakdown = data.positions.map(position => {
    const salaryAmount = data.salaryData.positions[position.name] || 0;
    const annualSalaryPerPerson = calculateAnnualSalary(salaryAmount, data.salaryData.type);
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

  // チーム全体の時給平均
  const teamAverageHourlyRate = calculateTeamAverageHourlyRate(data.positions, data.salaryData);

  // 作業別の内訳を計算
  const workBreakdown = data.workItems.map(workItem => {
    const annualExecutions = calculateAnnualExecutions(workItem.frequency);
    const totalAnnualHours = workItem.hours * annualExecutions;
    const costPerExecution = workItem.hours * teamAverageHourlyRate;
    const totalAnnualCost = costPerExecution * annualExecutions;

    return {
      workName: workItem.name,
      frequency: workItem.frequency,
      hoursPerExecution: workItem.hours,
      annualExecutions,
      totalAnnualHours,
      costPerExecution,
      totalAnnualCost,
    };
  });

  // 全体の合計を計算
  const totalAnnualCost = workBreakdown.reduce((sum, work) => sum + work.totalAnnualCost, 0);
  const totalAnnualHours = workBreakdown.reduce((sum, work) => sum + work.totalAnnualHours, 0);
  const totalMonthlyHours = totalAnnualHours / 12;

  return {
    totalAnnualCost,
    totalMonthlyHours,
    totalAnnualHours,
    positionBreakdown,
    workBreakdown,
  };
};

// デフォルトデータを作成
export const createDefaultTeamCostData = (): TeamCostData => {
  const defaultPositions: Position[] = [
    { id: `pos_${Date.now()}_1`, name: 'リーダー', count: 1 },
    { id: `pos_${Date.now()}_2`, name: 'ミドル', count: 1 },
    { id: `pos_${Date.now()}_3`, name: 'ジュニア', count: 3 },
  ];

  const defaultWorkItems: WorkItem[] = [
    { id: `work_${Date.now()}_1`, name: '定例会', frequency: 'monthly', hours: 2 },
    { id: `work_${Date.now()}_2`, name: 'ドキュメント作成', frequency: 'weekly', hours: 1 },
    { id: `work_${Date.now()}_3`, name: '日次MTG', frequency: 'daily', hours: 0.5 },
  ];

  return {
    id: `team_${Date.now()}`,
    name: '作業チーム',
    positions: defaultPositions,
    workItems: defaultWorkItems,
    salaryData: {
      type: 'monthly',
      positions: {
        'リーダー': 55,
        'ミドル': 40,
        'ジュニア': 20,
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

  if (data.workItems.length === 0) {
    errors.push('作業項目が設定されていません');
  }

  const positionNames = data.positions.map(p => p.name);
  const missingSalaries = positionNames.filter(name => 
    !(name in data.salaryData.positions) || data.salaryData.positions[name] === 0
  );

  if (missingSalaries.length > 0) {
    errors.push(`給与が設定されていない役職があります: ${missingSalaries.join(', ')}`);
  }

  return errors;
};