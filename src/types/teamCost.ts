// 役職ベースのチームコスト計算用型定義

export interface Position {
  id: string;
  name: string;
  count: number;
  workingRate?: number; // 稼働率 0-100 (%)、デフォルト100
}

export interface SalaryData {
  positions: {
    [positionName: string]: {
      type: 'hourly' | 'monthly' | 'annual';
      amount: number;
    };
  };
}

export interface TeamCostData {
  id: string;
  name: string;
  positions: Position[];
  salaryData: SalaryData;
  // 法定福利費・間接費設定
  includeWelfareCost?: boolean; // 法定福利費を含む
  welfareRate?: number; // デフォルト15%
  includeOverheadCost?: boolean; // 間接費を含む
  overheadRate?: number; // デフォルト25%
  createdAt: string;
  updatedAt: string;
}

export interface CostCalculationResult {
  totalAnnualCost: number;
  totalMonthlyHours: number;
  totalAnnualHours: number;
  positionBreakdown: {
    positionName: string;
    count: number;
    workingRate: number;
    annualSalaryPerPerson: number;
    totalAnnualSalary: number;
    hourlyRate: number;
  }[];
  // コスト内訳
  baseSalaryCost: number; // 基本給与
  welfareCost: number; // 法定福利費
  overheadCost: number; // 間接費
}