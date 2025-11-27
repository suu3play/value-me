import React from 'react';
import {
  Box,
  Typography,
  Slider,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  FormLabel,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { HappinessFactors } from '../../types/happiness';
import { happinessQuestions, additionalQuestions, categoryLabels, categoryDescriptions } from '../../data/happinessQuestions';

interface HappinessFactorFormProps {
  factors: HappinessFactors;
  onChange: (factors: HappinessFactors) => void;
}

const sliderMarks = [
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4' },
  { value: 5, label: '5' },
  { value: 6, label: '6' },
  { value: 7, label: '7' },
  { value: 8, label: '8' },
  { value: 9, label: '9' },
  { value: 10, label: '10' },
];

const getSliderLabel = (value: number): string => {
  const labels = {
    1: '最悪',
    2: 'かなり悪い',
    3: '悪い',
    4: 'やや悪い',
    5: 'やや不満',
    6: 'やや良い',
    7: '良い',
    8: 'かなり良い',
    9: 'とても良い',
    10: '最高！'
  };
  return labels[value as keyof typeof labels] || '';
};

export const HappinessFactorForm: React.FC<HappinessFactorFormProps> = ({
  factors,
  onChange,
}) => {
  const handleFactorChange = (
    category: keyof HappinessFactors,
    factor: string,
    value: number
  ) => {
    const newFactors = {
      ...factors,
      [category]: {
        // eslint-disable-next-line security/detect-object-injection
        ...factors[category],
        [factor]: value,
      },
    };
    onChange(newFactors);
  };

  const renderCategorySection = (
    categoryId: keyof HappinessFactors,
    categoryName: string,
    description: string
  ) => {
    const categoryQuestions = happinessQuestions.filter(q => q.categoryId === categoryId);
    // eslint-disable-next-line security/detect-object-injection
    const categoryFactors = factors[categoryId];

    return (
      <Paper
        key={categoryId}
        elevation={2}
        sx={{
          p: 3,
          mb: 3,
          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" component="h3" fontWeight="bold" color="primary.main">
            {categoryName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        </Box>

        <Box sx={{ space: 4 }}>
          {categoryQuestions.map((question) => {
            const factorKey = question.id.split('-')[1] as keyof typeof categoryFactors;
            // eslint-disable-next-line security/detect-object-injection
            const currentValue = categoryFactors[factorKey] || 5.5;

            return (
              <Box key={question.id} sx={{ mb: 4 }}>
                <FormControl component="fieldset" sx={{ width: '100%' }}>
                  <FormLabel component="legend" sx={{ mb: 2 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {question.displayText}
                    </Typography>
                  </FormLabel>

                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={currentValue}
                      onChange={(_, value) => handleFactorChange(categoryId, factorKey, value as number)}
                      min={1}
                      max={10}
                      step={0.5}
                      marks={sliderMarks}
                      valueLabelDisplay="auto"
                      valueLabelFormat={getSliderLabel}
                      sx={{
                        '& .MuiSlider-markLabel': {
                          fontSize: '0.75rem',
                        },
                        '& .MuiSlider-valueLabel': {
                          fontSize: '0.75rem',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                    <Box sx={{ mt: 1, textAlign: 'center' }}>
                      <Typography variant="body2" color="primary.main" fontWeight="medium">
                        {getSliderLabel(currentValue)}
                      </Typography>
                    </Box>
                  </Box>
                </FormControl>
              </Box>
            );
          })}
        </Box>

        {/* 追加質問セクション */}
        {additionalQuestions.filter(q => q.categoryId === categoryId).length > 0 && (
          <Accordion sx={{ mt: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${categoryId}-additional-content`}
              id={`${categoryId}-additional-header`}
            >
              <Typography variant="body2" fontWeight="medium">
                もっと答える（詳細質問）
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                より詳細な評価を行いたい場合は、以下の質問にもお答えください。
              </Typography>
              {/* 将来的に追加質問を実装 */}
            </AccordionDetails>
          </Accordion>
        )}
      </Paper>
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          幸福度アンケート
        </Typography>
        <Typography variant="body1" color="text.secondary">
          以下の質問に、あなたの現在の状況ら10段階で評価してください。
          5.5が普通レベルで、正直な気持ちで答えることで、より正確な幸福度が算出されます。
        </Typography>
      </Box>

      {Object.entries(categoryLabels).map(([categoryId, categoryName]) =>
        renderCategorySection(
          categoryId as keyof HappinessFactors,
          categoryName,
          categoryDescriptions[categoryId as keyof typeof categoryDescriptions]
        )
      )}

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
          💡 ヒント: 今の瞬間の気持ちで答えてみてください。完璧である必要はありません。
        </Typography>
        <Typography variant="body2" color="primary.main" align="center" fontWeight="medium">
          ✨ 全カテゴリ6.5点以上で特別シナジーボーナス発動！最大80%ボーナス可能！
        </Typography>
      </Box>
    </Box>
  );
};