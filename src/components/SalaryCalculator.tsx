import React from 'react';
import { Box, Paper } from '@mui/material';
import type { SalaryCalculationData } from '../types';
import BasicInputForm from './BasicInputForm';
import OptionsForm from './OptionsForm';
import ResultDisplay from './ResultDisplay';
import { calculateHourlyWage } from '../utils/calculations';

interface SalaryCalculatorProps {
  data: SalaryCalculationData;
  onChange: (data: SalaryCalculationData) => void;
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({ data, onChange }) => {
  const result = calculateHourlyWage(data);

  return (
    <Box>
      {/* 計算結果を上部に固定表示 */}
      <Paper 
        elevation={4} 
        sx={{ 
          p: 2,
          mb: 3,
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          position: 'sticky',
          top: 90,
          zIndex: 999
        }}
      >
        <ResultDisplay result={result} />
      </Paper>

      {/* 入力フォーム */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3 }}>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <BasicInputForm data={data} onChange={onChange} />
          </Paper>
        </Box>
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <OptionsForm data={data} onChange={onChange} />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SalaryCalculator;