import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { useTeamManagement } from '../../hooks/useTeamManagement';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import { useTeamAnalysis } from '../../hooks/useTeamAnalysis';

interface WorkCostDashboardProps {
  onNavigate: (section: 'members' | 'tasks' | 'analysis') => void;
}

export const WorkCostDashboard: React.FC<WorkCostDashboardProps> = ({ onNavigate }) => {
  const { teams, currentTeam } = useTeamManagement();
  const { getTasksByTeam } = useTaskManagement();
  const { getTeamTaskOverview } = useTeamAnalysis();

  // 簡単のため、最初のチームを自動選択（またはデフォルトチームを作成）
  const workTeam = teams.length > 0 ? teams[0] : null;
  const activeTasks = workTeam ? getTasksByTeam(workTeam.id).filter(task => task.isActive) : [];
  const activeMembers = workTeam ? workTeam.members.filter(member => member.isActive) : [];
  
  const overview = workTeam && activeTasks.length > 0 && activeMembers.length > 0 
    ? getTeamTaskOverview(workTeam.id, 'average') 
    : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          作業コスト計算
        </Typography>
        <Typography variant="body1" color="text.secondary">
          メンバーの給与情報と作業時間から、作業コストを自動計算します
        </Typography>
      </Box>

      {/* Quick Setup Guide */}
      {(!workTeam || activeMembers.length === 0 || activeTasks.length === 0) && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            はじめに以下を設定してください：
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
            {activeMembers.length === 0 && (
              <Chip 
                label="1. メンバー追加" 
                icon={<PeopleIcon />} 
                variant="outlined"
                onClick={() => onNavigate('members')}
                clickable
              />
            )}
            {activeTasks.length === 0 && (
              <Chip 
                label="2. 作業登録" 
                icon={<AssignmentIcon />} 
                variant="outlined"
                onClick={() => onNavigate('tasks')}
                clickable
              />
            )}
          </Stack>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                クイックアクション
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  startIcon={<PeopleIcon />}
                  onClick={() => onNavigate('members')}
                  size="large"
                >
                  メンバー管理
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AssignmentIcon />}
                  onClick={() => onNavigate('tasks')}
                  size="large"
                >
                  作業管理
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CalculateIcon />}
                  onClick={() => onNavigate('analysis')}
                  size="large"
                  disabled={!overview}
                >
                  コスト分析
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Status */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                登録状況
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  メンバー: {activeMembers.length} 名
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="body1">
                  作業: {activeTasks.length} 件
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Cost Overview */}
        {overview && (
          <>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    年間総コスト
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ¥{Math.round(overview.totalAnnualCost).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(overview.totalAnnualHours).toLocaleString()} 時間/年
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    最もコストの高い作業
                  </Typography>
                  {overview.highestCostTask ? (
                    <>
                      <Typography variant="body1" fontWeight="medium">
                        {overview.highestCostTask.taskName}
                      </Typography>
                      <Typography variant="h6" color="error">
                        ¥{Math.round(overview.highestCostTask.annualTotalCost).toLocaleString()}/年
                      </Typography>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      データなし
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Recent Activity or Next Steps */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {overview ? '詳細分析' : '次のステップ'}
              </Typography>
              
              {overview ? (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    詳細なコスト分析とレポートは「コスト分析」ページで確認できます。
                  </Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => onNavigate('analysis')}
                  >
                    詳細分析を見る
                  </Button>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    コスト計算を開始するには、まずメンバーと作業を登録してください。
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="outlined" 
                      startIcon={<PeopleIcon />}
                      onClick={() => onNavigate('members')}
                    >
                      メンバー追加
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<AssignmentIcon />}
                      onClick={() => onNavigate('tasks')}
                    >
                      作業登録
                    </Button>
                  </Stack>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};