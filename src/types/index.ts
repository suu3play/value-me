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
}

export interface CalculationResult {
  hourlyWage: number;
  actualAnnualIncome: number;
  actualMonthlyIncome: number;
  totalWorkingHours: number;
  totalAnnualHolidays: number;
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