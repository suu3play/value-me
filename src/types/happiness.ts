export interface HappinessQuestion {
  id: string;
  categoryId: string;
  internalContent: string;
  displayText: string;
  isAdditional?: boolean;
}

export interface HappinessAnswer {
  questionId: string;
  score: number; // 1-5
}

export interface HappinessFactors {
  job: {
    growth: number;
    relationships: number;
    balance: number;
  };
  health: {
    sleep: number;
    exercise: number;
    diet: number;
  };
  family: {
    time: number;
    communication: number;
    future: number;
  };
  hobby: {
    enjoyment: number;
    investment: number;
    curiosity: number;
  };
  sns: {
    balance: number;
    info: number;
    comparison: number;
  };
}

export interface HappinessWeights {
  job: number;
  health: number;
  family: number;
  hobby: number;
  sns: number;
}

export interface HappinessResult {
  totalScore: number;
  categoryScores: {
    job: number;
    health: number;
    family: number;
    hobby: number;
    sns: number;
  };
  adjustedHourlyWage: number;
  happinessBonus: number;
  balanceBonus?: number;
  synergyBonus?: number;
  targetScore?: number;
  improvementAreas: string[];
}

export interface HappinessCalculationData {
  factors: HappinessFactors;
  weights: HappinessWeights;
  baseHourlyWage: number;
  targetScore?: number;
  additionalAnswers?: HappinessAnswer[];
}