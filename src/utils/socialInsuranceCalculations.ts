import type { SalaryCalculationData, SocialInsuranceResult, PrefectureRates } from '../types';

/**
 * 都道府県別の社会保険料率データ（令和6年度版）
 * 健康保険料率は協会けんぽの料率を使用
 */
export const PREFECTURE_RATES: { [key: string]: PrefectureRates } = {
  '北海道': {
    code: '01',
    name: '北海道',
    healthInsuranceRate: 10.39,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '青森県': {
    code: '02',
    name: '青森県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '岩手県': {
    code: '03',
    name: '岩手県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '宮城県': {
    code: '04',
    name: '宮城県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '秋田県': {
    code: '05',
    name: '秋田県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '山形県': {
    code: '06',
    name: '山形県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '福島県': {
    code: '07',
    name: '福島県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '茨城県': {
    code: '08',
    name: '茨城県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '栃木県': {
    code: '09',
    name: '栃木県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '群馬県': {
    code: '10',
    name: '群馬県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '埼玉県': {
    code: '11',
    name: '埼玉県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '千葉県': {
    code: '12',
    name: '千葉県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '東京都': {
    code: '13',
    name: '東京都',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '神奈川県': {
    code: '14',
    name: '神奈川県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '新潟県': {
    code: '15',
    name: '新潟県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '富山県': {
    code: '16',
    name: '富山県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '石川県': {
    code: '17',
    name: '石川県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '福井県': {
    code: '18',
    name: '福井県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '山梨県': {
    code: '19',
    name: '山梨県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '長野県': {
    code: '20',
    name: '長野県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '岐阜県': {
    code: '21',
    name: '岐阜県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '静岡県': {
    code: '22',
    name: '静岡県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '愛知県': {
    code: '23',
    name: '愛知県',
    healthInsuranceRate: 10.01,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '三重県': {
    code: '24',
    name: '三重県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '滋賀県': {
    code: '25',
    name: '滋賀県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '京都府': {
    code: '26',
    name: '京都府',
    healthInsuranceRate: 10.09,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '大阪府': {
    code: '27',
    name: '大阪府',
    healthInsuranceRate: 10.29,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '兵庫県': {
    code: '28',
    name: '兵庫県',
    healthInsuranceRate: 10.13,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '奈良県': {
    code: '29',
    name: '奈良県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '和歌山県': {
    code: '30',
    name: '和歌山県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '鳥取県': {
    code: '31',
    name: '鳥取県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '島根県': {
    code: '32',
    name: '島根県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '岡山県': {
    code: '33',
    name: '岡山県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '広島県': {
    code: '34',
    name: '広島県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '山口県': {
    code: '35',
    name: '山口県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '徳島県': {
    code: '36',
    name: '徳島県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '香川県': {
    code: '37',
    name: '香川県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '愛媛県': {
    code: '38',
    name: '愛媛県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '高知県': {
    code: '39',
    name: '高知県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '福岡県': {
    code: '40',
    name: '福岡県',
    healthInsuranceRate: 10.36,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '佐賀県': {
    code: '41',
    name: '佐賀県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '長崎県': {
    code: '42',
    name: '長崎県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '熊本県': {
    code: '43',
    name: '熊本県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '大分県': {
    code: '44',
    name: '大分県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '宮崎県': {
    code: '45',
    name: '宮崎県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '鹿児島県': {
    code: '46',
    name: '鹿児島県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '沖縄県': {
    code: '47',
    name: '沖縄県',
    healthInsuranceRate: 10.00,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  },
  '全国平均': {
    code: '00',
    name: '全国平均',
    healthInsuranceRate: 10.0,
    pensionInsuranceRate: 18.3,
    employmentInsuranceRateEmployee: 0.6,
    employmentInsuranceRateEmployer: 0.95,
    workersCompensationRate: 0.25
  }
};

/**
 * 標準報酬月額の等級表（令和6年度版）
 * 実際の月額給与から標準報酬月額を求める
 */
const STANDARD_SALARY_GRADES = [
  { from: 0, to: 93000, standard: 88000 },
  { from: 93000, to: 101000, standard: 98000 },
  { from: 101000, to: 107000, standard: 104000 },
  { from: 107000, to: 114000, standard: 110000 },
  { from: 114000, to: 122000, standard: 118000 },
  { from: 122000, to: 130000, standard: 126000 },
  { from: 130000, to: 138000, standard: 134000 },
  { from: 138000, to: 146000, standard: 142000 },
  { from: 146000, to: 155000, standard: 150000 },
  { from: 155000, to: 165000, standard: 160000 },
  { from: 165000, to: 175000, standard: 170000 },
  { from: 175000, to: 185000, standard: 180000 },
  { from: 185000, to: 195000, standard: 190000 },
  { from: 195000, to: 210000, standard: 200000 },
  { from: 210000, to: 230000, standard: 220000 },
  { from: 230000, to: 250000, standard: 240000 },
  { from: 250000, to: 270000, standard: 260000 },
  { from: 270000, to: 290000, standard: 280000 },
  { from: 290000, to: 310000, standard: 300000 },
  { from: 310000, to: 330000, standard: 320000 },
  { from: 330000, to: 350000, standard: 340000 },
  { from: 350000, to: 370000, standard: 360000 },
  { from: 370000, to: 395000, standard: 380000 },
  { from: 395000, to: 425000, standard: 410000 },
  { from: 425000, to: 455000, standard: 440000 },
  { from: 455000, to: 485000, standard: 470000 },
  { from: 485000, to: 515000, standard: 500000 },
  { from: 515000, to: 545000, standard: 530000 },
  { from: 545000, to: 575000, standard: 560000 },
  { from: 575000, to: 605000, standard: 590000 },
  { from: 605000, to: 635000, standard: 620000 },
  { from: 635000, to: Number.MAX_SAFE_INTEGER, standard: 650000 } // 最高等級
];

/**
 * 月額給与から標準報酬月額を算出
 */
function calculateStandardSalary(monthlySalary: number): number {
  const grade = STANDARD_SALARY_GRADES.find(
    (grade) => monthlySalary >= grade.from && monthlySalary < grade.to
  );
  return grade ? grade.standard : 650000; // 見つからない場合は最高等級
}

/**
 * 住民税を計算する（簡易計算）
 * @param annualIncome 年収（総収入）
 * @param dependents 扶養者数
 * @returns 住民税額
 */
function calculateResidentTax(annualIncome: number, dependents: number) {
  // 給与所得控除
  let employmentIncomeDeduction = 0;
  if (annualIncome <= 1625000) {
    employmentIncomeDeduction = 550000;
  } else if (annualIncome <= 1800000) {
    employmentIncomeDeduction = annualIncome * 0.4 - 100000;
  } else if (annualIncome <= 3600000) {
    employmentIncomeDeduction = annualIncome * 0.3 + 80000;
  } else if (annualIncome <= 6600000) {
    employmentIncomeDeduction = annualIncome * 0.2 + 440000;
  } else if (annualIncome <= 8500000) {
    employmentIncomeDeduction = annualIncome * 0.1 + 1100000;
  } else {
    employmentIncomeDeduction = 1950000;
  }

  // 給与所得
  const employmentIncome = annualIncome - employmentIncomeDeduction;

  // 所得控除
  const basicDeduction = 430000; // 基礎控除（令和3年分以降）
  const dependentDeduction = dependents * 330000; // 扶養控除（一般）
  const totalDeductions = basicDeduction + dependentDeduction;

  // 課税所得
  const taxableIncome = Math.max(0, employmentIncome - totalDeductions);

  // 住民税の計算（所得割10% + 均等割）
  const incomeRate = 0.10; // 所得割（道府県民税4% + 市町村民税6%）
  const equalRate = 5000; // 均等割（道府県民税1,500円 + 市町村民税3,500円）

  const incomeTax = Math.floor(taxableIncome * incomeRate);
  const prefecturalTax = Math.floor(taxableIncome * 0.04) + 1500; // 道府県民税
  const municipalTax = Math.floor(taxableIncome * 0.06) + 3500; // 市町村民税

  return {
    employeeContribution: incomeTax + equalRate,
    prefecturalTax: prefecturalTax,
    municipalTax: municipalTax,
    rate: incomeRate * 100 // パーセンテージ
  };
}

/**
 * 社会保険料を計算する
 */
export function calculateSocialInsurance(
  data: SalaryCalculationData
): SocialInsuranceResult | null {
  // 居住地が未設定の場合はnullを返す
  if (!data.prefecture) {
    return null;
  }
  
  // 社会保険計算が無効な場合はnullを返す
  if (data.enableSocialInsurance === false) {
    return null;
  }

  const prefecture = data.prefecture;
  const rates = PREFECTURE_RATES[prefecture] || PREFECTURE_RATES['全国平均'];

  // 月額給与を計算
  let monthlySalary = data.salaryAmount;
  if (data.salaryType === 'annual') {
    monthlySalary = data.salaryAmount / 12;
  }

  // 手当を含める
  if (data.enableBenefits && data.welfareInputMethod === 'individual') {
    let monthlyAllowances = 0;
    if (data.welfareType === 'monthly') {
      monthlyAllowances = 
        data.housingAllowance + 
        data.regionalAllowance + 
        data.familyAllowance + 
        data.qualificationAllowance + 
        data.otherAllowance;
    } else if (data.welfareType === 'annual') {
      monthlyAllowances = (
        data.housingAllowance + 
        data.regionalAllowance + 
        data.familyAllowance + 
        data.qualificationAllowance + 
        data.otherAllowance
      ) / 12;
    }
    monthlySalary += monthlyAllowances;
  }

  // 標準報酬月額を算出
  const standardSalary = calculateStandardSalary(monthlySalary);

  // 健康保険料計算
  const healthInsuranceTotal = Math.floor(standardSalary * (rates.healthInsuranceRate / 100));
  const healthInsuranceEmployee = Math.floor(healthInsuranceTotal / 2);
  const healthInsuranceEmployer = Math.floor(healthInsuranceTotal / 2);

  // 厚生年金保険料計算
  const pensionInsuranceTotal = Math.floor(standardSalary * (rates.pensionInsuranceRate / 100));
  const pensionInsuranceEmployee = Math.floor(pensionInsuranceTotal / 2);
  const pensionInsuranceEmployer = Math.floor(pensionInsuranceTotal / 2);

  // 雇用保険料計算
  const employmentInsuranceEmployee = Math.floor(monthlySalary * (rates.employmentInsuranceRateEmployee / 100));
  const employmentInsuranceEmployer = Math.floor(monthlySalary * (rates.employmentInsuranceRateEmployer / 100));

  // 労災保険料計算（事業主負担のみ）
  const workersCompensation = Math.floor(monthlySalary * (rates.workersCompensationRate / 100));

  // 住民税計算（年収ベース）
  const annualIncome = monthlySalary * 12;
  const residentTaxResult = calculateResidentTax(annualIncome, data.dependents || 0);

  // 合計計算（住民税を含む）
  const totalEmployeeContribution = healthInsuranceEmployee + pensionInsuranceEmployee + employmentInsuranceEmployee + residentTaxResult.employeeContribution;
  const totalEmployerContribution = healthInsuranceEmployer + pensionInsuranceEmployer + employmentInsuranceEmployer + workersCompensation;
  const totalContribution = totalEmployeeContribution + totalEmployerContribution;
  const totalLaborCost = monthlySalary + totalEmployerContribution;


  return {
    healthInsurance: {
      employeeContribution: healthInsuranceEmployee,
      employerContribution: healthInsuranceEmployer,
      rate: rates.healthInsuranceRate / 2
    },
    pensionInsurance: {
      employeeContribution: pensionInsuranceEmployee,
      employerContribution: pensionInsuranceEmployer,
      rate: rates.pensionInsuranceRate / 2
    },
    employmentInsurance: {
      employeeContribution: employmentInsuranceEmployee,
      employerContribution: employmentInsuranceEmployer,
      employeeRate: rates.employmentInsuranceRateEmployee,
      employerRate: rates.employmentInsuranceRateEmployer
    },
    workersCompensation: {
      employerContribution: workersCompensation,
      rate: rates.workersCompensationRate
    },
    residentTax: {
      employeeContribution: residentTaxResult.employeeContribution,
      prefecturalTax: residentTaxResult.prefecturalTax,
      municipalTax: residentTaxResult.municipalTax,
      rate: residentTaxResult.rate
    },
    totalEmployeeContribution,
    totalEmployerContribution,
    totalContribution,
    totalLaborCost
  };
}

/**
 * 利用可能な都道府県一覧を取得
 */
export function getAvailablePrefectures(): string[] {
  return Object.keys(PREFECTURE_RATES).filter(p => p !== '全国平均');
}

/**
 * 通貨フォーマット（既存のユーティリティと整合性を保つ）
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * パーセンテージフォーマット
 */
export function formatPercentage(rate: number): string {
  return `${rate.toFixed(2)}%`;
}