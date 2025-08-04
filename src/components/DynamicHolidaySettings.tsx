import React from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  Typography
} from '@mui/material';
import type { SalaryCalculationData } from '../types';

interface DynamicHolidaySettingsProps {
  data: SalaryCalculationData;
  onChange: (data: SalaryCalculationData) => void;
}

const DynamicHolidaySettings: React.FC<DynamicHolidaySettingsProps> = ({ data, onChange }) => {
  const handleDynamicHolidaysToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...data,
      useDynamicHolidays: event.target.checked
    });
  };

  return (
    <Box sx={{ p: 1, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, bgcolor: 'grey.50' }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
        祝日計算設定
      </Typography>
      
      <FormControlLabel
        control={
          <Switch
            checked={data.useDynamicHolidays ?? true}
            onChange={handleDynamicHolidaysToggle}
            color="primary"
            size="small"
          />
        }
        label={
          <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
            動的祝日取得（内閣府データ・振替休日対応）
          </Typography>
        }
        sx={{ m: 0 }}
      />
    </Box>
  );
};

export default DynamicHolidaySettings;