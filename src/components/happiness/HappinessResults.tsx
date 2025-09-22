import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import type { HappinessResult } from '../../types/happiness';
import { getScoreDescription, getImprovementSuggestion } from '../../utils/happinessCalculations';
import { categoryLabels } from '../../data/happinessQuestions';

interface HappinessResultsProps {
  result: HappinessResult;
  baseHourlyWage: number;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);
};

const getScoreColor = (score: number): string => {
  if (score >= 80) return '#4caf50'; // green
  if (score >= 60) return '#8bc34a'; // light green
  if (score >= 40) return '#ff9800'; // orange
  if (score >= 20) return '#f44336'; // red
  return '#d32f2f'; // dark red
};

export const HappinessResults: React.FC<HappinessResultsProps> = ({
  result,
  baseHourlyWage,
}) => {
  const wageIncrease = result.adjustedHourlyWage > baseHourlyWage;

  return (
    <Box>
      {/* 総合結果 */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, alignItems: 'center' }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              幸福度調整済み時給
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {formatCurrency(result.adjustedHourlyWage)}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
              {wageIncrease ? (
                <TrendingUpIcon sx={{ mr: 0.5, color: '#4caf50' }} />
              ) : (
                <TrendingDownIcon sx={{ mr: 0.5, color: '#f44336' }} />
              )}
              <Typography variant="body2">
                {wageIncrease ? '+' : ''}{result.happinessBonus.toFixed(1)}%
              </Typography>
            </Box>
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              基本時給
            </Typography>
            <Typography variant="h5">
              {formatCurrency(baseHourlyWage)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              幸福度ボーナス: {wageIncrease ? '+' : ''}{formatCurrency(result.adjustedHourlyWage - baseHourlyWage)}
            </Typography>
            {(result.balanceBonus || result.synergyBonus) && (
              <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5, fontSize: '0.75rem' }}>
                {result.balanceBonus && result.balanceBonus > 0 && `バランス+${result.balanceBonus.toFixed(1)}% `}
                {result.synergyBonus && result.synergyBonus > 0 && `シナジー+${result.synergyBonus.toFixed(1)}%`}
              </Typography>
            )}
          </Box>

          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
              総合幸福度スコア
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {result.totalScore.toFixed(1)}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              {getScoreDescription(result.totalScore)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* ボーナス詳細 */}
      {(result.balanceBonus || result.synergyBonus) && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ボーナス詳細
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 3 }}>
            {result.balanceBonus && result.balanceBonus > 0 && (
              <Box sx={{ flex: 1, p: 2, bgcolor: 'info.light', borderRadius: 2, color: 'info.dark' }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  🎆 バランスボーナス: +{result.balanceBonus.toFixed(1)}%
                </Typography>
                <Typography variant="body2">
                  全カテゴリのバランスが取れていることで得られるボーナスです。
                </Typography>
              </Box>
            )}
            {result.synergyBonus && result.synergyBonus > 0 && (
              <Box sx={{ flex: 1, p: 2, bgcolor: 'success.light', borderRadius: 2, color: 'success.dark' }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  ✨ シナジーボーナス: +{result.synergyBonus.toFixed(1)}%
                </Typography>
                <Typography variant="body2">
                  カテゴリ間の相乗効果や高スコア達成による特別ボーナスです。
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* カテゴリ別スコア */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          カテゴリ別スコア
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
          {Object.entries(result.categoryScores).map(([categoryId, score]) => {
            const categoryName = categoryLabels[categoryId as keyof typeof categoryLabels];
            const color = getScoreColor(score);

            return (
              <Box key={categoryId}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body1" fontWeight="medium">
                    {categoryName}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color }}>
                    {score.toFixed(1)}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={score}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: color,
                      borderRadius: 4,
                    },
                  }}
                />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {getScoreDescription(score)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* 改善提案 */}
      {result.improvementAreas.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            改善提案
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              伸びしろのある領域
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {result.improvementAreas.map((area) => {
                const categoryName = categoryLabels[area as keyof typeof categoryLabels];
                const score = result.categoryScores[area as keyof typeof result.categoryScores];

                return (
                  <Chip
                    key={area}
                    label={`${categoryName} (${score.toFixed(1)})`}
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                );
              })}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {result.improvementAreas.map((area) => {
            const categoryName = categoryLabels[area as keyof typeof categoryLabels];
            const score = result.categoryScores[area as keyof typeof result.categoryScores];
            const suggestion = getImprovementSuggestion(area, score);

            return (
              <Box key={area} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {categoryName}の改善案
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {suggestion}
                </Typography>
              </Box>
            );
          })}
        </Paper>
      )}

      {/* 目標との比較 */}
      {result.targetScore && (
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            目標との比較
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                現在のスコア
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.totalScore.toFixed(1)}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                目標スコア
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.targetScore.toFixed(1)}
              </Typography>
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="text.secondary">
                差分
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: result.totalScore >= result.targetScore ? 'success.main' : 'warning.main',
                }}
              >
                {result.totalScore >= result.targetScore ? '+' : ''}{(result.totalScore - result.targetScore).toFixed(1)}
              </Typography>
            </Box>
          </Box>

          <LinearProgress
            variant="determinate"
            value={Math.min(100, (result.totalScore / result.targetScore) * 100)}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: result.totalScore >= result.targetScore ? '#4caf50' : '#ff9800',
                borderRadius: 4,
              },
            }}
          />

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            目標達成率: {Math.min(100, (result.totalScore / result.targetScore) * 100).toFixed(1)}%
          </Typography>
        </Paper>
      )}

      {/* 幸福度指標説明 */}
      <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary" align="center">
          💡 幸福度調整済み時給は、あなたの働く環境や生活の質を金銭的価値に換算したものです。
          数値だけでなく、各カテゴリのバランスも大切にしてください。
        </Typography>
      </Box>
    </Box>
  );
};