import React from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  Typography,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import type { SalaryCalculationData } from '../types';

interface YearSelectorProps {
  data: SalaryCalculationData;
  onChange: (data: SalaryCalculationData) => void;
}

const YearSelector: React.FC<YearSelectorProps> = ({ data, onChange }) => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentFiscalYear = currentMonth >= 4 ? currentYear : currentYear - 1;
  
  const availableYears = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleYearTypeChange = (_event: React.MouseEvent<HTMLElement>, newYearType: 'calendar' | 'fiscal' | null) => {
    if (newYearType !== null) {
      const defaultYear = newYearType === 'fiscal' ? currentFiscalYear : currentYear;
      onChange({
        ...data,
        holidayYearType: newYearType,
        holidayYear: defaultYear
      });
    }
  };

  const handleYearChange = (event: { target: { value: unknown } }) => {
    onChange({
      ...data,
      holidayYear: Number(event.target.value)
    });
  };

  if (!data.useDynamicHolidays) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
      <Typography variant="caption" color="text.secondary">
        基準:
      </Typography>
      
      <ToggleButtonGroup
        value={data.holidayYearType ?? 'calendar'}
        exclusive
        onChange={handleYearTypeChange}
        size="small"
        sx={{ height: 24 }}
      >
        <ToggleButton value="calendar" sx={{ px: 1, py: 0.5, fontSize: '0.75rem' }}>
          年
        </ToggleButton>
        <ToggleButton value="fiscal" sx={{ px: 1, py: 0.5, fontSize: '0.75rem' }}>
          年度
        </ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 80 }}>
        <Select
          value={data.holidayYear ?? (data.holidayYearType === 'fiscal' ? currentFiscalYear : currentYear)}
          onChange={handleYearChange}
          sx={{ height: 24, fontSize: '0.75rem' }}
        >
          {availableYears.map((year) => (
            <MenuItem key={year} value={year} sx={{ fontSize: '0.75rem' }}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default YearSelector;