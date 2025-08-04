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
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 2 }}>
            <OptionsForm data={data} onChange={onChange} />
          </Paper>
          <DynamicHolidaySettings data={data} onChange={onChange} />
        </Box>
      </Box>
    </Box>
  );
};

export default SalaryCalculator;