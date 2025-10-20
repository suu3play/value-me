import type { SalaryCalculationData, CalculationResult } from '../types';
import { holidayService, type HolidayCount } from '../services/holidayService';

export interface DynamicHolidayOptions {
  year?: number;
  useCurrentYear?: boolean;
}

export const calculateHourlyWageWithDynamicHolidays = async (
  data: SalaryCalculationData, 
  options: DynamicHolidayOptions = {}
): Promise<CalculationResult> => {
  const salaryAmount = isNaN(data.salaryAmount) || data.salaryAmount < 0 ? 0 : data.salaryAmount;
  const dailyWorkingHours = isNaN(data.dailyWorkingHours) || data.dailyWorkingHours < 0 ? 0 : data.dailyWorkingHours;
  
  let annualIncome = salaryAmount;
  if (data.salaryType === 'monthly') {
    annualIncome = salaryAmount * 12;
  }

  let actualAnnualIncome = annualIncome;
  
  if (data.welfareInputMethod === 'total') {
    const welfareAmount = isNaN(data.welfareAmount) || data.welfareAmount < 0 ? 0 : data.welfareAmount;
    let welfareAnnual = welfareAmount;
    if (data.welfareType === 'monthly') {
      welfareAnnual = welfareAmount * 12;
    }
    actualAnnualIncome += welfareAnnual;
  } else if (data.welfareInputMethod === 'individual') {
    const housingAllowance = isNaN(data.housingAllowance) || data.housingAllowance < 0 ? 0 : data.housingAllowance;
    const regionalAllowance = isNaN(data.regionalAllowance) || data.regionalAllowance < 0 ? 0 : data.regionalAllowance;
    const familyAllowance = isNaN(data.familyAllowance) || data.familyAllowance < 0 ? 0 : data.familyAllowance;
    const qualificationAllowance = isNaN(data.qualificationAllowance) || data.qualificationAllowance < 0 ? 0 : data.qualificationAllowance;
    const otherAllowance = isNaN(data.otherAllowance) || data.otherAllowance < 0 ? 0 : data.otherAllowance;
    
    let allowancesAnnual = (
      housingAllowance +
      regionalAllowance +
      familyAllowance +
      qualificationAllowance +
      otherAllowance
    );
    
    if (data.welfareType === 'monthly') {
      allowancesAnnual = allowancesAnnual * 12;
    }
    
    actualAnnualIncome += allowancesAnnual;
  }

  const summerBonus = isNaN(data.summerBonus) || data.summerBonus < 0 ? 0 : data.summerBonus;
  const winterBonus = isNaN(data.winterBonus) || data.winterBonus < 0 ? 0 : data.winterBonus;
  const settlementBonus = isNaN(data.settlementBonus) || data.settlementBonus < 0 ? 0 : data.settlementBonus;
  const otherBonus = isNaN(data.otherBonus) || data.otherBonus < 0 ? 0 : data.otherBonus;
  
  const bonuses = summerBonus + winterBonus + settlementBonus + otherBonus;
  actualAnnualIncome += bonuses;

  const targetYear = options.year || (options.useCurrentYear ? new Date().getFullYear() : new Date().getFullYear());
  const isFiscal = data.holidayYearType === 'fiscal';
  
  let totalAnnualHolidays: number;
  let totalYearDays: number;
  
  try {
    const holidayCount = await holidayService.getHolidayCount(targetYear, isFiscal);
    totalAnnualHolidays = calculateDynamicTotalHolidays(holidayCount, data);
    totalYearDays = getTotalDaysInPeriod(targetYear, isFiscal);
  } catch (error) {
    console.warn('動的祝日取得に失敗しました。フォールバック計算を使用します:', error);
    totalAnnualHolidays = calculateFallbackHolidays(data);
    totalYearDays = 365; // フォールバック時は365日
  }

  const workingDays = totalYearDays - totalAnnualHolidays;
  
  let actualDailyWorkingHours = dailyWorkingHours;
  switch (data.workingHoursType) {
    case 'weekly':
      actualDailyWorkingHours = dailyWorkingHours / 5;
      break;
    case 'monthly':
      actualDailyWorkingHours = dailyWorkingHours / 22;
      break;
    default:
      actualDailyWorkingHours = dailyWorkingHours;
  }
  
  const totalWorkingHours = workingDays * actualDailyWorkingHours;

  // 月平均労働日数の計算（年間労働日数から算出）
  const monthlyAverageWorkingDays = workingDays / 12;

  // 残業時間を年間に変換
  let annualOvertimeHours = 0;
  let annualNightOvertimeHours = 0;

  switch (data.workingHoursType) {
    case 'daily':
      // 日単位：年間労働日数を掛ける
      annualOvertimeHours = (data.overtimeHours || 0) * workingDays;
      annualNightOvertimeHours = (data.nightOvertimeHours || 0) * workingDays;
      break;
    case 'weekly':
      // 週単位：年間週数（約52.14週）を掛ける
      annualOvertimeHours = (data.overtimeHours || 0) * 52.14;
      annualNightOvertimeHours = (data.nightOvertimeHours || 0) * 52.14;
      break;
    default: // monthly
      // 月単位：12ヶ月を掛ける
      annualOvertimeHours = (data.overtimeHours || 0) * 12;
      annualNightOvertimeHours = (data.nightOvertimeHours || 0) * 12;
  }

  // 残業時間の合計
  const totalAnnualOvertimeHours = (isNaN(annualOvertimeHours) || annualOvertimeHours < 0 ? 0 : annualOvertimeHours) +
                                   (isNaN(annualNightOvertimeHours) || annualNightOvertimeHours < 0 ? 0 : annualNightOvertimeHours);

  // 基本時給の計算（残業代を除く月給ベース）
  const monthlyBaseSalary = data.salaryType === 'monthly' ? salaryAmount : salaryAmount / 12;
  const monthlyBaseWorkingHours = actualDailyWorkingHours * monthlyAverageWorkingDays;
  const baseHourlyWage = monthlyBaseWorkingHours > 0 ? monthlyBaseSalary / monthlyBaseWorkingHours : 0;

  // 残業代の計算（割増率適用）
  const normalOvertimePay = baseHourlyWage * 1.25 * annualOvertimeHours;  // 通常残業：1.25倍
  const nightOvertimePay = baseHourlyWage * 1.5 * annualNightOvertimeHours;  // 深夜残業：1.5倍
  const annualOvertimePay = normalOvertimePay + nightOvertimePay;

  // 残業代を年収に加算
  actualAnnualIncome += annualOvertimePay;

  // 残業時間を年間労働時間に加算
  const totalWorkingHoursWithOvertime = totalWorkingHours + totalAnnualOvertimeHours;

  // 時給の計算（残業代・残業時間を含む）
  const hourlyWage = totalWorkingHoursWithOvertime > 0 ? actualAnnualIncome / totalWorkingHoursWithOvertime : 0;

  return {
    hourlyWage: isNaN(hourlyWage) ? 0 : Math.round(hourlyWage),
    actualAnnualIncome: isNaN(actualAnnualIncome) ? 0 : Math.round(actualAnnualIncome),
    actualMonthlyIncome: isNaN(actualAnnualIncome) ? 0 : Math.round(actualAnnualIncome / 12),
    totalWorkingHours: isNaN(totalWorkingHoursWithOvertime) ? 0 : Math.round(totalWorkingHoursWithOvertime),
    totalAnnualHolidays: isNaN(totalAnnualHolidays) ? 0 : totalAnnualHolidays,
    baseHourlyWage: totalAnnualOvertimeHours > 0 ? Math.round(baseHourlyWage) : undefined,
    overtimePay: totalAnnualOvertimeHours > 0 ? Math.round(annualOvertimePay / 12) : undefined,
    totalOvertimeHours: totalAnnualOvertimeHours > 0 ? Math.round(totalAnnualOvertimeHours / 12) : undefined,
  };
};

function getTotalDaysInPeriod(year: number, isFiscal: boolean): number {
  if (isFiscal) {
    // 年度：4月1日 - 翌年3月31日
    const startDate = new Date(year, 3, 1); // 4月1日
    const endDate = new Date(year + 1, 2, 31); // 翌年3月31日
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  } else {
    // 暦年の日数（うるう年考慮）
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    return isLeapYear ? 366 : 365;
  }
}

function calculateDynamicTotalHolidays(holidayCount: HolidayCount, data: SalaryCalculationData): number {
  // 動的祝日計算では、実際の休日分類に基づいて計算
  const annualHolidays = isNaN(data.annualHolidays) || data.annualHolidays < 0 ? 0 : data.annualHolidays;
  let totalHolidays: number;
  
  // 月一回の土日出勤を考慮（年12回）
  const monthlyWeekendWork = 12;
  
  // 新しい休日タイプの判定（動的計算された値の範囲で判定）
  const weeklyTwoDay = holidayCount.weekendDays - monthlyWeekendWork;
  const weeklyTwoDayWithHolidays = holidayCount.totalHolidays - monthlyWeekendWork;
  const fullWeekendOnly = holidayCount.weekendDays;
  const fullWeekendWithHolidays = holidayCount.totalHolidays;
  
  if (Math.abs(annualHolidays - weeklyTwoDay) <= 2) {
    // 週休二日制（土日）：土日 - 月一回出勤 + 祝日
    totalHolidays = weeklyTwoDay;
  } else if (Math.abs(annualHolidays - weeklyTwoDayWithHolidays) <= 2) {
    // 週休二日制（土日祝）：土日祝 - 月一回出勤
    totalHolidays = weeklyTwoDayWithHolidays;
  } else if (Math.abs(annualHolidays - fullWeekendOnly) <= 2) {
    // 完全週休二日制（土日）：土日のみ
    totalHolidays = fullWeekendOnly;
  } else if (Math.abs(annualHolidays - fullWeekendWithHolidays) <= 2) {
    // 完全週休二日制（土日祝）：土日 + 祝日
    totalHolidays = fullWeekendWithHolidays;
  } else {
    // その他：入力値をそのまま使用
    totalHolidays = annualHolidays;
  }
  
  if (data.goldenWeekHolidays) {
    const isWeeklyType = Math.abs(annualHolidays - weeklyTwoDay) <= 2 || Math.abs(annualHolidays - weeklyTwoDayWithHolidays) <= 2;
    const hasHolidayOff = Math.abs(annualHolidays - weeklyTwoDayWithHolidays) <= 2 || Math.abs(annualHolidays - fullWeekendWithHolidays) <= 2;
    
    if (hasHolidayOff) {
      totalHolidays += 4; // 祝日除外
    } else if (isWeeklyType) {
      totalHolidays += 6; // 平日のみ
    } else {
      totalHolidays += 10; // 全日
    }
  }
  
  if (data.obon) {
    totalHolidays += 5;
  }
  
  if (data.yearEndNewYear) {
    const isWeeklyType = Math.abs(annualHolidays - weeklyTwoDay) <= 2 || Math.abs(annualHolidays - weeklyTwoDayWithHolidays) <= 2;
    const hasHolidayOff = Math.abs(annualHolidays - weeklyTwoDayWithHolidays) <= 2 || Math.abs(annualHolidays - fullWeekendWithHolidays) <= 2;
    
    if (hasHolidayOff) {
      totalHolidays += 3; // 祝日除外
    } else if (isWeeklyType) {
      totalHolidays += 4; // 平日のみ
    } else {
      totalHolidays += 6; // 全日
    }
  }
  
  const customHolidays = isNaN(data.customHolidays) || data.customHolidays < 0 ? 0 : data.customHolidays;
  totalHolidays += customHolidays;
  
  return totalHolidays;
}


function calculateFallbackHolidays(data: SalaryCalculationData): number {
  const annualHolidays = isNaN(data.annualHolidays) || data.annualHolidays < 0 ? 0 : data.annualHolidays;
  let totalAnnualHolidays = annualHolidays;
  
  if (data.goldenWeekHolidays) {
    let gwDays = 10;
    if (annualHolidays === 120 || annualHolidays === 124) {
      gwDays = 6;
    }
    if (annualHolidays === 124) {
      gwDays = 4;
    }
    totalAnnualHolidays += gwDays;
  }
  
  if (data.obon) {
    totalAnnualHolidays += 5;
  }
  
  if (data.yearEndNewYear) {
    let yearEndDays = 6;
    if (annualHolidays === 120 || annualHolidays === 124) {
      yearEndDays = 4;
    }
    if (annualHolidays === 124) {
      yearEndDays = 3;
    }
    totalAnnualHolidays += yearEndDays;
  }
  
  const customHolidays = isNaN(data.customHolidays) || data.customHolidays < 0 ? 0 : data.customHolidays;
  totalAnnualHolidays += customHolidays;
  
  return totalAnnualHolidays;
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('ja-JP').format(number);
};