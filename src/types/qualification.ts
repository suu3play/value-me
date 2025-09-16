export interface QualificationData {
  name: string;
  studyHours: number;
  studyPeriod: number; // months
  examFee: number;
  materialCost: number;
  courseFee: number;
  otherCosts: number;
  currentAllowance: number;
  expectedAllowance: number;
  salaryIncrease: number;
  jobChangeIncrease: number;
  currentHourlyWage?: number; // 既存の時給計算結果から取得
}

export interface QualificationResult {
  // 投資額
  opportunityCost: number; // 機会コスト (学習時間 × 時給)
  directCosts: number; // 直接費用合計
  totalInvestment: number; // 総投資額

  // 効果予測
  annualAllowanceIncrease: number; // 年間資格手当増加
  annualSalaryIncrease: number; // 年間昇給効果
  annualJobChangeIncrease: number; // 転職時年収増加
  totalAnnualBenefit: number; // 年間効果合計

  // ROI指標
  paybackPeriod: number; // 回収期間（年）
  tenYearBenefit: number; // 10年累積効果
  roi: number; // 投資収益率（%）
  npv: number; // 正味現在価値（割引率5%想定）
}

export interface QualificationCalculationData {
  id: string;
  timestamp: number;
  inputData: QualificationData;
  result: QualificationResult;
  label?: string;
}

// 資格の難易度レベル定義
export interface QualificationLevel {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// 一般的な資格のプリセットデータ
export const QUALIFICATION_PRESETS: QualificationLevel[] = [
  {
    id: 'basic-it-passport',
    name: 'ITパスポート',
    description: 'IT基礎知識を証明する国家資格',
    estimatedHours: 100,
    difficulty: 'beginner'
  },
  {
    id: 'fe',
    name: '基本情報技術者試験',
    description: 'IT技術者の基礎的知識・技能を証明',
    estimatedHours: 200,
    difficulty: 'intermediate'
  },
  {
    id: 'ap',
    name: '応用情報技術者試験',
    description: 'IT技術者としての応用的知識・技能を証明',
    estimatedHours: 500,
    difficulty: 'advanced'
  },
  {
    id: 'pmp',
    name: 'PMP（プロジェクトマネジメント・プロフェッショナル）',
    description: 'プロジェクトマネジメントの国際資格',
    estimatedHours: 300,
    difficulty: 'advanced'
  },
  {
    id: 'toeic-800',
    name: 'TOEIC 800点以上',
    description: '英語コミュニケーション能力の証明',
    estimatedHours: 400,
    difficulty: 'intermediate'
  },
  {
    id: 'custom',
    name: 'その他の資格',
    description: '上記以外の資格（カスタム入力）',
    estimatedHours: 0,
    difficulty: 'beginner'
  }
];

// 割引率（NPV計算用）
export const DISCOUNT_RATE = 0.05; // 5%

// 計算用の定数
export const QUALIFICATION_CONSTANTS = {
  MONTHS_PER_YEAR: 12,
  CALCULATION_PERIOD_YEARS: 10,
  DEFAULT_DISCOUNT_RATE: DISCOUNT_RATE
} as const;