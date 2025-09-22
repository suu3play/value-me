import type { HappinessQuestion } from '../types/happiness';

export const happinessQuestions: HappinessQuestion[] = [
  // 基本質問
  {
    id: 'job-growth',
    categoryId: 'job',
    internalContent: '現在の仕事にやりがいを感じているか',
    displayText: 'ねぇ、今の仕事って正直楽しい？ワクワクしてる？',
  },
  {
    id: 'job-relationships',
    categoryId: 'job',
    internalContent: '職場の人間関係に満足しているか',
    displayText: '職場の仲間とは仲良し？「やったね！」を分かち合える関係？',
  },
  {
    id: 'job-balance',
    categoryId: 'job',
    internalContent: 'ワークライフバランスが取れているか',
    displayText: '仕事とプライベート、いい感じにバランス取れてる？',
  },
  {
    id: 'health-sleep',
    categoryId: 'health',
    internalContent: '十分な睡眠が取れているか',
    displayText: 'ちゃんとぐっすり眠れてる？朝スッキリ起きられてる？',
  },
  {
    id: 'health-exercise',
    categoryId: 'health',
    internalContent: '日常的な運動習慣があるか',
    displayText: 'こまめに動いてる？運動する習慣ある？',
  },
  {
    id: 'health-diet',
    categoryId: 'health',
    internalContent: '食事に気を付けているか',
    displayText: '自分の体にやさしい食事を心がけてる？',
  },
  {
    id: 'family-time',
    categoryId: 'family',
    internalContent: '家族や恋人との時間を大切にできているか',
    displayText: '家族や恋人と、かけがえのない時間を過ごせてる？',
  },
  {
    id: 'family-communication',
    categoryId: 'family',
    internalContent: '家族や恋人とのコミュニケーションは円滑か',
    displayText: '家族や恋人とのコミュニケーションは円滑？',
  },
  {
    id: 'family-future',
    categoryId: 'family',
    internalContent: '将来について前向きに話せているか',
    displayText: '将来について前向きに話せてる？',
  },
  {
    id: 'hobby-enjoyment',
    categoryId: 'hobby',
    internalContent: '「これやってみたかったんだ！」という趣味を楽しめているか',
    displayText: '「これやってみたかったんだ！」って趣味、楽しめてる？',
  },
  {
    id: 'hobby-investment',
    categoryId: 'hobby',
    internalContent: '自己投資に時間やお金を使えているか',
    displayText: '新しい自分に出会うために、時間やお金を使えてる？',
  },
  {
    id: 'hobby-curiosity',
    categoryId: 'hobby',
    internalContent: '「もっと知りたい！」という好奇心が満たされているか',
    displayText: '「もっと知りたい！」っていう好奇心、満たせてる？',
  },
  {
    id: 'sns-balance',
    categoryId: 'sns',
    internalContent: 'SNSの利用時間や頻度は適切か',
    displayText: 'SNS、ちょうどいい感じに付き合えてる？',
  },
  {
    id: 'sns-info',
    categoryId: 'sns',
    internalContent: 'SNSから有益な情報を得られているか',
    displayText: 'SNS見てると「おぉ！」ってなる、ためになる情報に出会えてる？',
  },
  {
    id: 'sns-comparison',
    categoryId: 'sns',
    internalContent: 'SNSで他人と比較して落ち込むことが少ないか',
    displayText: '誰かと比べて「うーん…」ってなったり、落ち込むことは少ない？',
  }
];

export const additionalQuestions: HappinessQuestion[] = [
  // 追加質問（将来拡張用）
  {
    id: 'job-growth-detailed',
    categoryId: 'job',
    internalContent: 'スキルアップの機会に満足しているか',
    displayText: '新しいスキルを身につける機会、十分にある？',
    isAdditional: true,
  },
  {
    id: 'health-stress',
    categoryId: 'health',
    internalContent: 'ストレスを適切に発散できているか',
    displayText: 'ストレス、うまく発散できてる？',
    isAdditional: true,
  },
];

export const categoryLabels = {
  job: '仕事',
  health: '健康',
  family: '家族',
  hobby: '趣味',
  sns: 'SNS',
} as const;

export const categoryDescriptions = {
  job: '働きがい・人間関係・ワークライフバランス',
  health: '睡眠・運動・食事',
  family: '時間・コミュニケーション・将来設計',
  hobby: '楽しみ・自己投資・好奇心',
  sns: '利用バランス・情報収集・心理的影響',
} as const;