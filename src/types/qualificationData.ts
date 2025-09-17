// 職種別資格データベース - 拡張版
import type { QualificationLevel, JobCategory } from './qualification';

// 職種カテゴリ一覧（8職種）
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

// 職種別資格データベース（全8職種、86資格）
export const EXPANDED_QUALIFICATION_PRESETS: QualificationLevel[] = [
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
  },

  // 金融・会計 (12個)
  {
    id: 'certified-public-accountant',
    name: '公認会計士',
    description: '会計監査の専門家として最高峰の国家資格',
    estimatedHours: 3000,
    difficulty: 'expert',
    categoryId: 'finance',
    estimatedCost: { examFee: 19500, materialCost: 200000, courseFee: 800000 },
    marketValue: { allowanceIncrease: 100000, salaryIncrease: 2000000, jobChangeIncrease: 4000000 }
  },
  {
    id: 'tax-accountant',
    name: '税理士',
    description: '税務の専門家として独立開業も可能な国家資格',
    estimatedHours: 2500,
    difficulty: 'expert',
    categoryId: 'finance',
    estimatedCost: { examFee: 10000, materialCost: 150000, courseFee: 600000 },
    marketValue: { allowanceIncrease: 80000, salaryIncrease: 1500000, jobChangeIncrease: 3000000 }
  },
  {
    id: 'bookkeeping-1',
    name: '日商簿記1級',
    description: '会計学の高度な知識を証明する検定',
    estimatedHours: 600,
    difficulty: 'advanced',
    categoryId: 'finance',
    estimatedCost: { examFee: 7850, materialCost: 25000 },
    marketValue: { allowanceIncrease: 20000, salaryIncrease: 400000, jobChangeIncrease: 800000 }
  },
  {
    id: 'bookkeeping-2',
    name: '日商簿記2級',
    description: '企業の財務担当者に必要な知識を証明',
    estimatedHours: 200,
    difficulty: 'intermediate',
    categoryId: 'finance',
    estimatedCost: { examFee: 4720, materialCost: 12000 },
    marketValue: { allowanceIncrease: 10000, salaryIncrease: 200000, jobChangeIncrease: 400000 }
  },
  {
    id: 'fp1',
    name: 'ファイナンシャルプランナー1級',
    description: '金融・保険の最高位の専門資格',
    estimatedHours: 400,
    difficulty: 'advanced',
    categoryId: 'finance',
    estimatedCost: { examFee: 20000, materialCost: 30000 },
    marketValue: { allowanceIncrease: 25000, salaryIncrease: 500000, jobChangeIncrease: 1000000 }
  },
  {
    id: 'fp2',
    name: 'ファイナンシャルプランナー2級',
    description: '個人の資産設計に関する専門知識を証明',
    estimatedHours: 150,
    difficulty: 'intermediate',
    categoryId: 'finance',
    estimatedCost: { examFee: 8700, materialCost: 15000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'securities-analyst',
    name: '証券アナリスト',
    description: '投資分析・企業評価の専門知識を証明',
    estimatedHours: 500,
    difficulty: 'advanced',
    categoryId: 'finance',
    estimatedCost: { examFee: 40000, materialCost: 50000, courseFee: 200000 },
    marketValue: { allowanceIncrease: 30000, salaryIncrease: 600000, jobChangeIncrease: 1200000 }
  },
  {
    id: 'actuary',
    name: 'アクチュアリー',
    description: '保険・年金数理の専門家資格',
    estimatedHours: 1500,
    difficulty: 'expert',
    categoryId: 'finance',
    estimatedCost: { examFee: 25000, materialCost: 100000, courseFee: 300000 },
    marketValue: { allowanceIncrease: 60000, salaryIncrease: 1200000, jobChangeIncrease: 2400000 }
  },
  {
    id: 'real-estate-appraiser',
    name: '不動産鑑定士',
    description: '不動産の価格評価を行う国家資格',
    estimatedHours: 2000,
    difficulty: 'expert',
    categoryId: 'finance',
    estimatedCost: { examFee: 13000, materialCost: 80000, courseFee: 400000 },
    marketValue: { allowanceIncrease: 50000, salaryIncrease: 1000000, jobChangeIncrease: 2000000 }
  },
  {
    id: 'internal-auditor',
    name: '内部監査士(CIA)',
    description: '内部監査の国際的な専門資格',
    estimatedHours: 300,
    difficulty: 'advanced',
    categoryId: 'finance',
    estimatedCost: { examFee: 50000, materialCost: 40000 },
    marketValue: { allowanceIncrease: 22000, salaryIncrease: 450000, jobChangeIncrease: 900000 }
  },
  {
    id: 'banking-business-3',
    name: '銀行業務検定3級',
    description: '銀行業務の基礎知識を証明',
    estimatedHours: 80,
    difficulty: 'beginner',
    categoryId: 'finance',
    estimatedCost: { examFee: 4320, materialCost: 8000 },
    marketValue: { allowanceIncrease: 5000, salaryIncrease: 100000, jobChangeIncrease: 200000 }
  },
  {
    id: 'financial-risk-manager',
    name: 'FRM (Financial Risk Manager)',
    description: '金融リスク管理の国際的な専門資格',
    estimatedHours: 400,
    difficulty: 'advanced',
    categoryId: 'finance',
    estimatedCost: { examFee: 80000, materialCost: 60000 },
    marketValue: { allowanceIncrease: 35000, salaryIncrease: 700000, jobChangeIncrease: 1400000 }
  },

  // 法務・法律 (10個)
  {
    id: 'lawyer',
    name: '弁護士',
    description: '法律業務全般を担う最高位の法律専門家資格',
    estimatedHours: 5000,
    difficulty: 'expert',
    categoryId: 'legal',
    estimatedCost: { examFee: 28000, materialCost: 300000, courseFee: 1000000 },
    marketValue: { allowanceIncrease: 150000, salaryIncrease: 3000000, jobChangeIncrease: 6000000 }
  },
  {
    id: 'judicial-scrivener',
    name: '司法書士',
    description: '登記・供託手続きの専門家として独立可能な国家資格',
    estimatedHours: 3000,
    difficulty: 'expert',
    categoryId: 'legal',
    estimatedCost: { examFee: 8000, materialCost: 200000, courseFee: 600000 },
    marketValue: { allowanceIncrease: 80000, salaryIncrease: 1500000, jobChangeIncrease: 3000000 }
  },
  {
    id: 'administrative-scrivener',
    name: '行政書士',
    description: '行政手続きの専門家として独立可能な国家資格',
    estimatedHours: 800,
    difficulty: 'advanced',
    categoryId: 'legal',
    estimatedCost: { examFee: 10400, materialCost: 50000, courseFee: 200000 },
    marketValue: { allowanceIncrease: 30000, salaryIncrease: 600000, jobChangeIncrease: 1200000 }
  },
  {
    id: 'patent-attorney',
    name: '弁理士',
    description: '知的財産権の専門家として独立可能な国家資格',
    estimatedHours: 2500,
    difficulty: 'expert',
    categoryId: 'legal',
    estimatedCost: { examFee: 12000, materialCost: 150000, courseFee: 500000 },
    marketValue: { allowanceIncrease: 70000, salaryIncrease: 1400000, jobChangeIncrease: 2800000 }
  },
  {
    id: 'legal-affairs-3',
    name: '法務検定3級',
    description: '企業法務の基礎知識を証明',
    estimatedHours: 60,
    difficulty: 'beginner',
    categoryId: 'legal',
    estimatedCost: { examFee: 5500, materialCost: 8000 },
    marketValue: { allowanceIncrease: 5000, salaryIncrease: 100000, jobChangeIncrease: 200000 }
  },
  {
    id: 'legal-affairs-2',
    name: '法務検定2級',
    description: '企業法務の実務知識を証明',
    estimatedHours: 120,
    difficulty: 'intermediate',
    categoryId: 'legal',
    estimatedCost: { examFee: 8000, materialCost: 15000 },
    marketValue: { allowanceIncrease: 10000, salaryIncrease: 200000, jobChangeIncrease: 400000 }
  },
  {
    id: 'intellectual-property',
    name: '知的財産管理技能検定',
    description: '知的財産の管理・活用に関する専門知識を証明',
    estimatedHours: 150,
    difficulty: 'intermediate',
    categoryId: 'legal',
    estimatedCost: { examFee: 8900, materialCost: 18000 },
    marketValue: { allowanceIncrease: 15000, salaryIncrease: 300000, jobChangeIncrease: 600000 }
  },
  {
    id: 'compliance-officer',
    name: 'コンプライアンス・オフィサー',
    description: '企業のコンプライアンス体制構築の専門知識を証明',
    estimatedHours: 100,
    difficulty: 'intermediate',
    categoryId: 'legal',
    estimatedCost: { examFee: 6600, materialCost: 12000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'personal-information',
    name: '個人情報保護士',
    description: '個人情報保護に関する専門知識を証明',
    estimatedHours: 40,
    difficulty: 'beginner',
    categoryId: 'legal',
    estimatedCost: { examFee: 11000, materialCost: 8000 },
    marketValue: { allowanceIncrease: 8000, salaryIncrease: 150000, jobChangeIncrease: 300000 }
  },
  {
    id: 'labor-consultant',
    name: '社会保険労務士',
    description: '労働・社会保険に関する専門家として独立可能な国家資格',
    estimatedHours: 1000,
    difficulty: 'advanced',
    categoryId: 'legal',
    estimatedCost: { examFee: 15000, materialCost: 80000, courseFee: 300000 },
    marketValue: { allowanceIncrease: 40000, salaryIncrease: 800000, jobChangeIncrease: 1600000 }
  },

  // 医療・福祉 (10個)
  {
    id: 'medical-doctor',
    name: '医師',
    description: '医療行為を行う最高位の医療専門家資格',
    estimatedHours: 6000,
    difficulty: 'expert',
    categoryId: 'medical',
    estimatedCost: { examFee: 15300, materialCost: 500000, courseFee: 20000000 },
    marketValue: { allowanceIncrease: 200000, salaryIncrease: 5000000, jobChangeIncrease: 10000000 }
  },
  {
    id: 'nurse',
    name: '看護師',
    description: '医療チームの中核を担う国家資格',
    estimatedHours: 2000,
    difficulty: 'advanced',
    categoryId: 'medical',
    estimatedCost: { examFee: 5400, materialCost: 100000, courseFee: 3000000 },
    marketValue: { allowanceIncrease: 30000, salaryIncrease: 600000, jobChangeIncrease: 1200000 }
  },
  {
    id: 'pharmacist',
    name: '薬剤師',
    description: '薬事に関する専門家として独立可能な国家資格',
    estimatedHours: 4000,
    difficulty: 'expert',
    categoryId: 'medical',
    estimatedCost: { examFee: 6800, materialCost: 300000, courseFee: 8000000 },
    marketValue: { allowanceIncrease: 80000, salaryIncrease: 1500000, jobChangeIncrease: 3000000 }
  },
  {
    id: 'physical-therapist',
    name: '理学療法士',
    description: 'リハビリテーションの専門家国家資格',
    estimatedHours: 2500,
    difficulty: 'advanced',
    categoryId: 'medical',
    estimatedCost: { examFee: 10100, materialCost: 150000, courseFee: 4000000 },
    marketValue: { allowanceIncrease: 25000, salaryIncrease: 500000, jobChangeIncrease: 1000000 }
  },
  {
    id: 'medical-technologist',
    name: '臨床検査技師',
    description: '臨床検査業務を行う国家資格',
    estimatedHours: 2000,
    difficulty: 'advanced',
    categoryId: 'medical',
    estimatedCost: { examFee: 11300, materialCost: 120000, courseFee: 3500000 },
    marketValue: { allowanceIncrease: 20000, salaryIncrease: 400000, jobChangeIncrease: 800000 }
  },
  {
    id: 'care-manager',
    name: 'ケアマネジャー',
    description: '介護保険制度のケアプラン作成専門資格',
    estimatedHours: 300,
    difficulty: 'intermediate',
    categoryId: 'medical',
    estimatedCost: { examFee: 8000, materialCost: 25000, courseFee: 100000 },
    marketValue: { allowanceIncrease: 15000, salaryIncrease: 300000, jobChangeIncrease: 600000 }
  },
  {
    id: 'social-worker',
    name: '社会福祉士',
    description: '福祉相談援助の専門家国家資格',
    estimatedHours: 1500,
    difficulty: 'advanced',
    categoryId: 'medical',
    estimatedCost: { examFee: 15440, materialCost: 80000, courseFee: 200000 },
    marketValue: { allowanceIncrease: 18000, salaryIncrease: 350000, jobChangeIncrease: 700000 }
  },
  {
    id: 'care-worker',
    name: '介護福祉士',
    description: '介護の専門職として認定される国家資格',
    estimatedHours: 800,
    difficulty: 'intermediate',
    categoryId: 'medical',
    estimatedCost: { examFee: 15300, materialCost: 30000, courseFee: 150000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'mental-health-social-worker',
    name: '精神保健福祉士',
    description: '精神障害者の支援を行う専門家国家資格',
    estimatedHours: 1000,
    difficulty: 'advanced',
    categoryId: 'medical',
    estimatedCost: { examFee: 17610, materialCost: 60000, courseFee: 180000 },
    marketValue: { allowanceIncrease: 16000, salaryIncrease: 320000, jobChangeIncrease: 640000 }
  },
  {
    id: 'nutritionist',
    name: '管理栄養士',
    description: '栄養指導の専門家国家資格',
    estimatedHours: 1200,
    difficulty: 'intermediate',
    categoryId: 'medical',
    estimatedCost: { examFee: 6800, materialCost: 50000, courseFee: 2000000 },
    marketValue: { allowanceIncrease: 14000, salaryIncrease: 280000, jobChangeIncrease: 560000 }
  },

  // 教育・語学 (10個)
  {
    id: 'toeic-900',
    name: 'TOEIC 900点以上',
    description: 'ビジネス英語の最高レベルを証明',
    estimatedHours: 800,
    difficulty: 'advanced',
    categoryId: 'education',
    estimatedCost: { examFee: 7810, materialCost: 50000 },
    marketValue: { allowanceIncrease: 25000, salaryIncrease: 500000, jobChangeIncrease: 1000000 }
  },
  {
    id: 'toeic-800',
    name: 'TOEIC 800点以上',
    description: 'ビジネス英語の上級レベルを証明',
    estimatedHours: 400,
    difficulty: 'intermediate',
    categoryId: 'education',
    estimatedCost: { examFee: 7810, materialCost: 30000 },
    marketValue: { allowanceIncrease: 15000, salaryIncrease: 300000, jobChangeIncrease: 600000 }
  },
  {
    id: 'eiken-1',
    name: '英検1級',
    description: '英語力の最高峰を証明する検定',
    estimatedHours: 1000,
    difficulty: 'expert',
    categoryId: 'education',
    estimatedCost: { examFee: 11800, materialCost: 40000 },
    marketValue: { allowanceIncrease: 30000, salaryIncrease: 600000, jobChangeIncrease: 1200000 }
  },
  {
    id: 'eiken-pre1',
    name: '英検準1級',
    description: '大学中級程度の英語力を証明',
    estimatedHours: 500,
    difficulty: 'advanced',
    categoryId: 'education',
    estimatedCost: { examFee: 9800, materialCost: 25000 },
    marketValue: { allowanceIncrease: 18000, salaryIncrease: 350000, jobChangeIncrease: 700000 }
  },
  {
    id: 'japanese-teacher',
    name: '日本語教師',
    description: '日本語を外国人に教える専門資格',
    estimatedHours: 420,
    difficulty: 'intermediate',
    categoryId: 'education',
    estimatedCost: { examFee: 17000, materialCost: 100000, courseFee: 500000 },
    marketValue: { allowanceIncrease: 20000, salaryIncrease: 400000, jobChangeIncrease: 800000 }
  },
  {
    id: 'school-teacher-1',
    name: '中学校・高等学校教諭一種免許状',
    description: '中学・高校で教鞭を取るための国家資格',
    estimatedHours: 2000,
    difficulty: 'advanced',
    categoryId: 'education',
    estimatedCost: { examFee: 0, materialCost: 50000, courseFee: 3000000 },
    marketValue: { allowanceIncrease: 25000, salaryIncrease: 500000, jobChangeIncrease: 1000000 }
  },
  {
    id: 'toefl-100',
    name: 'TOEFL iBT 100点以上',
    description: '海外大学院レベルの英語力を証明',
    estimatedHours: 600,
    difficulty: 'advanced',
    categoryId: 'education',
    estimatedCost: { examFee: 26400, materialCost: 40000 },
    marketValue: { allowanceIncrease: 22000, salaryIncrease: 450000, jobChangeIncrease: 900000 }
  },
  {
    id: 'chinese-hsk6',
    name: '中国語検定1級・HSK6級',
    description: '中国語の最高レベルを証明',
    estimatedHours: 1200,
    difficulty: 'expert',
    categoryId: 'education',
    estimatedCost: { examFee: 12600, materialCost: 50000 },
    marketValue: { allowanceIncrease: 20000, salaryIncrease: 400000, jobChangeIncrease: 800000 }
  },
  {
    id: 'korean-topik6',
    name: '韓国語能力試験(TOPIK)6級',
    description: '韓国語の最高レベルを証明',
    estimatedHours: 800,
    difficulty: 'advanced',
    categoryId: 'education',
    estimatedCost: { examFee: 4400, materialCost: 30000 },
    marketValue: { allowanceIncrease: 15000, salaryIncrease: 300000, jobChangeIncrease: 600000 }
  },
  {
    id: 'interpreter-guide',
    name: '通訳案内士',
    description: '外国人観光客の通訳・案内を行う国家資格',
    estimatedHours: 600,
    difficulty: 'advanced',
    categoryId: 'education',
    estimatedCost: { examFee: 11700, materialCost: 35000 },
    marketValue: { allowanceIncrease: 18000, salaryIncrease: 350000, jobChangeIncrease: 700000 }
  },

  // デザイン・クリエイティブ (10個)
  {
    id: 'web-design-skill',
    name: 'ウェブデザイン技能検定',
    description: 'ウェブデザインの技能を証明する国家資格',
    estimatedHours: 200,
    difficulty: 'intermediate',
    categoryId: 'design',
    estimatedCost: { examFee: 25000, materialCost: 20000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'adobe-certified',
    name: 'Adobe認定エキスパート',
    description: 'Adobe製品の専門知識を証明',
    estimatedHours: 100,
    difficulty: 'intermediate',
    categoryId: 'design',
    estimatedCost: { examFee: 21780, materialCost: 15000 },
    marketValue: { allowanceIncrease: 10000, salaryIncrease: 200000, jobChangeIncrease: 400000 }
  },
  {
    id: 'cg-arts',
    name: 'CGエンジニア検定',
    description: 'CG制作の技術的知識を証明',
    estimatedHours: 150,
    difficulty: 'intermediate',
    categoryId: 'design',
    estimatedCost: { examFee: 6700, materialCost: 18000 },
    marketValue: { allowanceIncrease: 14000, salaryIncrease: 280000, jobChangeIncrease: 560000 }
  },
  {
    id: 'multimedia-search',
    name: 'マルチメディア検定',
    description: 'デジタルコンテンツの企画・制作知識を証明',
    estimatedHours: 80,
    difficulty: 'beginner',
    categoryId: 'design',
    estimatedCost: { examFee: 6700, materialCost: 12000 },
    marketValue: { allowanceIncrease: 8000, salaryIncrease: 150000, jobChangeIncrease: 300000 }
  },
  {
    id: 'color-coordinator',
    name: '色彩検定1級',
    description: '色彩に関する幅広い知識を証明',
    estimatedHours: 120,
    difficulty: 'intermediate',
    categoryId: 'design',
    estimatedCost: { examFee: 15000, materialCost: 15000 },
    marketValue: { allowanceIncrease: 10000, salaryIncrease: 200000, jobChangeIncrease: 400000 }
  },
  {
    id: 'illustrator-skill',
    name: 'Illustratorクリエイター能力認定試験',
    description: 'Illustratorの操作技能を証明',
    estimatedHours: 60,
    difficulty: 'beginner',
    categoryId: 'design',
    estimatedCost: { examFee: 8400, materialCost: 10000 },
    marketValue: { allowanceIncrease: 8000, salaryIncrease: 150000, jobChangeIncrease: 300000 }
  },
  {
    id: 'photoshop-skill',
    name: 'Photoshopクリエイター能力認定試験',
    description: 'Photoshopの操作技能を証明',
    estimatedHours: 60,
    difficulty: 'beginner',
    categoryId: 'design',
    estimatedCost: { examFee: 8400, materialCost: 10000 },
    marketValue: { allowanceIncrease: 8000, salaryIncrease: 150000, jobChangeIncrease: 300000 }
  },
  {
    id: 'dtp-skill',
    name: 'DTPエキスパート',
    description: 'DTP(デスクトップパブリッシング)の専門知識を証明',
    estimatedHours: 150,
    difficulty: 'intermediate',
    categoryId: 'design',
    estimatedCost: { examFee: 20400, materialCost: 20000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'interior-coordinator',
    name: 'インテリアコーディネーター',
    description: 'インテリアの企画・提案を行う専門資格',
    estimatedHours: 300,
    difficulty: 'intermediate',
    categoryId: 'design',
    estimatedCost: { examFee: 14850, materialCost: 25000 },
    marketValue: { allowanceIncrease: 15000, salaryIncrease: 300000, jobChangeIncrease: 600000 }
  },
  {
    id: 'pro-tools-certified',
    name: 'Pro Tools認定オペレーター',
    description: '音楽・音響制作ソフトの専門技術を証明',
    estimatedHours: 100,
    difficulty: 'intermediate',
    categoryId: 'design',
    estimatedCost: { examFee: 30000, materialCost: 20000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },

  // 技術・エンジニアリング (10個)
  {
    id: 'technical-engineer-1',
    name: '技術士',
    description: '技術者の最高峰国家資格',
    estimatedHours: 1500,
    difficulty: 'expert',
    categoryId: 'engineering',
    estimatedCost: { examFee: 12000, materialCost: 100000, courseFee: 300000 },
    marketValue: { allowanceIncrease: 50000, salaryIncrease: 1000000, jobChangeIncrease: 2000000 }
  },
  {
    id: 'assistant-technical-engineer',
    name: '技術士補',
    description: '技術士の前段階となる国家資格',
    estimatedHours: 400,
    difficulty: 'intermediate',
    categoryId: 'engineering',
    estimatedCost: { examFee: 11000, materialCost: 30000 },
    marketValue: { allowanceIncrease: 15000, salaryIncrease: 300000, jobChangeIncrease: 600000 }
  },
  {
    id: 'first-class-architect',
    name: '一級建築士',
    description: '建築設計の最高位国家資格',
    estimatedHours: 2000,
    difficulty: 'expert',
    categoryId: 'engineering',
    estimatedCost: { examFee: 17000, materialCost: 150000, courseFee: 500000 },
    marketValue: { allowanceIncrease: 60000, salaryIncrease: 1200000, jobChangeIncrease: 2400000 }
  },
  {
    id: 'second-class-architect',
    name: '二級建築士',
    description: '中小規模建築物の設計ができる国家資格',
    estimatedHours: 800,
    difficulty: 'advanced',
    categoryId: 'engineering',
    estimatedCost: { examFee: 17700, materialCost: 80000, courseFee: 200000 },
    marketValue: { allowanceIncrease: 25000, salaryIncrease: 500000, jobChangeIncrease: 1000000 }
  },
  {
    id: 'electrical-engineer-1',
    name: '第一種電気工事士',
    description: '高圧電気工事を行える国家資格',
    estimatedHours: 300,
    difficulty: 'advanced',
    categoryId: 'engineering',
    estimatedCost: { examFee: 11300, materialCost: 25000 },
    marketValue: { allowanceIncrease: 20000, salaryIncrease: 400000, jobChangeIncrease: 800000 }
  },
  {
    id: 'electrical-engineer-2',
    name: '第二種電気工事士',
    description: '一般住宅の電気工事を行える国家資格',
    estimatedHours: 150,
    difficulty: 'intermediate',
    categoryId: 'engineering',
    estimatedCost: { examFee: 9300, materialCost: 15000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'energy-manager',
    name: 'エネルギー管理士',
    description: 'エネルギー使用の合理化を図る国家資格',
    estimatedHours: 400,
    difficulty: 'advanced',
    categoryId: 'engineering',
    estimatedCost: { examFee: 17000, materialCost: 30000 },
    marketValue: { allowanceIncrease: 18000, salaryIncrease: 350000, jobChangeIncrease: 700000 }
  },
  {
    id: 'boiler-engineer-1',
    name: '一級ボイラー技士',
    description: 'ボイラーの取扱い・管理を行う国家資格',
    estimatedHours: 200,
    difficulty: 'intermediate',
    categoryId: 'engineering',
    estimatedCost: { examFee: 6800, materialCost: 12000 },
    marketValue: { allowanceIncrease: 10000, salaryIncrease: 200000, jobChangeIncrease: 400000 }
  },
  {
    id: 'dangerous-materials',
    name: '危険物取扱者(甲種)',
    description: '全類の危険物を取り扱える国家資格',
    estimatedHours: 150,
    difficulty: 'intermediate',
    categoryId: 'engineering',
    estimatedCost: { examFee: 6500, materialCost: 10000 },
    marketValue: { allowanceIncrease: 12000, salaryIncrease: 250000, jobChangeIncrease: 500000 }
  },
  {
    id: 'construction-machinery',
    name: '建設機械施工管理技士',
    description: '建設機械を用いた工事の管理を行う国家資格',
    estimatedHours: 300,
    difficulty: 'intermediate',
    categoryId: 'engineering',
    estimatedCost: { examFee: 14700, materialCost: 20000 },
    marketValue: { allowanceIncrease: 15000, salaryIncrease: 300000, jobChangeIncrease: 600000 }
  },

  // カスタム入力用
  {
    id: 'custom',
    name: 'その他の資格',
    description: '上記以外の資格（カスタム入力）',
    estimatedHours: 0,
    difficulty: 'beginner',
    categoryId: 'it-engineer',
    estimatedCost: { examFee: 0, materialCost: 0 },
    marketValue: { allowanceIncrease: 0, salaryIncrease: 0, jobChangeIncrease: 0 }
  }
];

// 職種別資格フィルタリング関数
export const getQualificationsByCategory = (categoryId: string): QualificationLevel[] => {
  return EXPANDED_QUALIFICATION_PRESETS.filter(
    qualification => qualification.categoryId === categoryId
  );
};

// 資格データ統計
export const QUALIFICATION_STATS = {
  totalQualifications: EXPANDED_QUALIFICATION_PRESETS.length,
  categoryCounts: JOB_CATEGORIES.reduce((acc, category) => {
    acc[category.id] = getQualificationsByCategory(category.id).length;
    return acc;
  }, {} as Record<string, number>),
  difficultyDistribution: EXPANDED_QUALIFICATION_PRESETS.reduce((acc, qual) => {
    acc[qual.difficulty] = (acc[qual.difficulty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};