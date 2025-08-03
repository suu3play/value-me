import React from 'react';
import { Typography, Box, Divider } from '@mui/material';
import type { CalculationResult } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculations';

interface ResultDisplayProps {
  result: CalculationResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
      {/* 時給表示 */}
      <Box sx={{ textAlign: 'center', minWidth: 200 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
          あなたの時給
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
          {formatCurrency(result.hourlyWage)}
        </Typography>
        <Typography variant="body2">
          / 時間
        </Typography>
      </Box>

      <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }} />

      {/* 内訳 */}
      <Box sx={{ flex: 1, minWidth: 300 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
          内訳
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ minWidth: 120 }}>
            <Typography variant="caption">実質年収</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(result.actualAnnualIncome)}
            </Typography>
          </Box>
          
          <Box sx={{ minWidth: 120 }}>
            <Typography variant="caption">実質月収</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formatCurrency(result.actualMonthlyIncome)}
            </Typography>
          </Box>
          
          <Box sx={{ minWidth: 120 }}>
            <Typography variant="caption">年間労働時間</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formatNumber(result.totalWorkingHours)}時間
            </Typography>
          </Box>
          
          <Box sx={{ minWidth: 100 }}>
            <Typography variant="caption">年間休日</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {formatNumber(result.totalAnnualHolidays)}日
            </Typography>
          </Box>
        </Box>
      </Box>

      {result.hourlyWage === 0 && (
        <Box sx={{ ml: 'auto', p: 1.5, bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 1 }}>
          <Typography variant="body2">
            給与額と労働時間を入力してください
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ResultDisplay;