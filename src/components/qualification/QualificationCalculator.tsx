import { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  Alert,
  Chip,
  Card,
  CardContent,
  Divider,
  Stack
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import type { QualificationData, QualificationResult } from '../../types/qualification';
import { QUALIFICATION_PRESETS } from '../../types/qualification';
import { calculateQualificationROI, evaluateQualificationInvestment } from '../../utils/qualificationCalculations';

interface QualificationCalculatorProps {
  currentHourlyWage?: number;
  onResultChange?: (result: QualificationResult) => void;
}

const initialData: QualificationData = {
  name: '',
  studyHours: 0,
  studyPeriod: 6,
  examFee: 0,
  materialCost: 0,
  courseFee: 0,
  otherCosts: 0,
  currentAllowance: 0,
  expectedAllowance: 0,
  salaryIncrease: 0,
  jobChangeIncrease: 0,
  currentHourlyWage: 0
};

export const QualificationCalculator: React.FC<QualificationCalculatorProps> = ({
  currentHourlyWage = 0,
  onResultChange
}) => {
  const [data, setData] = useState<QualificationData>({
    ...initialData,
    currentHourlyWage
  });
  const [result, setResult] = useState<QualificationResult | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  // 時給が変更された時にデータを更新
  useEffect(() => {
    setData(prev => ({ ...prev, currentHourlyWage }));
  }, [currentHourlyWage]);

  // 計算処理
  const handleCalculate = useCallback(() => {
    try {
      const calculationResult = calculateQualificationROI(data);
      setResult(calculationResult);
      onResultChange?.(calculationResult);
    } catch (error) {
      console.error('資格計算エラー:', error);
      setResult(null);
    }
  }, [data, onResultChange]);

  // データ変更時に自動計算
  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  // プリセット選択時の処理
  const handlePresetChange = useCallback((presetId: string) => {
    setSelectedPreset(presetId);
    const preset = QUALIFICATION_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setData(prev => ({
        ...prev,
        name: preset.name,
        studyHours: preset.estimatedHours
      }));
    }
  }, []);

  // フィールド更新処理
  const updateField = useCallback((field: keyof QualificationData, value: string | number) => {
    setData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value) || 0
    }));
  }, []);

  // 通貨フォーマット
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // 評価の色を取得
  const getEvaluationColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'success';
      case 'good': return 'info';
      case 'fair': return 'warning';
      case 'poor': return 'error';
      default: return 'default';
    }
  };

  const evaluation = result ? evaluateQualificationInvestment(result) : null;

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        {/* 入力フォーム */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon />
              資格情報
            </Typography>

            {/* 資格プリセット選択 */}
            <FormControl fullWidth margin="normal">
              <InputLabel>資格を選択</InputLabel>
              <Select
                value={selectedPreset}
                label="資格を選択"
                onChange={(e) => handlePresetChange(e.target.value)}
              >
                {QUALIFICATION_PRESETS.map(preset => (
                  <MenuItem key={preset.id} value={preset.id}>
                    {preset.name} ({preset.estimatedHours}時間目安)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 資格名 */}
            <TextField
              fullWidth
              label="資格名"
              value={data.name}
              onChange={(e) => updateField('name', e.target.value)}
              margin="normal"
            />

            {/* 学習時間 */}
            <TextField
              fullWidth
              type="number"
              label="予定学習時間"
              value={data.studyHours}
              onChange={(e) => updateField('studyHours', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">時間</InputAdornment>
              }}
              margin="normal"
            />

            {/* 学習期間 */}
            <TextField
              fullWidth
              type="number"
              label="学習期間"
              value={data.studyPeriod}
              onChange={(e) => updateField('studyPeriod', e.target.value)}
              InputProps={{
                endAdornment: <InputAdornment position="end">ヶ月</InputAdornment>
              }}
              margin="normal"
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <MonetizationOnIcon />
              費用情報
            </Typography>

            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="受験料"
                  value={data.examFee}
                  onChange={(e) => updateField('examFee', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="教材費"
                  value={data.materialCost}
                  onChange={(e) => updateField('materialCost', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>
                  }}
                />
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="講座・スクール費用"
                  value={data.courseFee}
                  onChange={(e) => updateField('courseFee', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="その他費用"
                  value={data.otherCosts}
                  onChange={(e) => updateField('otherCosts', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>
                  }}
                />
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon />
              効果予測
            </Typography>

            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="現在の資格手当"
                  value={data.currentAllowance}
                  onChange={(e) => updateField('currentAllowance', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/月</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="取得後の資格手当"
                  value={data.expectedAllowance}
                  onChange={(e) => updateField('expectedAllowance', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/月</InputAdornment>
                  }}
                />
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2, flexWrap: 'wrap' }}>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="昇給・昇進効果"
                  value={data.salaryIncrease}
                  onChange={(e) => updateField('salaryIncrease', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/年</InputAdornment>
                  }}
                />
              </Box>
              <Box sx={{ flex: '1 1 200px', minWidth: '200px' }}>
                <TextField
                  fullWidth
                  type="number"
                  label="転職時年収増加"
                  value={data.jobChangeIncrease}
                  onChange={(e) => updateField('jobChangeIncrease', e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¥</InputAdornment>,
                    endAdornment: <InputAdornment position="end">/年</InputAdornment>
                  }}
                />
              </Box>
            </Stack>
          </Paper>
        </Box>

        {/* 計算結果 */}
        <Box sx={{ flex: 1 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon />
              投資効果分析
            </Typography>

            {currentHourlyWage > 0 ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                現在の時給: {formatCurrency(currentHourlyWage)}を使用して機会コストを計算
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mb: 2 }}>
                時給計算を先に実行すると、より正確な機会コストが算出されます
              </Alert>
            )}

            {result && (
              <Box>
                {/* 評価指標 */}
                {evaluation && (
                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={evaluation.message}
                      color={getEvaluationColor(evaluation.level) as 'success' | 'info' | 'warning' | 'error' | 'default'}
                      sx={{ mb: 1 }}
                    />
                  </Box>
                )}

                {/* 投資額内訳 */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      投資額内訳
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">機会コスト</Typography>
                      <Typography variant="body2">{formatCurrency(result.opportunityCost)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">直接費用</Typography>
                      <Typography variant="body2">{formatCurrency(result.directCosts)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="bold">総投資額</Typography>
                      <Typography variant="body1" fontWeight="bold">{formatCurrency(result.totalInvestment)}</Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* 効果予測 */}
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      年間効果
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">資格手当増加</Typography>
                      <Typography variant="body2">{formatCurrency(result.annualAllowanceIncrease * 12)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">昇給効果</Typography>
                      <Typography variant="body2">{formatCurrency(result.annualSalaryIncrease)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">転職効果</Typography>
                      <Typography variant="body2">{formatCurrency(result.annualJobChangeIncrease)}</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body1" fontWeight="bold">年間効果合計</Typography>
                      <Typography variant="body1" fontWeight="bold">{formatCurrency(result.totalAnnualBenefit)}</Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* ROI指標 */}
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      投資指標
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">投資収益率 (ROI)</Typography>
                      <Typography variant="body2">{result.roi.toFixed(1)}%</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">回収期間</Typography>
                      <Typography variant="body2">
                        {isFinite(result.paybackPeriod) ? `${result.paybackPeriod.toFixed(1)}年` : '計算不可'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">10年累積効果</Typography>
                      <Typography variant="body2">{formatCurrency(result.tenYearBenefit)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">正味現在価値 (NPV)</Typography>
                      <Typography
                        variant="body2"
                        color={result.npv >= 0 ? 'success.main' : 'error.main'}
                      >
                        {formatCurrency(result.npv)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            )}
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
};