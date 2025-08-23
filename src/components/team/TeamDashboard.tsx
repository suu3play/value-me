import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  Alert,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useTeamManagement } from '../../hooks/useTeamManagement';
import { useTeamAnalysis } from '../../hooks/useTeamAnalysis';

interface TeamDashboardProps {
  onNavigate: (section: 'teams' | 'tasks' | 'analysis') => void;
}

export const TeamDashboard: React.FC<TeamDashboardProps> = ({ onNavigate }) => {
  const {
    teams,
    currentTeam,
    setCurrentTeam,
    getTeamStats,
  } = useTeamManagement();

  const {
    calculateTeamCost,
  } = useTeamAnalysis();

  const handleTeamChange = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    if (team) {
      setCurrentTeam(team);
    }
  };

  const teamStats = currentTeam ? getTeamStats(currentTeam.id) : null;
  const teamCost = currentTeam ? calculateTeamCost(currentTeam.id, 'average') : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          チーム管理ダッシュボード
        </Typography>
        
        {/* Team Selection */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <FormControl sx={{ minWidth: 300 }}>
            <InputLabel>チーム選択</InputLabel>
            <Select
              value={currentTeam?.id || ''}
              label="チーム選択"
              onChange={(e) => handleTeamChange(e.target.value)}
            >
              {teams.map((team) => (
                <MenuItem key={team.id} value={team.id}>
                  {team.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => onNavigate('teams')}
          >
            新規チーム作成
          </Button>
        </Box>

        {!currentTeam && teams.length === 0 && (
          <Alert severity="info" sx={{ mb: 3 }}>
            チームが作成されていません。まずはチームを作成してください。
          </Alert>
        )}

        {!currentTeam && teams.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            チームを選択してください。
          </Alert>
        )}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          クイックアクション
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            startIcon={<PeopleIcon />}
            onClick={() => onNavigate('teams')}
            size="large"
          >
            チーム管理
          </Button>
          <Button
            variant="contained"
            startIcon={<AssignmentIcon />}
            onClick={() => onNavigate('tasks')}
            size="large"
            disabled={!currentTeam}
          >
            作業管理
          </Button>
          <Button
            variant="contained"
            startIcon={<TrendingUpIcon />}
            onClick={() => onNavigate('analysis')}
            size="large"
            disabled={!currentTeam}
          >
            分析・レポート
          </Button>
        </Stack>
      </Box>

      {/* Main Metrics */}
      {currentTeam && (
        <Grid container spacing={3}>
          {/* Team Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">
                    {currentTeam.name}
                  </Typography>
                  <IconButton size="small" onClick={() => onNavigate('teams')}>
                    <SettingsIcon />
                  </IconButton>
                </Box>
                
                {currentTeam.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {currentTeam.description}
                  </Typography>
                )}

                {teamStats && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          総メンバー数
                        </Typography>
                        <Typography variant="h5">
                          {teamStats.totalMembers}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          アクティブ
                        </Typography>
                        <Typography variant="h5" color="primary">
                          {teamStats.activeMemberCount}
                        </Typography>
                      </Grid>
                    </Grid>

                    {teamStats.roles.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          役割
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {teamStats.roles.map((role) => (
                            <Chip
                              key={role}
                              label={`${role} (${teamStats.roleStats[role]})`}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Cost Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  コスト概要
                </Typography>
                
                {teamCost ? (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          時間単価（平均）
                        </Typography>
                        <Typography variant="h5">
                          ¥{teamCost.totalHourlyCost.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          月額コスト
                        </Typography>
                        <Typography variant="h6">
                          ¥{teamCost.totalMonthlyCost.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          年額コスト
                        </Typography>
                        <Typography variant="h6">
                          ¥{teamCost.totalAnnualCost.toLocaleString()}
                        </Typography>
                      </Grid>
                    </Grid>

                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mt: 2 }}
                      onClick={() => onNavigate('analysis')}
                    >
                      詳細分析を見る
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    アクティブなメンバーがいません
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  最近の更新
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  最終更新: {new Date(currentTeam.updatedAt).toLocaleString('ja-JP')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  作成日: {new Date(currentTeam.createdAt).toLocaleString('ja-JP')}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};