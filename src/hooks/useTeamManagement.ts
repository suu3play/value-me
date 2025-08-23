import { useState, useEffect, useCallback } from 'react';
import type { Team, TeamMember, SalaryCalculationData } from '../types';

const STORAGE_KEY = 'value-me-teams';

export const useTeamManagement = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // ローカルストレージからチーム情報を読み込み
  useEffect(() => {
    const loadTeams = () => {
      try {
        const storedTeams = localStorage.getItem(STORAGE_KEY);
        if (storedTeams) {
          const parsedTeams = JSON.parse(storedTeams);
          setTeams(parsedTeams);
        }
      } catch (error) {
        console.error('チーム情報の読み込みに失敗しました:', error);
      }
    };

    loadTeams();
  }, []);

  // ローカルストレージにチーム情報を保存
  const saveTeams = useCallback((teamsData: Team[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teamsData));
      setTeams(teamsData);
    } catch (error) {
      console.error('チーム情報の保存に失敗しました:', error);
    }
  }, []);

  // 新しいチームを作成
  const createTeam = useCallback((name: string, description?: string): Team => {
    const newTeam: Team = {
      id: `team_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      description,
      members: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedTeams = [...teams, newTeam];
    saveTeams(updatedTeams);
    return newTeam;
  }, [teams, saveTeams]);

  // チーム情報を更新
  const updateTeam = useCallback((teamId: string, updates: Partial<Omit<Team, 'id' | 'createdAt'>>) => {
    const updatedTeams = teams.map(team =>
      team.id === teamId
        ? { ...team, ...updates, updatedAt: new Date().toISOString() }
        : team
    );
    saveTeams(updatedTeams);
  }, [teams, saveTeams]);

  // チームを削除
  const deleteTeam = useCallback((teamId: string) => {
    const updatedTeams = teams.filter(team => team.id !== teamId);
    saveTeams(updatedTeams);
    
    // 現在選択中のチームが削除された場合はクリア
    if (currentTeam?.id === teamId) {
      setCurrentTeam(null);
    }
  }, [teams, currentTeam, saveTeams]);

  // チームメンバーを追加
  const addTeamMember = useCallback((
    teamId: string,
    name: string,
    role: string,
    salaryData: SalaryCalculationData,
    notes?: string
  ): TeamMember => {
    const newMember: TeamMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      role,
      salaryData,
      isActive: true,
      joinDate: new Date().toISOString(),
      notes,
    };

    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: [...team.members, newMember],
          updatedAt: new Date().toISOString(),
        };
      }
      return team;
    });

    saveTeams(updatedTeams);
    
    // 現在のチームが更新された場合は同期
    if (currentTeam?.id === teamId) {
      const updatedCurrentTeam = updatedTeams.find(team => team.id === teamId);
      if (updatedCurrentTeam) {
        setCurrentTeam(updatedCurrentTeam);
      }
    }

    return newMember;
  }, [teams, currentTeam, saveTeams]);

  // チームメンバーを更新
  const updateTeamMember = useCallback((
    teamId: string,
    memberId: string,
    updates: Partial<Omit<TeamMember, 'id' | 'joinDate'>>
  ) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.map(member =>
            member.id === memberId ? { ...member, ...updates } : member
          ),
          updatedAt: new Date().toISOString(),
        };
      }
      return team;
    });

    saveTeams(updatedTeams);
    
    // 現在のチームが更新された場合は同期
    if (currentTeam?.id === teamId) {
      const updatedCurrentTeam = updatedTeams.find(team => team.id === teamId);
      if (updatedCurrentTeam) {
        setCurrentTeam(updatedCurrentTeam);
      }
    }
  }, [teams, currentTeam, saveTeams]);

  // チームメンバーを削除
  const removeTeamMember = useCallback((teamId: string, memberId: string) => {
    const updatedTeams = teams.map(team => {
      if (team.id === teamId) {
        return {
          ...team,
          members: team.members.filter(member => member.id !== memberId),
          updatedAt: new Date().toISOString(),
        };
      }
      return team;
    });

    saveTeams(updatedTeams);
    
    // 現在のチームが更新された場合は同期
    if (currentTeam?.id === teamId) {
      const updatedCurrentTeam = updatedTeams.find(team => team.id === teamId);
      if (updatedCurrentTeam) {
        setCurrentTeam(updatedCurrentTeam);
      }
    }
  }, [teams, currentTeam, saveTeams]);

  // チームメンバーのアクティブ状態を切り替え
  const toggleMemberActive = useCallback((teamId: string, memberId: string) => {
    const team = teams.find(t => t.id === teamId);
    const member = team?.members.find(m => m.id === memberId);
    
    if (member) {
      updateTeamMember(teamId, memberId, { isActive: !member.isActive });
    }
  }, [teams, updateTeamMember]);

  // IDでチームを取得
  const getTeamById = useCallback((teamId: string): Team | undefined => {
    return teams.find(team => team.id === teamId);
  }, [teams]);

  // IDでチームメンバーを取得
  const getTeamMemberById = useCallback((teamId: string, memberId: string): TeamMember | undefined => {
    const team = getTeamById(teamId);
    return team?.members.find(member => member.id === memberId);
  }, [getTeamById]);

  // アクティブなチームメンバーのみを取得
  const getActiveMembers = useCallback((teamId: string): TeamMember[] => {
    const team = getTeamById(teamId);
    return team?.members.filter(member => member.isActive) || [];
  }, [getTeamById]);

  // チーム統計情報を取得
  const getTeamStats = useCallback((teamId: string) => {
    const team = getTeamById(teamId);
    if (!team) return null;

    const activeMembers = team.members.filter(member => member.isActive);
    const totalMembers = team.members.length;
    const activeMemberCount = activeMembers.length;
    
    // 役割別の統計
    const roleStats = activeMembers.reduce((acc, member) => {
      acc[member.role] = (acc[member.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalMembers,
      activeMemberCount,
      inactiveMembers: totalMembers - activeMemberCount,
      roleStats,
      roles: Object.keys(roleStats),
    };
  }, [getTeamById]);

  return {
    // State
    teams,
    currentTeam,
    isLoading,
    
    // Actions
    setCurrentTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    toggleMemberActive,
    
    // Getters
    getTeamById,
    getTeamMemberById,
    getActiveMembers,
    getTeamStats,
  };
};