import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import type { Position, SalaryData } from '../../types/teamCost';

interface SalaryManagerProps {
  positions: Position[];
  salaryData: SalaryData;
  onChange: (salaryData: SalaryData) => void;
}

export const SalaryManager: React.FC<SalaryManagerProps> = ({ 
  positions, 
  salaryData, 
  onChange 
}) => {
  const [localSalaryData, setLocalSalaryData] = useState<SalaryData>(salaryData);

  useEffect(() => {
    setLocalSalaryData(salaryData);
  }, [salaryData]);

  const handleTypeChange = (type: SalaryData['type']) => {
    const newData = { ...localSalaryData, type };
    setLocalSalaryData(newData);
    onChange(newData);
  };

  const handleSalaryChange = (positionName: string, amount: number) => {
    const newData = {
      ...localSalaryData,
      positions: {
        ...localSalaryData.positions,
        [positionName]: Math.max(0, amount),
      },
    };
    setLocalSalaryData(newData);
    onChange(newData);
  };

  const getUnitLabel = () => {
    switch (localSalaryData.type) {
      case 'hourly': return '円/時';
      case 'monthly': return '万円/月';
      case 'annual': return '万円/年';
      default: return '';
    }
  };

  const getPlaceholder = () => {
    switch (localSalaryData.type) {
      case 'hourly': return '例: 3000';
      case 'monthly': return '例: 60';
      case 'annual': return '例: 720';
      default: return '';
    }
  };

  const convertToAnnual = (positionName: string): number => {
    const amount = localSalaryData.positions[positionName] || 0;
    switch (localSalaryData.type) {
      case 'hourly': return amount * 8 * 250; // 時給 × 8時間 × 250日
      case 'monthly': return amount * 10000 * 12; // 万円/月 → 円/年
      case 'annual': return amount * 10000; // 万円/年 → 円/年
      default: return 0;
    }
  };

  const getHourlyRate = (positionName: string): number => {
    const annual = convertToAnnual(positionName);
    return annual / (8 * 250); // 年収 ÷ (8時間 × 250日)
  };

  const positionNames = positions.map(p => p.name);
  const hasMissingPositions = positionNames.some(name => 
    !(name in localSalaryData.positions) || localSalaryData.positions[name] === 0
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AttachMoneyIcon sx={{ mr: 1 }} />
          給与設定
        </Typography>

        {positions.length === 0 ? (
          <Alert severity="info">
            まず「メンバー構成」で役職を設定してください。
          </Alert>
        ) : (
          <Box>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>給与形式</InputLabel>
              <Select
                value={localSalaryData.type}
                label="給与形式"
                onChange={(e) => handleTypeChange(e.target.value as SalaryData['type'])}
              >
                <MenuItem value="monthly">月収</MenuItem>
                <MenuItem value="annual">年収</MenuItem>
                <MenuItem value="hourly">時給</MenuItem>
              </Select>
            </FormControl>

            {hasMissingPositions && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                すべての役職の給与を設定してください。
              </Alert>
            )}

            <Grid container spacing={2}>
              {positionNames.map((positionName) => {
                const currentAmount = localSalaryData.positions[positionName] || 0;
                const annualSalary = convertToAnnual(positionName);
                const hourlyRate = getHourlyRate(positionName);
                
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={positionName}>
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderColor: currentAmount > 0 ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        backgroundColor: currentAmount > 0 ? 'primary.50' : 'transparent',
                      }}
                    >
                      <Typography variant="subtitle2" gutterBottom>
                        {positionName}
                      </Typography>
                      
                      <TextField
                        type="number"
                        value={currentAmount}
                        onChange={(e) => handleSalaryChange(positionName, parseFloat(e.target.value) || 0)}
                        fullWidth
                        size="small"
                        placeholder={getPlaceholder()}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {getUnitLabel()}
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{ min: 0 }}
                        sx={{ mb: 1 }}
                      />

                      {currentAmount > 0 && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" color="text.secondary" display="block">
                            年収: {annualSalary.toLocaleString()}円
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            時給: {Math.round(hourlyRate).toLocaleString()}円
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>

            <Box sx={{ mt: 2, p: 2, backgroundColor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                💡 給与設定のヒント:
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                • 月収: 手取りではなく総支給額を入力してください
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                • 年収: ボーナス込みの総額を入力してください  
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                • 時給: 実際の時間単価を入力してください
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};