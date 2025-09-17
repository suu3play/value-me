import type { QualificationData, QualificationResult } from '../types/qualification';
import { QUALIFICATION_CONSTANTS } from '../types/qualification';

/**
 * 資格取得投資効果を計算する
 * @param data 資格取得データ
 * @returns 計算結果
 */
export const calculateQualificationROI = (data: QualificationData): QualificationResult => {
  // 入力値のバリデーション
  const validatedData = validateQualificationData(data);

  // 投資額の計算
  const opportunityCost = calculateOpportunityCost(validatedData);
  const directCosts = calculateDirectCosts(validatedData);
  const totalInvestment = opportunityCost + directCosts;

  // 年間効果の計算
  const annualAllowanceIncrease = Math.max(0, validatedData.expectedAllowance - validatedData.currentAllowance);
  const annualSalaryIncrease = Math.max(0, validatedData.salaryIncrease);
  const annualJobChangeIncrease = Math.max(0, validatedData.jobChangeIncrease);
  const totalAnnualBenefit = annualAllowanceIncrease + annualSalaryIncrease + annualJobChangeIncrease;

  // ROI指標の計算
  const paybackPeriod = totalAnnualBenefit > 0 ? totalInvestment / totalAnnualBenefit : Infinity;
  const tenYearBenefit = calculateTenYearBenefit(totalAnnualBenefit);
  const roi = totalInvestment > 0 ? (totalAnnualBenefit / totalInvestment) * 100 : 0;
  const npv = calculateNPV(totalInvestment, totalAnnualBenefit);

  return {
    opportunityCost,
    directCosts,
    totalInvestment,
    annualAllowanceIncrease,
    annualSalaryIncrease,
    annualJobChangeIncrease,
    totalAnnualBenefit,
    paybackPeriod,
    tenYearBenefit,
    roi,
    npv
  };
};

/**
 * 機会コストを計算する（学習時間 × 時給）
 */
const calculateOpportunityCost = (data: QualificationData): number => {
  const hourlyWage = data.currentHourlyWage || 0;
  return data.studyHours * hourlyWage;
};

/**
 * 直接費用を計算する
 */
const calculateDirectCosts = (data: QualificationData): number => {
  return data.examFee + data.materialCost + data.courseFee + data.otherCosts;
};

/**
 * 10年間の累積効果を計算する
 */
const calculateTenYearBenefit = (annualBenefit: number): number => {
  return annualBenefit * QUALIFICATION_CONSTANTS.CALCULATION_PERIOD_YEARS;
};

/**
 * 正味現在価値（NPV）を計算する
 * 割引率5%で10年間の効果を現在価値に換算
 */
const calculateNPV = (initialInvestment: number, annualBenefit: number): number => {
  if (annualBenefit <= 0) return -initialInvestment;

  let npv = -initialInvestment; // 初期投資は負の値
  const discountRate = QUALIFICATION_CONSTANTS.DEFAULT_DISCOUNT_RATE;

  // 10年間の効果を現在価値に割引
  for (let year = 1; year <= QUALIFICATION_CONSTANTS.CALCULATION_PERIOD_YEARS; year++) {
    npv += annualBenefit / Math.pow(1 + discountRate, year);
  }

  return npv;
};

/**
 * 入力データのバリデーション
 */
const validateQualificationData = (data: QualificationData): QualificationData => {
  return {
    name: data.name || '',
    studyHours: Math.max(0, isNaN(data.studyHours) ? 0 : data.studyHours),
    studyPeriod: Math.max(0, isNaN(data.studyPeriod) ? 0 : data.studyPeriod),
    examFee: Math.max(0, isNaN(data.examFee) ? 0 : data.examFee),
    materialCost: Math.max(0, isNaN(data.materialCost) ? 0 : data.materialCost),
    courseFee: Math.max(0, isNaN(data.courseFee) ? 0 : data.courseFee),
    otherCosts: Math.max(0, isNaN(data.otherCosts) ? 0 : data.otherCosts),
    currentAllowance: Math.max(0, isNaN(data.currentAllowance) ? 0 : data.currentAllowance),
    expectedAllowance: Math.max(0, isNaN(data.expectedAllowance) ? 0 : data.expectedAllowance),
    salaryIncrease: Math.max(0, isNaN(data.salaryIncrease) ? 0 : data.salaryIncrease),
    jobChangeIncrease: Math.max(0, isNaN(data.jobChangeIncrease) ? 0 : data.jobChangeIncrease),
    currentHourlyWage: Math.max(0, isNaN(data.currentHourlyWage || 0) ? 0 : data.currentHourlyWage || 0)
  };
};

/**
 * 投資効率性を評価する
 * @param result 計算結果
 * @returns 評価レベル
 */
export const evaluateQualificationInvestment = (result: QualificationResult): {
  level: 'excellent' | 'good' | 'fair' | 'poor';
  message: string;
} => {
  if (result.totalInvestment <= 0) {
    return { level: 'poor', message: '投資額が設定されていません' };
  }

  if (result.totalAnnualBenefit <= 0) {
    return { level: 'poor', message: '年間効果が見込めません' };
  }

  if (result.paybackPeriod <= 1) {
    return { level: 'excellent', message: '1年以内で投資回収可能' };
  } else if (result.paybackPeriod <= 3) {
    return { level: 'good', message: '3年以内で投資回収可能' };
  } else if (result.paybackPeriod <= 5) {
    return { level: 'fair', message: '5年以内で投資回収可能' };
  } else {
    return { level: 'poor', message: '投資回収に5年以上必要' };
  }
};

/**
 * 複数の資格を比較する
 * @param qualifications 比較対象の資格データ配列
 * @returns 比較結果
 */
export const compareQualifications = (qualifications: Array<{ data: QualificationData; result: QualificationResult; label: string }>) => {
  if (qualifications.length === 0) return null;

  const sorted = [...qualifications].sort((a, b) => b.result.roi - a.result.roi);

  return {
    best: sorted[0],
    worst: sorted[sorted.length - 1],
    rankings: sorted.map((qual, index) => ({
      ...qual,
      rank: index + 1
    }))
  };
};