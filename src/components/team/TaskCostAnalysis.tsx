import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Stack,
  Divider,
  Button,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useTeamManagement } from '../../hooks/useTeamManagement';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import { useTeamAnalysis } from '../../hooks/useTeamAnalysis';
import type { CostCalculationMethod } from '../../types';

interface TaskCostAnalysisProps {
  teamId: string;
}

export const TaskCostAnalysis: React.FC<TaskCostAnalysisProps> = ({ teamId }) => {
  const { getTeamById } = useTeamManagement();
  const { getTasksByTeam } = useTaskManagement();
  const { calculateTaskCost, getTeamTaskOverview } = useTeamAnalysis();

  const [calculationMethod, setCalculationMethod] = useState<CostCalculationMethod>('average');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'frequency' | 'time'>('cost');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const team = getTeamById(teamId);
  const tasks = getTasksByTeam(teamId).filter(task => task.isActive);

  const taskAnalyses = useMemo(() => {
    if (!team || tasks.length === 0) return [];

    return tasks.map(task => {
      const analysis = calculateTaskCost(task.id, calculationMethod);
      return {
        task,
        analysis,
      };
    });
  }, [team, tasks, calculateTaskCost, calculationMethod]);

  const filteredAndSortedTasks = useMemo(() => {
    let filtered = taskAnalyses.filter(({ task }) =>
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.task.name.localeCompare(b.task.name);
          break;
        case 'cost':
          comparison = a.analysis.annualTotalCost - b.analysis.annualTotalCost;
          break;
        case 'frequency':
          comparison = a.analysis.annualExecutionCount - b.analysis.annualExecutionCount;
          break;
        case 'time':
          comparison = a.task.estimatedMinutes - b.task.estimatedMinutes;
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [taskAnalyses, searchTerm, sortBy, sortOrder]);

  const teamOverview = useMemo(() => {
    if (!team || tasks.length === 0) return null;
    return getTeamTaskOverview(teamId, calculationMethod);
  }, [team, tasks, getTeamTaskOverview, teamId, calculationMethod]);

  if (!team) {
    return (
      <Alert severity="error">
        チームが見つかりません
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <Alert severity="info">
        アクティブな作業が登録されていません。作業を追加してからコスト分析を実行してください。
      </Alert>
    );
  }

  const formatFrequency = (frequency: any): string => {
    switch (frequency.type) {
      case 'once':
        return '一回のみ';
      case 'daily':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}日ごと` 
          : '毎日';
      case 'weekly':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}週間ごと` 
          : '毎週';
      case 'monthly':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}ヶ月ごと` 
          : '毎月';
      case 'yearly':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}年ごと` 
          : '毎年';
      default:
        return '不明';
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes === 0 
        ? `${hours}時間` 
        : `${hours}時間${remainingMinutes}分`;
    }
  };

  const getFrequencyColor = (frequency: any) => {
    switch (frequency.type) {
      case 'daily': return 'error';
      case 'weekly': return 'warning';
      case 'monthly': return 'info';
      case 'yearly': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {team.name} - 作業コスト分析
        </Typography>
        <Typography variant="body2" color="text.secondary">
          作業別のコスト分析と効率性レポート
        </Typography>
      </Box>

      {/* Overview Cards */}
      {teamOverview && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  総作業数
                </Typography>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AssignmentIcon sx={{ mr: 1 }} />
                  {teamOverview.totalTasks}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  年間総コスト
                </Typography>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyIcon sx={{ mr: 1 }} />
                  ¥{Math.round(teamOverview.totalAnnualCost).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  年間労働時間
                </Typography>
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimerIcon sx={{ mr: 1 }} />
                  {Math.round(teamOverview.totalAnnualHours).toLocaleString()}h
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  最高コスト作業
                </Typography>
                <Typography variant="h6">
                  {teamOverview.highestCostTask?.taskName || 'なし'}
                </Typography>
                {teamOverview.highestCostTask && (
                  <Typography variant="body2" color="text.secondary">
                    ¥{Math.round(teamOverview.highestCostTask.annualTotalCost).toLocaleString()}/年
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Controls */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>計算方法</InputLabel>
              <Select
                value={calculationMethod}
                label="計算方法"
                onChange={(e) => setCalculationMethod(e.target.value as CostCalculationMethod)}
              >
                <MenuItem value="average">平均コスト</MenuItem>
                <MenuItem value="individual">個別積算</MenuItem>
                <MenuItem value="byRole">役割別</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              size="small"
              placeholder="作業を検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>並び替え</InputLabel>
              <Select
                value={sortBy}
                label="並び替え"
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <MenuItem value="name">作業名</MenuItem>
                <MenuItem value="cost">コスト</MenuItem>
                <MenuItem value="frequency">実行頻度</MenuItem>
                <MenuItem value="time">見積時間</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>順序</InputLabel>
              <Select
                value={sortOrder}
                label="順序"
                onChange={(e) => setSortOrder(e.target.value as any)}
              >
                <MenuItem value="desc">降順</MenuItem>
                <MenuItem value="asc">昇順</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Results Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>作業名</TableCell>
              <TableCell>頻度</TableCell>
              <TableCell align="right">見積時間</TableCell>
              <TableCell align="right">1回実行コスト</TableCell>
              <TableCell align="right">年間実行回数</TableCell>
              <TableCell align="right">年間総コスト</TableCell>
              <TableCell align="right">コスト/分</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTasks.map(({ task, analysis }) => (
              <TableRow key={task.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body1" fontWeight="medium">
                      {task.name}
                    </Typography>
                    {task.description && (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {task.description}
                      </Typography>
                    )}
                    {task.tags && task.tags.length > 0 && (
                      <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                        {task.tags.slice(0, 2).map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {task.tags.length > 2 && (
                          <Chip
                            label={`+${task.tags.length - 2}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={formatFrequency(task.frequency)}
                    size="small"
                    color={getFrequencyColor(task.frequency) as any}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  {formatTime(task.estimatedMinutes)}
                </TableCell>
                <TableCell align="right">
                  ¥{Math.round(analysis.singleExecutionCost).toLocaleString()}
                </TableCell>
                <TableCell align="right">
                  {analysis.annualExecutionCount.toLocaleString()}回
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body1" fontWeight="medium">
                    ¥{Math.round(analysis.annualTotalCost).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  ¥{Math.round(analysis.costPerMinute).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredAndSortedTasks.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          検索条件に一致する作業が見つかりません。
        </Alert>
      )}

      {/* Analysis Summary */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1 }} />
            分析サマリー
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                コスト効率の観点
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 高頻度・長時間の作業は自動化を検討<br />
                • 低頻度・高コストの作業は外注を検討<br />
                • コスト/分が高い作業は効率化の優先度高
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                リソース配分の観点
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 年間総コストの80%を占める作業に注目<br />
                • 役割別の負荷バランスを確認<br />
                • 季節性のある作業は計画的にリソース配分
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};