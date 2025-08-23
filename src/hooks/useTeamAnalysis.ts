import { useState, useCallback, useMemo } from 'react';
import { useTeamManagement } from './useTeamManagement';
import { useTaskManagement } from './useTaskManagement';
import type { 
  Team, 
  TaskDefinition, 
  CostCalculationMethod, 
  TeamCostCalculation,
  TaskCostAnalysis,
  TeamTaskOverview 
} from '../types';
import { 
  calculateTeamCost, 
  compareCalculationMethods, 
  getTeamRoleStatistics,
  getTeamCostSummary 
} from '../utils/teamCalculations';
import { 
  calculateTaskCostAnalysis,
  calculateTeamTaskOverview,
  compareTeamTaskOverviews,
  analyzeTaskEfficiency 
} from '../utils/taskCalculations';

export const useTeamAnalysis = () => {
  const { teams, getTeamById } = useTeamManagement();
  const { tasks, getTasksByTeamId } = useTaskManagement();
  
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [costCalculationMethod, setCostCalculationMethod] = useState<CostCalculationMethod>('individual');

  // 選択中のチーム
  const selectedTeam = useMemo(() => {
    return selectedTeamId ? getTeamById(selectedTeamId) : null;
  }, [selectedTeamId, getTeamById]);

  // 選択中のチームの作業一覧
  const selectedTeamTasks = useMemo(() => {
    return selectedTeamId ? getTasksByTeamId(selectedTeamId) : [];
  }, [selectedTeamId, getTasksByTeamId]);

  // 選択中のチームのコスト計算
  const selectedTeamCostCalculation = useMemo(() => {
    if (!selectedTeam) return null;
    return calculateTeamCost(selectedTeam, costCalculationMethod);
  }, [selectedTeam, costCalculationMethod]);

  // 選択中のチームの作業概要
  const selectedTeamTaskOverview = useMemo(() => {
    if (!selectedTeam) return null;
    return calculateTeamTaskOverview(selectedTeam, tasks, costCalculationMethod);
  }, [selectedTeam, tasks, costCalculationMethod]);

  // 全チームの比較データ
  const allTeamsComparison = useMemo(() => {
    return compareTeamTaskOverviews(teams, tasks, costCalculationMethod);
  }, [teams, tasks, costCalculationMethod]);

  // チーム別コスト計算方法比較
  const getTeamCostMethodComparison = useCallback((teamId: string) => {
    const team = getTeamById(teamId);
    if (!team) return null;
    return compareCalculationMethods(team);
  }, [getTeamById]);

  // チーム別役割統計
  const getTeamRoleStats = useCallback((teamId: string) => {
    const team = getTeamById(teamId);
    if (!team) return null;
    return getTeamRoleStatistics(team);
  }, [getTeamById]);

  // チームコストサマリー
  const getTeamCostSummaryData = useCallback((teamCostCalculation: TeamCostCalculation) => {
    return getTeamCostSummary(teamCostCalculation);
  }, []);

  // 作業効率分析
  const getTaskEfficiencyAnalysis = useCallback((teamId: string) => {
    const team = getTeamById(teamId);
    if (!team) return null;

    const teamTasks = getTasksByTeamId(teamId).filter(task => task.isActive);
    const taskAnalyses = teamTasks.map(task => 
      calculateTaskCostAnalysis(task, team, costCalculationMethod)
    );

    return analyzeTaskEfficiency(taskAnalyses);
  }, [getTeamById, getTasksByTeamId, costCalculationMethod]);

  // 作業別詳細分析
  const getTaskDetailedAnalysis = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    const team = getTeamById(task.teamId);
    if (!team) return null;

    return calculateTaskCostAnalysis(task, team, costCalculationMethod);
  }, [tasks, getTeamById, costCalculationMethod]);

  // 複数チームの横断分析
  const getCrossTeamAnalysis = useCallback(() => {
    const teamsWithStats = teams.map(team => {
      const teamTasks = getTasksByTeamId(team.id);
      const teamOverview = calculateTeamTaskOverview(team, tasks, costCalculationMethod);
      const costCalculation = calculateTeamCost(team, costCalculationMethod);
      const roleStats = getTeamRoleStatistics(team);

      return {
        team,
        overview: teamOverview,
        costCalculation,
        roleStats,
        taskCount: teamTasks.length,
        activeTaskCount: teamTasks.filter(t => t.isActive).length,
      };
    });

    // 総計算
    const totalAnnualCost = teamsWithStats.reduce((sum, item) => sum + item.overview.totalAnnualCost, 0);
    const totalAnnualHours = teamsWithStats.reduce((sum, item) => sum + item.overview.totalAnnualHours, 0);
    const totalActiveTasks = teamsWithStats.reduce((sum, item) => sum + item.activeTaskCount, 0);
    const totalMembers = teamsWithStats.reduce((sum, item) => sum + item.costCalculation.memberBreakdown.length, 0);

    // 最高・最低コストチーム
    const highestCostTeam = teamsWithStats.reduce((highest, current) => 
      current.overview.totalAnnualCost > highest.overview.totalAnnualCost ? current : highest
    );
    const lowestCostTeam = teamsWithStats.reduce((lowest, current) => 
      current.overview.totalAnnualCost < lowest.overview.totalAnnualCost ? current : lowest
    );

    return {
      teams: teamsWithStats,
      totals: {
        totalAnnualCost,
        totalAnnualHours,
        totalActiveTasks,
        totalMembers,
        averageCostPerTeam: totalAnnualCost / teams.length,
        averageHoursPerTeam: totalAnnualHours / teams.length,
      },
      extremes: {
        highestCostTeam,
        lowestCostTeam,
        costDifference: highestCostTeam.overview.totalAnnualCost - lowestCostTeam.overview.totalAnnualCost,
      },
    };
  }, [teams, tasks, getTasksByTeamId, costCalculationMethod]);

  // 期間別分析（月別、四半期別等）
  const getPeriodAnalysis = useCallback((teamId: string, period: 'monthly' | 'quarterly' | 'yearly') => {
    const team = getTeamById(teamId);
    if (!team) return null;

    const teamTasks = getTasksByTeamId(teamId).filter(task => task.isActive);
    const periodMultiplier = period === 'monthly' ? 1/12 : period === 'quarterly' ? 1/4 : 1;

    const periodAnalysis = teamTasks.map(task => {
      const taskAnalysis = calculateTaskCostAnalysis(task, team, costCalculationMethod);
      return {
        ...taskAnalysis,
        periodExecutionCount: taskAnalysis.annualExecutionCount * periodMultiplier,
        periodTotalCost: taskAnalysis.annualTotalCost * periodMultiplier,
      };
    });

    const totalPeriodCost = periodAnalysis.reduce((sum, analysis) => sum + analysis.periodTotalCost, 0);
    const totalPeriodExecutions = periodAnalysis.reduce((sum, analysis) => sum + analysis.periodExecutionCount, 0);

    return {
      period,
      tasks: periodAnalysis,
      totalPeriodCost,
      totalPeriodExecutions,
      averageCostPerExecution: totalPeriodExecutions > 0 ? totalPeriodCost / totalPeriodExecutions : 0,
    };
  }, [getTeamById, getTasksByTeamId, costCalculationMethod]);

  // コスト最適化提案
  const getCostOptimizationSuggestions = useCallback((teamId: string) => {
    const team = getTeamById(teamId);
    if (!team) return null;

    const teamTasks = getTasksByTeamId(teamId).filter(task => task.isActive);
    const taskAnalyses = teamTasks.map(task => 
      calculateTaskCostAnalysis(task, team, costCalculationMethod)
    );

    // 高コスト作業（年間コストの上位20%）
    const sortedByCost = [...taskAnalyses].sort((a, b) => b.annualTotalCost - a.annualTotalCost);
    const highCostTasks = sortedByCost.slice(0, Math.ceil(sortedByCost.length * 0.2));

    // 高頻度作業（実行回数の上位20%）
    const sortedByFrequency = [...taskAnalyses].sort((a, b) => b.annualExecutionCount - a.annualExecutionCount);
    const highFrequencyTasks = sortedByFrequency.slice(0, Math.ceil(sortedByFrequency.length * 0.2));

    // 非効率作業（1回あたりのコストが高い）
    const sortedByEfficiency = [...taskAnalyses].sort((a, b) => b.singleExecutionCost - a.singleExecutionCost);
    const inefficientTasks = sortedByEfficiency.slice(0, Math.ceil(sortedByEfficiency.length * 0.2));

    return {
      highCostTasks: highCostTasks.map(analysis => ({
        ...analysis,
        suggestion: '自動化または外部委託を検討',
        potentialSaving: analysis.annualTotalCost * 0.3, // 30%削減を仮定
      })),
      highFrequencyTasks: highFrequencyTasks.map(analysis => ({
        ...analysis,
        suggestion: 'プロセス簡素化または自動化を検討',
        potentialSaving: analysis.annualTotalCost * 0.4, // 40%削減を仮定
      })),
      inefficientTasks: inefficientTasks.map(analysis => ({
        ...analysis,
        suggestion: '作業手順の見直しまたは人員配置の最適化を検討',
        potentialSaving: analysis.annualTotalCost * 0.2, // 20%削減を仮定
      })),
    };
  }, [getTeamById, getTasksByTeamId, costCalculationMethod]);

  return {
    // State
    selectedTeamId,
    costCalculationMethod,
    selectedTeam,
    selectedTeamTasks,
    selectedTeamCostCalculation,
    selectedTeamTaskOverview,
    allTeamsComparison,

    // Actions
    setSelectedTeamId,
    setCostCalculationMethod,

    // Analysis functions
    getTeamCostMethodComparison,
    getTeamRoleStats,
    getTeamCostSummaryData,
    getTaskEfficiencyAnalysis,
    getTaskDetailedAnalysis,
    getCrossTeamAnalysis,
    getPeriodAnalysis,
    getCostOptimizationSuggestions,
  };
};