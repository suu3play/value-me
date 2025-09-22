import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Paper,
  Alert,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import type {
  HappinessFactors,
  HappinessWeights,
  HappinessResult,
  HappinessCalculationData,
} from '../../types/happiness';
import { HappinessFactorForm } from './HappinessFactorForm';
import { HappinessWeightForm } from './HappinessWeightForm';
import { HappinessResults } from './HappinessResults';
import { HappinessRadarChart } from './HappinessRadarChart';
import { calculateHappiness, defaultFactors, defaultWeights } from '../../utils/happinessCalculations';

interface HappinessCalculatorProps {
  baseHourlyWage?: number;
  onResultChange?: (result: HappinessResult | null) => void;
}

export const HappinessCalculator: React.FC<HappinessCalculatorProps> = ({
  baseHourlyWage = 0,
  onResultChange,
}) => {
  const [factors, setFactors] = useState<HappinessFactors>(defaultFactors);
  const [weights, setWeights] = useState<HappinessWeights>(defaultWeights);
  const [targetScore, setTargetScore] = useState<string>('75');
  const [useTargetScore, setUseTargetScore] = useState<boolean>(false);
  const [result, setResult] = useState<HappinessResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // 計算実行
  const calculateResult = useCallback(() => {
    if (baseHourlyWage <= 0) {
      setResult(null);
      onResultChange?.(null);
      return;
    }

    const calculationData: HappinessCalculationData = {
      factors,
      weights,
      baseHourlyWage,
      targetScore: useTargetScore ? parseFloat(targetScore) || undefined : undefined,
    };

    const calculatedResult = calculateHappiness(calculationData);
    setResult(calculatedResult);
    onResultChange?.(calculatedResult);
  }, [factors, weights, baseHourlyWage, targetScore, useTargetScore, onResultChange]);

  // 自動計算
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateResult();
    }, 500); // デバウンス

    return () => clearTimeout(timer);
  }, [calculateResult]);

  // データリセット
  const handleReset = () => {
    setFactors(defaultFactors);
    setWeights(defaultWeights);
    setTargetScore('75');
    setUseTargetScore(false);
    setResult(null);
    onResultChange?.(null);
  };

  const totalWeight = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
  const isWeightValid = totalWeight === 100;

  return (
    <Box>
      {/* ヘッダー */}
      <Paper elevation={1} sx={{ p: 3, mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          幸福度換算ツール
        </Typography>
        <Typography variant="body1">
          あなたの仕事や生活の満足度を多角的に評価し、
          金銭的価値では測れない「幸福度」を時給に反映させましょう。
        </Typography>
      </Paper>

      {/* 基本時給確認 */}
      {baseHourlyWage <= 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          幸福度換算を行うには、まず「時給計算」タブで基本時給を計算してください。
        </Alert>
      )}

      {baseHourlyWage > 0 && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            基本情報
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                基本時給
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                ¥{baseHourlyWage.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={useTargetScore}
                    onChange={(e) => setUseTargetScore(e.target.checked)}
                  />
                }
                label="目標スコアを設定"
              />
              {useTargetScore && (
                <TextField
                  label="目標スコア"
                  value={targetScore}
                  onChange={(e) => setTargetScore(e.target.value)}
                  type="number"
                  inputProps={{ min: 0, max: 100, step: 1 }}
                  size="small"
                  sx={{ width: 100 }}
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CalculateIcon />}
                onClick={calculateResult}
                disabled={!isWeightValid}
              >
                再計算
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleReset}
              >
                リセット
              </Button>
            </Box>
          </Box>
        </Paper>
      )}

      {/* 幸福度評価フォーム */}
      <HappinessFactorForm factors={factors} onChange={setFactors} />

      {/* 詳細設定 */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            詳細設定
          </Typography>
          <Button
            variant="text"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? '簡易表示' : '詳細設定'}
          </Button>
        </Box>

        {showAdvanced && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              各カテゴリの重要度を調整できます。あなたが重視する要素により高い重みを設定してください。
            </Typography>
            <HappinessWeightForm weights={weights} onChange={setWeights} />
          </>
        )}

        {!isWeightValid && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            重み付けの合計を100%に調整してください。現在: {totalWeight}%
          </Alert>
        )}
      </Paper>

      {/* 計算結果 */}
      {result && baseHourlyWage > 0 && (
        <>
          <HappinessResults result={result} baseHourlyWage={baseHourlyWage} />

          <Box sx={{ mt: 3 }}>
            <HappinessRadarChart
              result={result}
              targetScore={useTargetScore ? parseFloat(targetScore) : undefined}
            />
          </Box>
        </>
      )}

      {/* 使い方ガイド */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          使い方のコツ
        </Typography>
        <Box component="ul" sx={{ pl: 2, m: 0 }}>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>10段階評価:</strong> 5.5が普通レベルでボーナス0%。理想ではなく現実を評価してください
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>バランスボーナス:</strong> 全カテゴリが均等に高いと最大20%の追加ボーナス
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>シナジー効果:</strong> 仕事×健康、家族×趣味などの組み合わせで最大30%ボーナス
          </Typography>
          <Typography component="li" variant="body2" sx={{ mb: 1 }}>
            <strong>特別ボーナス:</strong> 75点以上で+10%、85点以上でさらに+10%のブースト
          </Typography>
          <Typography component="li" variant="body2">
            <strong>最大ボーナス:</strong> 全て組み合わせると最大80%の幸福度ボーナスが可能！
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};