import React, { useState, useEffect } from 'react';
import { Box, Paper } from '@mui/material';
import type { SalaryCalculationData, CalculationResult } from '../types';
import BasicInputForm from './BasicInputForm';
import OptionsForm from './OptionsForm';
import DynamicHolidaySettings from './DynamicHolidaySettings';
import { calculateHourlyWage } from '../utils/calculations';
import { calculateHourlyWageWithDynamicHolidays } from '../utils/dynamicHolidayCalculations';

interface SalaryCalculatorProps {
  data: SalaryCalculationData;
  onChange: (data: SalaryCalculationData) => void;
  onResultChange: (result: CalculationResult) => void;
  hideDynamicHolidaySettings?: boolean;
  layout?: 'horizontal' | 'vertical';
}

const SalaryCalculator: React.FC<SalaryCalculatorProps> = React.memo(({ data, onChange, onResultChange, hideDynamicHolidaySettings = false, layout = 'vertical' }) => {
  const [useDynamicHolidays, setUseDynamicHolidays] = useState(true);

  useEffect(() => {
    const updateResult = async () => {
      try {
        let newResult: CalculationResult;
        if (useDynamicHolidays) {
          newResult = await calculateHourlyWageWithDynamicHolidays(data, {
            useCurrentYear: true
          });
        } else {
          newResult = calculateHourlyWage(data);
        }

        onResultChange(newResult);
      } catch (error) {
        console.warn('動的祝日計算に失敗しました。フォールバック計算を使用します:', error);
        const fallbackResult = calculateHourlyWage(data);
        onResultChange(fallbackResult);
        setUseDynamicHolidays(false);
      }
    };

    updateResult();
  }, [data, useDynamicHolidays, onResultChange]);

  return (
    <Box sx={{ width: '100%' }}>
      {/* 入力フォーム */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: layout === 'horizontal' ? {
            xs: 'column',
            lg: 'row',
            '@media (maxHeight: 600px) and (orientation: landscape) and (minWidth: 768px)': 'row'
          } : 'column',
          gap: { xs: 2, sm: 3 },
          width: '100%',
        }}
      >
        {layout === 'horizontal' ? (
          <>
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
              {!hideDynamicHolidaySettings && (
                <DynamicHolidaySettings data={data} onChange={onChange} />
              )}
            </Box>
          </>
        ) : (
          <>
            <Paper 
              elevation={2} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2, 
                width: '100%',
              }}
            >
              <BasicInputForm data={data} onChange={onChange} />
            </Paper>
            
            <Paper 
              elevation={2} 
              sx={{ 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 2, 
                width: '100%',
              }}
            >
              <OptionsForm data={data} onChange={onChange} />
            </Paper>
            
            {!hideDynamicHolidaySettings && (
              <DynamicHolidaySettings data={data} onChange={onChange} />
            )}
          </>
        )}
      </Box>
    </Box>
  );
});

export default SalaryCalculator;