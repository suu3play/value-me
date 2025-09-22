import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import type { HappinessResult } from '../../types/happiness';
import { categoryLabels } from '../../data/happinessQuestions';

interface HappinessRadarChartProps {
  result: HappinessResult;
  targetScore?: number;
  compact?: boolean;
}

interface ChartPoint {
  x: number;
  y: number;
}

const CHART_SIZE = 300;
const CHART_CENTER = CHART_SIZE / 2;
const CHART_RADIUS = 120;

export const HappinessRadarChart: React.FC<HappinessRadarChartProps> = ({
  result,
  targetScore,
  compact = false,
}) => {
  const categories = Object.keys(result.categoryScores);
  const angleStep = (2 * Math.PI) / categories.length;

  // カテゴリの位置を計算
  const getCategoryPosition = (index: number, score: number): ChartPoint => {
    const angle = -Math.PI / 2 + index * angleStep; // 上から開始
    const radius = (score / 100) * CHART_RADIUS;
    return {
      x: CHART_CENTER + radius * Math.cos(angle),
      y: CHART_CENTER + radius * Math.sin(angle),
    };
  };

  // 軸の位置を計算
  const getAxisPosition = (index: number): ChartPoint => {
    const angle = -Math.PI / 2 + index * angleStep;
    return {
      x: CHART_CENTER + CHART_RADIUS * Math.cos(angle),
      y: CHART_CENTER + CHART_RADIUS * Math.sin(angle),
    };
  };

  // レーダーチャートのパスを生成
  const createRadarPath = (scores: number[]): string => {
    const points = scores.map((score, index) => getCategoryPosition(index, score));
    const pathData = points.map((point, index) => {
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ') + ' Z';
    return pathData;
  };

  // 目標スコアのパス（全カテゴリ同じスコア）
  const targetRadarPath = targetScore
    ? createRadarPath(categories.map(() => targetScore))
    : null;

  // 現在のスコア
  const currentScores = categories.map(category =>
    result.categoryScores[category as keyof typeof result.categoryScores]
  );
  const currentRadarPath = createRadarPath(currentScores);

  // グリッド線を描画
  const gridLevels = [20, 40, 60, 80, 100];
  const gridPaths = gridLevels.map(level => {
    const gridScores = categories.map(() => level);
    return createRadarPath(gridScores);
  });

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        幸福度レーダーチャート
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <svg width={CHART_SIZE} height={CHART_SIZE} viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}>
          {/* グリッド線 */}
          {gridPaths.map((path, index) => (
            <path
              key={`grid-${index}`}
              d={path}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="1"
              strokeDasharray={index === gridPaths.length - 1 ? "none" : "3,3"}
            />
          ))}

          {/* 軸線 */}
          {categories.map((_, index) => {
            const axisEnd = getAxisPosition(index);
            return (
              <line
                key={`axis-${index}`}
                x1={CHART_CENTER}
                y1={CHART_CENTER}
                x2={axisEnd.x}
                y2={axisEnd.y}
                stroke="#e0e0e0"
                strokeWidth="1"
              />
            );
          })}

          {/* 目標スコア（背景） */}
          {targetRadarPath && (
            <path
              d={targetRadarPath}
              fill="rgba(255, 152, 0, 0.1)"
              stroke="#ff9800"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          {/* 現在のスコア */}
          <path
            d={currentRadarPath}
            fill="rgba(103, 58, 183, 0.2)"
            stroke="#673ab7"
            strokeWidth="3"
          />

          {/* データポイント */}
          {currentScores.map((score, index) => {
            const point = getCategoryPosition(index, score);
            return (
              <circle
                key={`point-${index}`}
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#673ab7"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* カテゴリラベル */}
          {categories.map((category, index) => {
            const labelOffset = 20;
            const angle = -Math.PI / 2 + index * angleStep;
            const labelX = CHART_CENTER + (CHART_RADIUS + labelOffset) * Math.cos(angle);
            const labelY = CHART_CENTER + (CHART_RADIUS + labelOffset) * Math.sin(angle);

            return (
              <text
                key={`label-${index}`}
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
                fill="#333"
              >
                {categoryLabels[category as keyof typeof categoryLabels]}
              </text>
            );
          })}

          {/* スコア値表示 */}
          {!compact && currentScores.map((score, index) => {
            const point = getCategoryPosition(index, score);
            const offset = 15;
            const angle = -Math.PI / 2 + index * angleStep;
            const scoreX = point.x + offset * Math.cos(angle);
            const scoreY = point.y + offset * Math.sin(angle);

            return (
              <text
                key={`score-${index}`}
                x={scoreX}
                y={scoreY}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#673ab7"
              >
                {score.toFixed(0)}
              </text>
            );
          })}
        </svg>
      </Box>

      {/* 凡例 */}
      {!compact && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 16,
                height: 3,
                backgroundColor: '#673ab7',
                borderRadius: 1,
              }}
            />
            <Typography variant="body2">現在のスコア</Typography>
          </Box>

          {targetScore && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 3,
                  backgroundColor: '#ff9800',
                  borderRadius: 1,
                  border: '1px dashed #ff9800',
                }}
              />
              <Typography variant="body2">目標スコア</Typography>
            </Box>
          )}
        </Box>
      )}

      {/* スコア詳細 */}
      {!compact && (
        <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          {categories.map((category) => {
            const categoryName = categoryLabels[category as keyof typeof categoryLabels];
            const score = result.categoryScores[category as keyof typeof result.categoryScores];
            const isImprovement = result.improvementAreas.includes(category);

            return (
              <Box
                key={category}
                sx={{
                  p: 2,
                  bgcolor: isImprovement ? 'warning.light' : 'grey.50',
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {categoryName}
                </Typography>
                <Typography variant="h6" color="primary.main">
                  {score.toFixed(1)}
                </Typography>
                {isImprovement && (
                  <Typography variant="caption" color="warning.dark">
                    改善領域
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {!compact && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            💡 レーダーチャートが大きく広がるほど、バランスよく高い幸福度を示しています。
            小さくても均等な形は、安定した状態を表します。
          </Typography>
        </Box>
      )}
    </Paper>
  );
};