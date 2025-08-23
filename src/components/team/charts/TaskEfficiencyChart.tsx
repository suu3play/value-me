import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Grid,
} from '@mui/material';
import { useTaskManagement } from '../../../hooks/useTaskManagement';
import { useTeamAnalysis } from '../../../hooks/useTeamAnalysis';

interface TaskEfficiencyChartProps {
  teamId: string;
}

export const TaskEfficiencyChart: React.FC<TaskEfficiencyChartProps> = ({ teamId }) => {
  const { getTasksByTeam } = useTaskManagement();
  const { calculateTaskCost } = useTeamAnalysis();

  const tasks = getTasksByTeam(teamId).filter(task => task.isActive);
  
  const taskEfficiencyData = tasks.map(task => {
    const analysis = calculateTaskCost(task.id, 'average');
    return {
      task,
      analysis,
      efficiency: analysis.costPerMinute,
    };
  }).sort((a, b) => b.efficiency - a.efficiency);

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

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          作業効率分析チャート
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          チャート機能は今後のバージョンで実装予定です。
          現在は効率性データを表示しています。
        </Alert>

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            効率性ランキング（コスト/分 降順）
          </Typography>
          
          <Grid container spacing={1}>
            {taskEfficiencyData.slice(0, 10).map(({ task, analysis, efficiency }, index) => (
              <Grid item xs={12} key={task.id}>
                <Box sx={{ 
                  p: 1, 
                  border: 1, 
                  borderColor: 'divider', 
                  borderRadius: 1,
                  backgroundColor: index < 3 ? 'action.hover' : 'transparent'
                }}>
                  <Typography variant="body2" fontWeight="medium">
                    {index + 1}. {task.name}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatTime(task.estimatedMinutes)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ¥{Math.round(efficiency).toLocaleString()}/分
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      年間: ¥{Math.round(analysis.annualTotalCost).toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          将来の拡張：散布図、ヒートマップ、時系列分析チャートを実装予定
        </Typography>
      </CardContent>
    </Card>
  );
};