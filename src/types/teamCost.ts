// 役職ベースのチームコスト計算用型定義

export interface Position {
  id: string;
  name: string;
  count: number;
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
}