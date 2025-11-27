import type { TaskDefinition, TaskCostAnalysis, TeamTaskOverview, Team, CostCalculationMethod } from '../types';
import { calculateTeamCost } from './teamCalculations';

/**
 * 作業の年間実行回数を計算
 */
export const calculateAnnualExecutions = (task: TaskDefinition): number => {
  const { frequency } = task;
  
  switch (frequency.type) {
    case 'once':
      return 1;
    
    case 'daily':
      return 365 / (frequency.interval || 1);
    
    case 'weekly': {
      const weeklyInterval = frequency.interval || 1;
      const daysInWeek = frequency.daysOfWeek?.length || 1;
      return (52 / weeklyInterval) * daysInWeek;
    }
    
    case 'monthly':
      return 12 / (frequency.interval || 1);
    
    case 'yearly':
      return 1 / (frequency.interval || 1);
    
    default:
      return 0;
  }
};

/**
 * 作業のコスト分析を計算
 */
export const calculateTaskCostAnalysis = (
  task: TaskDefinition,
  team: Team,
  costCalculationMethod: CostCalculationMethod = 'individual'
): TaskCostAnalysis => {
  // チームのコスト計算
  const teamCostCalculation = calculateTeamCost(team, costCalculationMethod);
  
  // 年間実行回数
  const annualExecutionCount = calculateAnnualExecutions(task);
  
  // 分あたりのコスト（時給を60で割る）
  const costPerMinute = teamCostCalculation.totalHourlyCost / 60;
  
  // 1回の実行コスト
  const singleExecutionCost = costPerMinute * task.estimatedMinutes;
  
  // 年間総コスト
  const annualTotalCost = singleExecutionCost * annualExecutionCount;

  return {
    taskId: task.id,
    taskName: task.name,
    singleExecutionCost,
    annualExecutionCount,
    annualTotalCost,
    costPerMinute,
    teamCostCalculation,
  };
};

/**
 * チームの全作業概要を計算
 */
export const calculateTeamTaskOverview = (
  team: Team,
  tasks: TaskDefinition[],
  costCalculationMethod: CostCalculationMethod = 'individual'
): TeamTaskOverview => {
  // チームに関連する作業のみをフィルタリング
  const teamTasks = tasks.filter(task => task.teamId === team.id && task.isActive);
  
  // 各作業のコスト分析を計算
  const taskAnalyses = teamTasks.map(task => 
    calculateTaskCostAnalysis(task, team, costCalculationMethod)
  );
  
  // 総年間コスト
  const totalAnnualCost = taskAnalyses.reduce((sum, analysis) => sum + analysis.annualTotalCost, 0);
  
  // 総年間時間（分）
  const totalAnnualMinutes = taskAnalyses.reduce((sum, analysis) => 
    sum + (analysis.annualExecutionCount * calculateTaskMinutes(tasks.find(t => t.id === analysis.taskId)!)), 0
  );
  
  // 最も高コストな作業
  const highestCostTask = taskAnalyses.length > 0 
    ? taskAnalyses.reduce((highest, current) => 
        current.annualTotalCost > highest.annualTotalCost ? current : highest
      )
    : null;

  return {
    teamId: team.id,
    teamName: team.name,
    totalTasks: teamTasks.length,
    totalAnnualCost,
    totalAnnualHours: totalAnnualMinutes / 60,
    highestCostTask,
    tasks: taskAnalyses,
  };
};

/**
 * 作業の推定時間を取得（分）
 */
const calculateTaskMinutes = (task: TaskDefinition): number => {
  return task.estimatedMinutes;
};

/**
 * 複数チームの作業概要を比較
 */
export const compareTeamTaskOverviews = (
  teams: Team[],
  tasks: TaskDefinition[],
  costCalculationMethod: CostCalculationMethod = 'individual'
): TeamTaskOverview[] => {
  return teams.map(team => 
    calculateTeamTaskOverview(team, tasks, costCalculationMethod)
  ).sort((a, b) => b.totalAnnualCost - a.totalAnnualCost); // コスト降順でソート
};

/**
 * 作業効率分析
 */
export const analyzeTaskEfficiency = (taskAnalyses: TaskCostAnalysis[]) => {
  if (taskAnalyses.length === 0) {
    return {
      averageCostPerExecution: 0,
      averageAnnualCost: 0,
      mostExpensiveTask: null,
      mostFrequentTask: null,
      costDistribution: {},
      timeDistribution: {},
    };
  }

  const averageCostPerExecution = taskAnalyses.reduce((sum, analysis) => 
    sum + analysis.singleExecutionCost, 0) / taskAnalyses.length;
  
  const averageAnnualCost = taskAnalyses.reduce((sum, analysis) => 
    sum + analysis.annualTotalCost, 0) / taskAnalyses.length;
  
  const mostExpensiveTask = taskAnalyses.reduce((most, current) => 
    current.annualTotalCost > most.annualTotalCost ? current : most);
  
  const mostFrequentTask = taskAnalyses.reduce((most, current) => 
    current.annualExecutionCount > most.annualExecutionCount ? current : most);

  // コスト分布（範囲別）
  const costDistribution = taskAnalyses.reduce((dist, analysis) => {
    const range = getCostRange(analysis.annualTotalCost);
    // eslint-disable-next-line security/detect-object-injection
    dist[range] = (dist[range] || 0) + 1;
    return dist;
  }, {} as Record<string, number>);

  // 実行時間分布（範囲別）
  const timeDistribution = taskAnalyses.reduce((dist, analysis) => {
    const range = getTimeRange(analysis.annualExecutionCount);
    // eslint-disable-next-line security/detect-object-injection
    dist[range] = (dist[range] || 0) + 1;
    return dist;
  }, {} as Record<string, number>);

  return {
    averageCostPerExecution,
    averageAnnualCost,
    mostExpensiveTask,
    mostFrequentTask,
    costDistribution,
    timeDistribution,
  };
};

/**
 * コスト範囲を取得
 */
const getCostRange = (cost: number): string => {
  if (cost < 10000) return '1万円未満';
  if (cost < 50000) return '1-5万円';
  if (cost < 100000) return '5-10万円';
  if (cost < 500000) return '10-50万円';
  return '50万円以上';
};

/**
 * 実行回数範囲を取得
 */
const getTimeRange = (executions: number): string => {
  if (executions < 12) return '月1回未満';
  if (executions < 52) return '週1回未満';
  if (executions < 365) return '日1回未満';
  return '日1回以上';
};

/**
 * 作業の ROI（投資対効果）分析
 * 注: この機能では仮想的な価値を想定。実際のシステムでは業務価値を入力する必要がある
 */
export const analyzeTaskROI = (
  taskAnalysis: TaskCostAnalysis,
  estimatedBusinessValue: number // 年間ビジネス価値（円）
) => {
  const roi = estimatedBusinessValue > 0 
    ? ((estimatedBusinessValue - taskAnalysis.annualTotalCost) / taskAnalysis.annualTotalCost) * 100 
    : 0;
  
  const breakEvenPoint = taskAnalysis.singleExecutionCost > 0 
    ? estimatedBusinessValue / taskAnalysis.singleExecutionCost 
    : 0;

  return {
    roi, // ROI（%）
    breakEvenPoint, // 損益分岐点（実行回数）
    annualProfit: estimatedBusinessValue - taskAnalysis.annualTotalCost, // 年間利益
    costEfficiency: estimatedBusinessValue / taskAnalysis.annualTotalCost, // コスト効率
  };
};

/**
 * 作業の頻度説明を生成
 */
export const generateFrequencyDescription = (task: TaskDefinition): string => {
  const { frequency } = task;
  const interval = frequency.interval || 1;
  
  switch (frequency.type) {
    case 'once':
      return '1回のみ';
    
    case 'daily':
      return interval === 1 ? '毎日' : `${interval}日に1回`;
    
    case 'weekly':
      if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        // eslint-disable-next-line security/detect-object-injection
        const days = frequency.daysOfWeek.map(day => dayNames[day]).join('・');
        const weekText = interval === 1 ? '' : `${interval}週間毎の`;
        return `${weekText}${days}曜日`;
      }
      return interval === 1 ? '毎週' : `${interval}週に1回`;
    
    case 'monthly': {
      const dayText = frequency.dayOfMonth ? `${frequency.dayOfMonth}日` : '';
      return interval === 1 ? `毎月${dayText}` : `${interval}ヶ月に1回${dayText}`;
    }
    
    case 'yearly': {
      const monthText = frequency.monthOfYear ? `${frequency.monthOfYear}月` : '';
      const dayInMonthText = frequency.dayOfMonth ? `${frequency.dayOfMonth}日` : '';
      return interval === 1 ? `毎年${monthText}${dayInMonthText}` : `${interval}年に1回${monthText}${dayInMonthText}`;
    }
    
    default:
      return '不明';
  }
};