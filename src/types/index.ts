export interface SalaryCalculationData {
  salaryType: 'monthly' | 'annual';
  salaryAmount: number;
  annualHolidays: number;
  dailyWorkingHours: number;
  workingHoursType: 'daily' | 'weekly' | 'monthly';
  
  // 祝日計算オプション
  useDynamicHolidays?: boolean;
  holidayYear?: number;
  holidayYearType?: 'calendar' | 'fiscal';
  
  // オプション機能
  enableBenefits: boolean;
  welfareAmount: number;
  welfareType: 'monthly' | 'annual';
  welfareInputMethod: 'total' | 'individual';
  
  // 手当
  housingAllowance: number;
  regionalAllowance: number;
  familyAllowance: number;
  qualificationAllowance: number;
  otherAllowance: number;
  
  // ボーナス
  summerBonus: number;
  winterBonus: number;
  settlementBonus: number;
  otherBonus: number;
  
  // カスタム休日
  goldenWeekHolidays: boolean;
  obon: boolean;
  yearEndNewYear: boolean;
  customHolidays: number;

  // 残業時間（月間）
  overtimeHours?: number;          // 通常残業時間
  nightOvertimeHours?: number;     // 深夜残業時間（22時〜5時）

}

export interface CalculationResult {
  hourlyWage: number;
  actualAnnualIncome: number;
  actualMonthlyIncome: number;
  totalWorkingHours: number;
  totalAnnualHolidays: number;
  baseHourlyWage?: number;         // 基本時給（残業代計算用）
  overtimePay?: number;            // 月間残業代合計
  totalOvertimeHours?: number;     // 月間残業時間合計
}


export interface HolidayShortcut {
  label: string;
  days: number;
  description?: string;
}

export interface CalculationHistoryEntry {
  id: string;
  timestamp: number;
  inputData: SalaryCalculationData;
  result: CalculationResult;
  label?: string;
}

// 比較機能用の型定義
export interface ComparisonItem {
  id: string;
  label: string;
  data: SalaryCalculationData;
  result?: CalculationResult;
}

export interface ComparisonState {
  items: ComparisonItem[];
  activeItemId: string | null;
  mode: 'single' | 'comparison';
}

export interface ComparisonResult {
  items: ComparisonItem[];
  highest: {
    hourlyWage: ComparisonItem | null;
    annualIncome: ComparisonItem | null;
  };
  lowest: {
    hourlyWage: ComparisonItem | null;
    annualIncome: ComparisonItem | null;
  };
  differences: {
    maxHourlyWageDiff: number;
    maxHourlyWageDiffPercent: number;
    maxAnnualIncomeDiff: number;
    maxAnnualIncomeDiffPercent: number;
  };
}

// チーム機能用の型定義
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  salaryData: SalaryCalculationData;
  isActive: boolean;
  joinDate: string;
  notes?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  members: TeamMember[];
  createdAt: string;
  updatedAt: string;
}

export type CostCalculationMethod = 'average' | 'individual' | 'byRole';

export interface TeamCostCalculation {
  method: CostCalculationMethod;
  teamId: string;
  totalHourlyCost: number;
  totalMonthlyCost: number;
  totalAnnualCost: number;
  memberBreakdown: {
    memberId: string;
    name: string;
    role: string;
    hourlyWage: number;
    monthlyIncome: number;
    annualIncome: number;
  }[];
}

export interface TaskDefinition {
  id: string;
  name: string;
  description?: string;
  estimatedMinutes: number;
  frequency: TaskFrequency;
  teamId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export interface TaskFrequency {
  type: 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number; // type が 'daily', 'weekly', 'monthly', 'yearly' の場合のみ
  daysOfWeek?: number[]; // type が 'weekly' の場合のみ (0=日曜日, 1=月曜日, ...)
  dayOfMonth?: number; // type が 'monthly' の場合のみ
  monthOfYear?: number; // type が 'yearly' の場合のみ
}

export interface TaskCostAnalysis {
  taskId: string;
  taskName: string;
  singleExecutionCost: number;
  annualExecutionCount: number;
  annualTotalCost: number;
  costPerMinute: number;
  teamCostCalculation: TeamCostCalculation;
}

export interface TeamTaskOverview {
  teamId: string;
  teamName: string;
  totalTasks: number;
  totalAnnualCost: number;
  totalAnnualHours: number;
  highestCostTask: TaskCostAnalysis | null;
  tasks: TaskCostAnalysis[];
}

