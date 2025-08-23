// 役職ベースのチームコスト計算用型定義

export interface Position {
  id: string;
  name: string;
  count: number;
}

export interface WorkItem {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  hours: number;
}

export interface SalaryData {
  type: 'hourly' | 'monthly' | 'annual';
  positions: {
    [positionName: string]: number; // 役職名 -> 金額
  };
}

export interface TeamCostData {
  id: string;
  name: string;
  positions: Position[];
  workItems: WorkItem[];
  salaryData: SalaryData;
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
    annualSalaryPerPerson: number;
    totalAnnualSalary: number;
    hourlyRate: number;
  }[];
  workBreakdown: {
    workName: string;
    frequency: string;
    hoursPerExecution: number;
    annualExecutions: number;
    totalAnnualHours: number;
    costPerExecution: number;
    totalAnnualCost: number;
  }[];
}

// 頻度計算用のヘルパー型
export interface FrequencyMultiplier {
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export const FREQUENCY_MULTIPLIERS: FrequencyMultiplier = {
  daily: 365,
  weekly: 52,
  monthly: 12,
  yearly: 1,
};

export const FREQUENCY_LABELS = {
  daily: '日次',
  weekly: '週次',
  monthly: '月次',
  yearly: '年次',
} as const;