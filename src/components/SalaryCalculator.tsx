import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import type { SalaryCalculationData, CalculationResult } from '../types';
import BasicInputForm from './BasicInputForm';
import OptionsForm from './OptionsForm';
import ResultDisplay from './ResultDisplay';
import DynamicHolidaySettings from './DynamicHolidaySettings';
import { calculateHourlyWage } from '../utils/calculations';
import { calculateHourlyWageWithDynamicHolidays } from '../utils/dynamicHolidayCalculations';

interface SalaryCalculatorProps {
  data: SalaryCalculationData;
  onChange: (data: SalaryCalculationData) => void;
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = ({ data, onChange }) => {
  const [result, setResult] = useState<CalculationResult>(() => calculateHourlyWage(data));
  const [useDynamicHolidays, setUseDynamicHolidays] = useState(true);

  useEffect(() => {
    const updateResult = async () => {
      try {
        if (useDynamicHolidays) {
          const dynamicResult = await calculateHourlyWageWithDynamicHolidays(data, { 
            useCurrentYear: true 
          });
          setResult(dynamicResult);
        } else {
          const fallbackResult = calculateHourlyWage(data);
          setResult(fallbackResult);
        }
      } catch (error) {
        console.warn('動的祝日計算に失敗しました。フォールバック計算を使用します:', error);
        const fallbackResult = calculateHourlyWage(data);
        setResult(fallbackResult);
        setUseDynamicHolidays(false);
      }
    };

    updateResult();
  }, [data, useDynamicHolidays]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* 計算結果を上部に固定表示 */}
      <Paper 
        elevation={4} 
        sx={{ 
          p: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          borderRadius: 2,
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          position: 'sticky',
          top: { xs: 70, sm: 90 },
          zIndex: 999,
          mx: { xs: 0, sm: 'auto' },
        }}
      >
        <ResultDisplay result={result} />
      </Paper>

      {/* 入力フォーム */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { 
            xs: 'column', 
            lg: 'row',
            '@media (max-height: 600px) and (orientation: landscape) and (min-width: 768px)': 'row'
          }, 
          gap: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        <Box sx={{ flex: 1, width: '100%' }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2, 
              mb: { xs: 2, sm: 3 },
              width: '100%',
            }}
          >
            <BasicInputForm data={data} onChange={onChange} />
          </Paper>
        </Box>
        <Box sx={{ flex: 1, width: '100%' }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 2, sm: 3 }, 
              borderRadius: 2, 
              mb: { xs: 2, sm: 2 },
              width: '100%',
            }}
          >
            <OptionsForm data={data} onChange={onChange} />
          </Paper>
          <DynamicHolidaySettings data={data} onChange={onChange} />
        </Box>
      </Box>
    </Box>
  );
};

export default SalaryCalculator;