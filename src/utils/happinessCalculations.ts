import type { HappinessFactors, HappinessWeights, HappinessResult, HappinessCalculationData } from '../types/happiness';

export const defaultWeights: HappinessWeights = {
  job: 25,
  health: 20,
  family: 20,
  hobby: 20,
  sns: 15,
};

export const defaultFactors: HappinessFactors = {
  job: {
    growth: 5.5,
    relationships: 5.5,
    balance: 5.5,
  },
  health: {
    sleep: 5.5,
    exercise: 5.5,
    diet: 5.5,
  },
  family: {
    time: 5.5,
    communication: 5.5,
    future: 5.5,
  },
  hobby: {
    enjoyment: 5.5,
    investment: 5.5,
    curiosity: 5.5,
  },
  sns: {
    balance: 5.5,
    info: 5.5,
    comparison: 5.5,
  },
};

export function calculateCategoryScore(categoryFactors: Record<string, number>): number {
  const scores = Object.values(categoryFactors);
  const total = scores.reduce((sum, score) => sum + score, 0);
  return (total / scores.length) * 10; // 1-10スケールを1-100スケールに変換
}

export function calculateTotalScore(
  categoryScores: Record<string, number>,
  weights: HappinessWeights
): number {
  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  const weightedSum = Object.entries(categoryScores).reduce((sum, [category, score]) => {
    const weight = weights[category as keyof HappinessWeights] || 0;
    return sum + (score * weight);
  }, 0);

  return weightedSum / totalWeight;
}

export function calculateHappinessMultiplier(totalScore: number, balanceBonus: number = 0, synergyBonus: number = 0): number {
  // 幸福度スコア（0-100）を時給への乗数（0.6-1.8）に変換
  // 55点（中央値）でボーナス0%になるよう調整
  const baseMultiplier = 1.0;
  const maxVariation = 0.6;
  const neutralPoint = 55; // 10段階評価の中央値（5.5 * 10）

  // 正規化スコアを-1から1の範囲に調整
  const normalizedScore = (totalScore - neutralPoint) / 45; // 55から100までの幅45で正規化

  // 基本乗数を計算（中立点では0になる）
  let multiplier = baseMultiplier + (normalizedScore * maxVariation);

  // バランスボーナス（最大+0.2）
  multiplier += balanceBonus;

  // シナジーボーナス（最大+0.3）
  multiplier += synergyBonus;

  // 高スコア時の追加ブースト
  if (totalScore >= 75) {
    multiplier += 0.1; // 75点以上で+10%
  }
  if (totalScore >= 85) {
    multiplier += 0.1; // 85点以上でさらに+10%
  }

  return Math.max(0.6, Math.min(1.8, multiplier));
}

export function calculateAdjustedHourlyWage(
  baseWage: number,
  totalScore: number,
  balanceBonus: number = 0,
  synergyBonus: number = 0
): number {
  const multiplier = calculateHappinessMultiplier(totalScore, balanceBonus, synergyBonus);
  return baseWage * multiplier;
}

export function identifyImprovementAreas(
  categoryScores: Record<string, number>,
  targetScore?: number
): string[] {
  const sortedCategories = Object.entries(categoryScores).sort(([, a], [, b]) => a - b);
  const improvementAreas: string[] = [];

  // 最も低いスコアのカテゴリを改善領域として特定
  const lowestCategory = sortedCategories[0]?.[0] || '';

  if (targetScore) {
    // 目標スコアが設定されている場合、目標との差が大きいカテゴリを特定
    const targetDifferences = Object.entries(categoryScores).map(([category, score]) => ({
      category,
      difference: targetScore - score,
    }));

    const significantGaps = targetDifferences
      .filter(({ difference }) => difference > 10)
      .sort((a, b) => b.difference - a.difference)
      .slice(0, 3);

    improvementAreas.push(...significantGaps.map(({ category }) => category));
  } else {
    // 目標スコアがない場合、平均以下のカテゴリを特定
    const averageScore = Object.values(categoryScores).reduce((sum, score) => sum + score, 0) / Object.keys(categoryScores).length;

    const belowAverageCategories = Object.entries(categoryScores)
      .filter(([, score]) => score < averageScore)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 2)
      .map(([category]) => category);

    improvementAreas.push(...belowAverageCategories);
  }

  return improvementAreas.length > 0 ? improvementAreas : [lowestCategory];
}

// バランスボーナスの計算
export function calculateBalanceBonus(categoryScores: Record<string, number>): number {
  const scores = Object.values(categoryScores);
  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

  // 中立点以下ではバランスボーナスを与えない
  if (average <= 55) {
    return 0;
  }

  // 標準偏差を計算してバランスを評価
  const variance = scores.reduce((sum, score) => sum + Math.pow(score - average, 2), 0) / scores.length;
  const standardDeviation = Math.sqrt(variance);

  // 標準偏差が小さいほどバランスが良い（最大0.2のボーナス）
  const maxStdDev = 20; // 標準偏差の最大想定値
  const balanceScore = Math.max(0, 1 - (standardDeviation / maxStdDev));

  return balanceScore * 0.2;
}

// シナジー効果の計算
export function calculateSynergyBonus(categoryScores: Record<string, number>): number {
  let synergyBonus = 0;

  // 中立点以下ではシナジーボーナスを与えない
  const scores = Object.values(categoryScores);
  const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  if (averageScore <= 55) {
    return 0;
  }

  // 仕事と健康のシナジー（中立点以上の部分のみ）
  const jobHealthSynergy = Math.max(0, Math.min(categoryScores.job || 0, categoryScores.health || 0) - 55) / 100;
  synergyBonus += jobHealthSynergy * 0.08;

  // 家族と趣味のシナジー
  const familyHobbySynergy = Math.max(0, Math.min(categoryScores.family || 0, categoryScores.hobby || 0) - 55) / 100;
  synergyBonus += familyHobbySynergy * 0.06;

  // 健康とSNSのシナジー（健康的なSNS利用）
  const healthSnsSynergy = Math.max(0, Math.min(categoryScores.health || 0, categoryScores.sns || 0) - 55) / 100;
  synergyBonus += healthSnsSynergy * 0.04;

  // 全カテゴリ高スコア時の特別ボーナス
  const allHigh = Object.values(categoryScores).every(score => score >= 65);
  if (allHigh) {
    synergyBonus += 0.12; // 全カテゴリ65点以上で+12%
  }

  return Math.min(synergyBonus, 0.3); // 最大30%
}

export function calculateHappiness(data: HappinessCalculationData): HappinessResult {
  const categoryScores = {
    job: calculateCategoryScore(data.factors.job),
    health: calculateCategoryScore(data.factors.health),
    family: calculateCategoryScore(data.factors.family),
    hobby: calculateCategoryScore(data.factors.hobby),
    sns: calculateCategoryScore(data.factors.sns),
  };

  const totalScore = calculateTotalScore(categoryScores, data.weights);

  // ボーナス計算
  const balanceBonus = calculateBalanceBonus(categoryScores);
  const synergyBonus = calculateSynergyBonus(categoryScores);

  const adjustedHourlyWage = calculateAdjustedHourlyWage(data.baseHourlyWage, totalScore, balanceBonus, synergyBonus);
  const happinessBonus = ((adjustedHourlyWage - data.baseHourlyWage) / data.baseHourlyWage) * 100;
  const improvementAreas = identifyImprovementAreas(categoryScores, data.targetScore);

  return {
    totalScore,
    categoryScores,
    adjustedHourlyWage,
    happinessBonus,
    targetScore: data.targetScore,
    improvementAreas,
    balanceBonus: balanceBonus * 100, // パーセンテージに変換
    synergyBonus: synergyBonus * 100, // パーセンテージに変換
  };
}

export function getScoreDescription(score: number): string {
  if (score >= 85) return '非常に良好';
  if (score >= 70) return '良好';
  if (score >= 60) return 'やや良好';
  if (score >= 50) return '普通';
  if (score >= 35) return 'やや不足';
  return '改善が必要';
}

export function getImprovementSuggestion(category: string, score: number): string {
  const suggestions: Record<string, Record<string, string>> = {
    job: {
      low: '仕事のやりがいや職場環境の改善を検討してみましょう。上司との面談や転職も選択肢です。健康スコアとのシナジー効果でボーナスUPも期待できます。',
      medium: '現在の仕事に満足している部分を活かしつつ、さらなる成長の機会を探してみましょう。',
      high: '素晴らしい職場環境ですね！この状況を維持し、同僚にも良い影響を与えていきましょう。',
    },
    health: {
      low: '睡眠・運動・食事の基本的な生活習慣を見直してみましょう。仕事やSNSスコアとの相乗効果で大幅ボーナスが得られます。',
      medium: '健康管理への意識は良好です。さらに具体的な目標を設定して取り組んでみましょう。',
      high: '健康的な生活習慣が身についていますね！この調子で継続していきましょう。',
    },
    family: {
      low: '家族や大切な人との時間を意識的に確保してみましょう。趣味スコアとのシナジーでボーナスが増えます。',
      medium: '良好な関係性を維持できています。さらに深いつながりを築いていきましょう。',
      high: '家族との関係が非常に良好ですね！この絆を大切に育んでいきましょう。',
    },
    hobby: {
      low: '自分が本当に楽しめる活動を見つけて、時間を作って取り組んでみましょう。',
      medium: '趣味への取り組みは順調です。新しい分野への挑戦も考えてみませんか？',
      high: '趣味を十分に楽しめていますね！この充実感を他の分野にも活かしていきましょう。',
    },
    sns: {
      low: 'SNSとの付き合い方を見直してみましょう。利用時間の調整や内容の見直しが効果的です。',
      medium: 'SNSをうまく活用できています。さらに有益な情報収集に重点を置いてみましょう。',
      high: 'SNSとの健全な関係を築けていますね！この バランス感覚を維持していきましょう。',
    },
  };

  const categoryName = category as keyof typeof suggestions;
  const level = score >= 65 ? 'high' : score >= 45 ? 'medium' : 'low';

  return suggestions[categoryName]?.[level] || '継続的な改善を心がけましょう。';
}