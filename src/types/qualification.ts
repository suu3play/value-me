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

// 職種カテゴリ定義
export interface JobCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

// 資格の難易度レベル定義
export interface QualificationLevel {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  categoryId: string;
  estimatedCost: {
    examFee: number;
    materialCost: number;
    courseFee?: number;
  };
  marketValue: {
    allowanceIncrease: number;
    salaryIncrease: number;
    jobChangeIncrease: number;
  };
}

// 職種カテゴリ一覧
export const JOB_CATEGORIES: JobCategory[] = [
  {
    id: 'it-engineer',
    name: 'ITエンジニア',
    description: 'ソフトウェア開発・インフラ・セキュリティ関連',
    icon: 'Computer'
  },
  {
    id: 'business',
    name: 'ビジネス・経営',
    description: '経営・マーケティング・財務・人事関連',
    icon: 'Business'
  },
  {
    id: 'finance',
    name: '金融・会計',
    description: '会計・税務・金融・投資関連',
    icon: 'AccountBalance'
  },
  {
    id: 'legal',
    name: '法務・法律',
    description: '法律・知的財産・コンプライアンス関連',
    icon: 'Gavel'
  },
  {
    id: 'medical',
    name: '医療・福祉',
    description: '医療・看護・介護・健康管理関連',
    icon: 'LocalHospital'
  },
  {
    id: 'education',
    name: '教育・語学',
    description: '教育・語学・翻訳・通訳関連',
    icon: 'School'
  },
  {
    id: 'design',
    name: 'デザイン・クリエイティブ',
    description: 'デザイン・広告・映像・音響関連',
    icon: 'Palette'
  },
  {
    id: 'engineering',
    name: '技術・エンジニアリング',
    description: '建築・土木・機械・電気・化学関連',
    icon: 'Engineering'
  }
];

// 職種別資格データベース
export const QUALIFICATION_PRESETS: QualificationLevel[] = [
  // ITエンジニア (12個)
  {
    id: 'it-passport',
    name: 'ITパスポート',
    description: 'IT基礎知識を証明する国家資格',
    estimatedHours: 100,
    difficulty: 'beginner',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 7500, materialCost: 5000 },
    marketValue: { allowanceIncrease: 5000, salaryIncrease: 100000, jobChangeIncrease: 200000 }
  },
  {
    id: 'basic-information',
    name: '基本情報技術者試験',
    description: 'IT技術者の基礎的知識・技能を証明する国家資格',
    estimatedHours: 200,
    difficulty: 'intermediate',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 7500, materialCost: 15000 },
    marketValue: { allowanceIncrease: 10000, salaryIncrease: 200000, jobChangeIncrease: 400000 }
  },
  {
    id: 'applied-information',
    name: '応用情報技術者試験',
    description: 'IT技術者としての応用的知識・技能を証明する国家資格',
    estimatedHours: 500,
    difficulty: 'advanced',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 7500, materialCost: 25000 },
    marketValue: { allowanceIncrease: 20000, salaryIncrease: 400000, jobChangeIncrease: 800000 }
  },
  {
    id: 'network-specialist',
    name: 'ネットワークスペシャリスト',
    description: 'ネットワーク技術の専門知識を証明する国家資格',
    estimatedHours: 400,
    difficulty: 'advanced',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 7500, materialCost: 30000 },
    marketValue: { allowanceIncrease: 25000, salaryIncrease: 500000, jobChangeIncrease: 1000000 }
  },
  {
    id: 'information-security',
    name: '情報セキュリティスペシャリスト',
    description: '情報セキュリティの専門知識を証明する国家資格',
    estimatedHours: 450,
    difficulty: 'advanced',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 7500, materialCost: 35000 },
    marketValue: { allowanceIncrease: 30000, salaryIncrease: 600000, jobChangeIncrease: 1200000 }
  },
  {
    id: 'aws-saa',
    name: 'AWS認定ソリューションアーキテクト',
    description: 'AWS クラウドのアーキテクチャ設計能力を証明',
    estimatedHours: 200,
    difficulty: 'intermediate',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 18000, materialCost: 20000 },
    marketValue: { allowanceIncrease: 15000, salaryIncrease: 300000, jobChangeIncrease: 600000 }
  },
  {
    id: 'oracle-java',
    name: 'Oracle認定Javaプログラマ',
    description: 'Java言語の技術知識とプログラミング能力を証明',
    estimatedHours: 150,
    difficulty: 'intermediate',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 32400, materialCost: 15000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'cisco-ccna',
    name: 'Cisco CCNA',
    description: 'ネットワーク機器の設定・管理技術を証明',
    estimatedHours: 250,
    difficulty: 'intermediate',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 39000, materialCost: 25000 },
    marketValue: { allowanceIncrease: 18000, salaryIncrease: 350000, jobChangeIncrease: 700000 }
  },
  {
    id: 'pmp',
    name: 'PMP (プロジェクトマネジメント・プロフェッショナル)',
    description: 'プロジェクトマネジメントの国際的な専門資格',
    estimatedHours: 300,
    difficulty: 'advanced',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 60000, materialCost: 40000, courseFee: 150000 },
    marketValue: { allowanceIncrease: 25000, salaryIncrease: 500000, jobChangeIncrease: 1000000 }
  },
  {
    id: 'google-cloud',
    name: 'Google Cloud Professional Cloud Architect',
    description: 'Google Cloudのアーキテクチャ設計能力を証明',
    estimatedHours: 220,
    difficulty: 'advanced',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 23000, materialCost: 25000 },
    marketValue: { allowanceIncrease: 20000, salaryIncrease: 400000, jobChangeIncrease: 800000 }
  },
  {
    id: 'microsoft-azure',
    name: 'Microsoft Azure Solutions Architect',
    description: 'Azure クラウドソリューションの設計能力を証明',
    estimatedHours: 200,
    difficulty: 'advanced',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 21000, materialCost: 20000 },
    marketValue: { allowanceIncrease: 18000, salaryIncrease: 380000, jobChangeIncrease: 750000 }
  },
  {
    id: 'lpic',
    name: 'LPIC (Linux Professional Institute Certification)',
    description: 'Linuxシステムの管理・運用技術を証明',
    estimatedHours: 180,
    difficulty: 'intermediate',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 16500, materialCost: 12000 },
    marketValue: { allowanceIncrease: 10000, salaryIncrease: 200000, jobChangeIncrease: 400000 }
  },

  // ビジネス・経営 (12個)
  {
    id: 'itil-foundation',
    name: 'ITIL Foundation',
    description: 'ITサービス管理のベストプラクティスを証明',
    estimatedHours: 40,
    difficulty: 'beginner',
    categoryId: 'business',
    estimatedCost: { examFee: 32000, materialCost: 15000 },
    marketValue: { allowanceIncrease: 8000, salaryIncrease: 150000, jobChangeIncrease: 300000 }
  },
  {
    id: 'sales-management',
    name: '販売士検定',
    description: '販売・マーケティングの専門知識を証明',
    estimatedHours: 60,
    difficulty: 'beginner',
    categoryId: 'business',
    estimatedCost: { examFee: 7850, materialCost: 8000 },
    marketValue: { allowanceIncrease: 5000, salaryIncrease: 100000, jobChangeIncrease: 200000 }
  },
  {
    id: 'marketing-kentei',
    name: 'マーケティング検定',
    description: 'マーケティング理論と実践能力を証明',
    estimatedHours: 80,
    difficulty: 'intermediate',
    categoryId: 'business',
    estimatedCost: { examFee: 6200, materialCost: 10000 },
    marketValue: { allowanceIncrease: 8000, salaryIncrease: 150000, jobChangeIncrease: 300000 }
  },
  {
    id: 'business-career',
    name: 'ビジネスキャリア検定',
    description: '企業実務の専門知識・技能を証明',
    estimatedHours: 100,
    difficulty: 'intermediate',
    categoryId: 'business',
    estimatedCost: { examFee: 6900, materialCost: 12000 },
    marketValue: { allowanceIncrease: 10000, salaryIncrease: 200000, jobChangeIncrease: 400000 }
  },
  {
    id: 'cfa',
    name: 'CFA (Chartered Financial Analyst)',
    description: '投資分析・ポートフォリオ管理の国際資格',
    estimatedHours: 900,
    difficulty: 'expert',
    categoryId: 'business',
    estimatedCost: { examFee: 120000, materialCost: 80000, courseFee: 300000 },
    marketValue: { allowanceIncrease: 50000, salaryIncrease: 1000000, jobChangeIncrease: 2000000 }
  },
  {
    id: 'small-business-consultant',
    name: '中小企業診断士',
    description: '企業経営の診断・助言を行う国家資格',
    estimatedHours: 1000,
    difficulty: 'expert',
    categoryId: 'business',
    estimatedCost: { examFee: 14400, materialCost: 50000, courseFee: 200000 },
    marketValue: { allowanceIncrease: 30000, salaryIncrease: 600000, jobChangeIncrease: 1200000 }
  },
  {
    id: 'project-manager',
    name: 'プロジェクトマネージャ試験',
    description: 'プロジェクト管理の高度な技術を証明する国家資格',
    estimatedHours: 400,
    difficulty: 'advanced',
    categoryId: 'business',
    estimatedCost: { examFee: 7500, materialCost: 30000 },
    marketValue: { allowanceIncrease: 25000, salaryIncrease: 500000, jobChangeIncrease: 1000000 }
  },
  {
    id: 'systems-auditor',
    name: 'システム監査技術者',
    description: 'システム監査の専門技術を証明する国家資格',
    estimatedHours: 350,
    difficulty: 'advanced',
    categoryId: 'business',
    estimatedCost: { examFee: 7500, materialCost: 25000 },
    marketValue: { allowanceIncrease: 22000, salaryIncrease: 450000, jobChangeIncrease: 900000 }
  },
  {
    id: 'it-coordinator',
    name: 'ITコーディネータ',
    description: 'IT経営を推進する専門家資格',
    estimatedHours: 200,
    difficulty: 'advanced',
    categoryId: 'business',
    estimatedCost: { examFee: 19800, materialCost: 30000, courseFee: 100000 },
    marketValue: { allowanceIncrease: 20000, salaryIncrease: 400000, jobChangeIncrease: 800000 }
  },
  {
    id: 'mba',
    name: 'MBA (経営学修士)',
    description: '経営管理の高度な専門知識を証明',
    estimatedHours: 2000,
    difficulty: 'expert',
    categoryId: 'business',
    estimatedCost: { examFee: 0, materialCost: 100000, courseFee: 2000000 },
    marketValue: { allowanceIncrease: 80000, salaryIncrease: 1500000, jobChangeIncrease: 3000000 }
  },
  {
    id: 'logistics',
    name: '物流技術管理士',
    description: '物流・ロジスティクスの専門技術を証明',
    estimatedHours: 150,
    difficulty: 'intermediate',
    categoryId: 'business',
    estimatedCost: { examFee: 11000, materialCost: 15000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'quality-control',
    name: 'QC検定',
    description: '品質管理の知識と手法を証明',
    estimatedHours: 80,
    difficulty: 'intermediate',
    categoryId: 'business',
    estimatedCost: { examFee: 5500, materialCost: 8000 },
    marketValue: { allowanceIncrease: 6000, salaryIncrease: 120000, jobChangeIncrease: 250000 }
  }
];

// 金融・会計 (12個)
// 法務・法律 (10個)
// 医療・福祉 (10個)
// 教育・語学 (10個)
// デザイン・クリエイティブ (10個)
// 技術・エンジニアリング (10個)
// は長くなるため別途追加します

// 割引率（NPV計算用）
export const DISCOUNT_RATE = 0.05; // 5%

// 計算用の定数
export const QUALIFICATION_CONSTANTS = {
  MONTHS_PER_YEAR: 12,
  CALCULATION_PERIOD_YEARS: 10,
  DEFAULT_DISCOUNT_RATE: DISCOUNT_RATE
} as const;