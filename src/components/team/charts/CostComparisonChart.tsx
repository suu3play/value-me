import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
} from '@mui/material';
import { useTeamAnalysis } from '../../../hooks/useTeamAnalysis';
import type { CostCalculationMethod } from '../../../types';

interface CostComparisonChartProps {
  teamId: string;
  methods?: CostCalculationMethod[];
}

export const CostComparisonChart: React.FC<CostComparisonChartProps> = ({ 
  teamId, 
  methods = ['average', 'individual', 'byRole'] 
}) => {
  const { calculateTeamCost } = useTeamAnalysis();

  const chartData = methods.map(method => ({
    method,
    result: calculateTeamCost(teamId, method),
  }));

  const getMethodLabel = (method: CostCalculationMethod): string => {
    switch (method) {
      case 'average': return '平均コスト';
      case 'individual': return '個別積算';
      case 'byRole': return '役割別';
      default: return method;
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          計算方法別コスト比較
        </Typography>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          チャート機能は今後のバージョンで実装予定です。
          現在は数値データを表示しています。
        </Alert>

        <Box sx={{ mt: 2 }}>
          {chartData.map(({ method, result }) => (
            <Box key={method} sx={{ mb: 2, p: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                {getMethodLabel(method)}
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  時間単価: ¥{result.totalHourlyCost.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  年額: ¥{result.totalAnnualCost.toLocaleString()}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Typography variant="caption" color="text.secondary">
          将来の拡張：React Chart.js 2やRechartsを使用したビジュアルチャートを実装予定
        </Typography>
      </CardContent>
    </Card>
  );
};