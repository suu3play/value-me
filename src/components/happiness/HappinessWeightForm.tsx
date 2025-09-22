import React from 'react';
import {
  Box,
  Typography,
  Slider,
  Paper,
  FormControl,
  FormLabel,
} from '@mui/material';
import type { HappinessWeights } from '../../types/happiness';
import { categoryLabels } from '../../data/happinessQuestions';

interface HappinessWeightFormProps {
  weights: HappinessWeights;
  onChange: (weights: HappinessWeights) => void;
}

export const HappinessWeightForm: React.FC<HappinessWeightFormProps> = ({
  weights,
  onChange,
}) => {
  const handleWeightChange = (category: keyof HappinessWeights, value: number) => {
    const newWeights = {
      ...weights,
      [category]: value,
    };
    onChange(newWeights);
  };

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" component="h3" fontWeight="bold" color="primary.main">
          重み付け設定
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          あなたにとって重要な要素の重みを調整してください（合計: {totalWeight}%）
        </Typography>
      </Box>

      {Object.entries(categoryLabels).map(([categoryId, categoryName]) => {
        const categoryKey = categoryId as keyof HappinessWeights;
        const currentWeight = weights[categoryKey];

        return (
          <Box key={categoryId} sx={{ mb: 3 }}>
            <FormControl component="fieldset" sx={{ width: '100%' }}>
              <FormLabel component="legend" sx={{ mb: 1 }}>
                <Typography variant="body1" fontWeight="medium">
                  {categoryName}: {currentWeight}%
                </Typography>
              </FormLabel>

              <Box sx={{ px: 2 }}>
                <Slider
                  value={currentWeight}
                  onChange={(_, value) => handleWeightChange(categoryKey, value as number)}
                  min={0}
                  max={50}
                  step={5}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 10, label: '10%' },
                    { value: 20, label: '20%' },
                    { value: 30, label: '30%' },
                    { value: 40, label: '40%' },
                    { value: 50, label: '50%' },
                  ]}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  sx={{
                    '& .MuiSlider-markLabel': {
                      fontSize: '0.75rem',
                    },
                  }}
                />
              </Box>
            </FormControl>
          </Box>
        );
      })}

      {totalWeight !== 100 && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            bgcolor: totalWeight > 100 ? 'error.light' : 'warning.light',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" fontWeight="medium">
            {totalWeight > 100
              ? '⚠️ 合計が100%を超えています。調整してください。'
              : '💡 合計を100%にすることをお勧めします。'}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};