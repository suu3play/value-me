import { useState, useEffect, useCallback } from 'react';
import { TaskDefinition, TaskFrequency } from '../types';

const STORAGE_KEY = 'value-me-tasks';

export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<TaskDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ローカルストレージから作業情報を読み込み
  useEffect(() => {
    const loadTasks = () => {
      try {
        const storedTasks = localStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
          const parsedTasks = JSON.parse(storedTasks);
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('作業情報の読み込みに失敗しました:', error);
      }
    };

    loadTasks();
  }, []);

  // ローカルストレージに作業情報を保存
  const saveTasks = useCallback((tasksData: TaskDefinition[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasksData));
      setTasks(tasksData);
    } catch (error) {
      console.error('作業情報の保存に失敗しました:', error);
    }
  }, []);

  // 新しい作業を作成
  const createTask = useCallback((
    name: string,
    teamId: string,
    estimatedMinutes: number,
    frequency: TaskFrequency,
    description?: string,
    tags?: string[]
  ): TaskDefinition => {
    const newTask: TaskDefinition = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      estimatedMinutes,
      frequency,
      teamId,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags,
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return newTask;
  }, [tasks, saveTasks]);

  // 作業情報を更新
  const updateTask = useCallback((
    taskId: string,
    updates: Partial<Omit<TaskDefinition, 'id' | 'createdAt'>>
  ) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    );
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // 作業を削除
  const deleteTask = useCallback((taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // 作業のアクティブ状態を切り替え
  const toggleTaskActive = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTask(taskId, { isActive: !task.isActive });
    }
  }, [tasks, updateTask]);

  // 作業を複製
  const duplicateTask = useCallback((taskId: string, newName?: string): TaskDefinition | null => {
    const originalTask = tasks.find(task => task.id === taskId);
    if (!originalTask) return null;

    return createTask(
      newName || `${originalTask.name} (コピー)`,
      originalTask.teamId,
      originalTask.estimatedMinutes,
      originalTask.frequency,
      originalTask.description,
      originalTask.tags
    );
  }, [tasks, createTask]);

  // IDで作業を取得
  const getTaskById = useCallback((taskId: string): TaskDefinition | undefined => {
    return tasks.find(task => task.id === taskId);
  }, [tasks]);

  // チームIDで作業一覧を取得
  const getTasksByTeamId = useCallback((teamId: string): TaskDefinition[] => {
    return tasks.filter(task => task.teamId === teamId);
  }, [tasks]);

  // アクティブな作業のみを取得
  const getActiveTasks = useCallback((teamId?: string): TaskDefinition[] => {
    const activeTasks = tasks.filter(task => task.isActive);
    return teamId ? activeTasks.filter(task => task.teamId === teamId) : activeTasks;
  }, [tasks]);

  // タグで作業を検索
  const getTasksByTag = useCallback((tag: string): TaskDefinition[] => {
    return tasks.filter(task => task.tags?.includes(tag));
  }, [tasks]);

  // 作業の統計情報を取得
  const getTaskStats = useCallback((teamId?: string) => {
    const targetTasks = teamId ? getTasksByTeamId(teamId) : tasks;
    const activeTasks = targetTasks.filter(task => task.isActive);
    
    // 頻度別統計
    const frequencyStats = activeTasks.reduce((acc, task) => {
      const type = task.frequency.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 総見積時間
    const totalEstimatedMinutes = activeTasks.reduce((sum, task) => sum + task.estimatedMinutes, 0);

    // タグ別統計
    const tagStats = activeTasks.reduce((acc, task) => {
      if (task.tags) {
        task.tags.forEach(tag => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTasks: targetTasks.length,
      activeTasks: activeTasks.length,
      inactiveTasks: targetTasks.length - activeTasks.length,
      totalEstimatedMinutes,
      totalEstimatedHours: totalEstimatedMinutes / 60,
      frequencyStats,
      tagStats,
      allTags: Object.keys(tagStats),
    };
  }, [tasks, getTasksByTeamId]);

  // 作業の年間実行回数を計算
  const calculateAnnualExecutions = useCallback((frequency: TaskFrequency): number => {
    switch (frequency.type) {
      case 'once':
        return 1;
      case 'daily':
        return 365 / (frequency.interval || 1);
      case 'weekly':
        const weeklyInterval = frequency.interval || 1;
        const daysInWeek = frequency.daysOfWeek?.length || 1;
        return (52 / weeklyInterval) * daysInWeek;
      case 'monthly':
        return 12 / (frequency.interval || 1);
      case 'yearly':
        return 1 / (frequency.interval || 1);
      default:
        return 0;
    }
  }, []);

  // 作業の頻度説明を取得
  const getFrequencyDescription = useCallback((frequency: TaskFrequency): string => {
    const interval = frequency.interval || 1;
    
    switch (frequency.type) {
      case 'once':
        return '1回のみ';
      case 'daily':
        return interval === 1 ? '毎日' : `${interval}日に1回`;
      case 'weekly':
        if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
          const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
          const days = frequency.daysOfWeek.map(day => dayNames[day]).join('・');
          const weekText = interval === 1 ? '' : `${interval}週間毎の`;
          return `${weekText}${days}曜日`;
        }
        return interval === 1 ? '毎週' : `${interval}週に1回`;
      case 'monthly':
        const dayText = frequency.dayOfMonth ? `${frequency.dayOfMonth}日` : '';
        return interval === 1 ? `毎月${dayText}` : `${interval}ヶ月に1回${dayText}`;
      case 'yearly':
        const monthText = frequency.monthOfYear ? `${frequency.monthOfYear}月` : '';
        const dayInMonthText = frequency.dayOfMonth ? `${frequency.dayOfMonth}日` : '';
        return interval === 1 ? `毎年${monthText}${dayInMonthText}` : `${interval}年に1回${monthText}${dayInMonthText}`;
      default:
        return '不明';
    }
  }, []);

  return {
    // State
    tasks,
    isLoading,
    
    // Actions
    createTask,
    updateTask,
    deleteTask,
    toggleTaskActive,
    duplicateTask,
    
    // Getters
    getTaskById,
    getTasksByTeamId,
    getActiveTasks,
    getTasksByTag,
    getTaskStats,
    
    // Utility functions
    calculateAnnualExecutions,
    getFrequencyDescription,
  };
};