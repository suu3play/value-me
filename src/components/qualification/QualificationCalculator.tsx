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
  MonetizationOn as MonetizationOnIcon
} from '@mui/icons-material';
import type { QualificationData, QualificationResult } from '../../types/qualification';
import { JOB_CATEGORIES, getQualificationsByCategory } from '../../types/qualificationData';
import { calculateQualificationROI, evaluateQualificationInvestment } from '../../utils/qualificationCalculations';
import ValidatedInput from '../ValidatedInput';
import { validateSalary } from '../../utils/validation';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('it-engineer');
  const [availableQualifications, setAvailableQualifications] = useState(getQualificationsByCategory('it-engineer'));

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

  // 職種変更時の処理
  const handleCategoryChange = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
    const qualifications = getQualificationsByCategory(categoryId);
    setAvailableQualifications(qualifications);
    setSelectedPreset(''); // 資格選択をリセット
    setData(prev => ({
      ...prev,
      name: '',
      studyHours: 0,
      examFee: 0,
      materialCost: 0,
      courseFee: 0,
      expectedAllowance: prev.currentAllowance,
      salaryIncrease: 0,
      jobChangeIncrease: 0
    }));
  }, []);

  // プリセット選択時の処理
  const handlePresetChange = useCallback((presetId: string) => {
    setSelectedPreset(presetId);
    const preset = availableQualifications.find(p => p.id === presetId);
    if (preset) {
      setData(prev => ({
        ...prev,
        name: preset.name,
        studyHours: preset.estimatedHours,
        examFee: preset.estimatedCost.examFee,
        materialCost: preset.estimatedCost.materialCost,
        courseFee: preset.estimatedCost.courseFee || 0,
        expectedAllowance: prev.currentAllowance + preset.marketValue.allowanceIncrease,
        salaryIncrease: preset.marketValue.salaryIncrease,
        jobChangeIncrease: preset.marketValue.jobChangeIncrease
      }));
    }
  }, [availableQualifications]);

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

  // 難易度の日本語表示
  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初級';
      case 'intermediate': return '中級';
      case 'advanced': return '上級';
      case 'expert': return 'エキスパート';
      default: return '不明';
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

            {/* 職種選択 */}
            <FormControl fullWidth margin="normal">
              <InputLabel>職種カテゴリ</InputLabel>
              <Select
                value={selectedCategory}
                label="職種カテゴリ"
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                {JOB_CATEGORIES.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {category.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {category.description}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 資格プリセット選択 */}
            <FormControl fullWidth margin="normal">
              <InputLabel>資格を選択</InputLabel>
              <Select
                value={selectedPreset}
                label="資格を選択"
                onChange={(e) => handlePresetChange(e.target.value)}
                disabled={availableQualifications.length === 0}
              >
                <MenuItem value="">
                  <em>選択してください</em>
                </MenuItem>
                {availableQualifications.map(preset => (
                  <MenuItem key={preset.id} value={preset.id}>
                    <Box sx={{ width: '100%' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {preset.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {preset.estimatedHours}時間目安 · 難易度: {getDifficultyLabel(preset.difficulty)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        試験料: {formatCurrency(preset.estimatedCost.examFee)}
                        {preset.estimatedCost.courseFee && ` · 講座料: ${formatCurrency(preset.estimatedCost.courseFee)}`}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* 現在の職種統計表示 */}
            {selectedCategory && (
              <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
                {JOB_CATEGORIES.find(c => c.id === selectedCategory)?.name}の資格: {availableQualifications.length}個
              </Alert>
            )}

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
              費用
            </Typography>

            {/* 試験料 */}
            <ValidatedInput
              id="exam-fee"
              label="試験料"
              value={data.examFee}
              onChange={(value) => updateField('examFee', value)}
              validator={validateSalary}
              type="integer"
              step={1000}
              unit="円"
              showIncrementButtons
              helperText="試験料を入力してください（0円～1億円）"
              sx={{ mt: 2 }}
            />

            {/* 教材費 */}
            <ValidatedInput
              id="material-cost"
              label="教材費"
              value={data.materialCost}
              onChange={(value) => updateField('materialCost', value)}
              validator={validateSalary}
              type="integer"
              step={1000}
              unit="円"
              showIncrementButtons
              helperText="教材費を入力してください（0円～1億円）"
              sx={{ mt: 2 }}
            />

            {/* 講座・研修費 */}
            <ValidatedInput
              id="course-fee"
              label="講座・研修費"
              value={data.courseFee}
              onChange={(value) => updateField('courseFee', value)}
              validator={validateSalary}
              type="integer"
              step={1000}
              unit="円"
              showIncrementButtons
              helperText="講座・研修費を入力してください（0円～1億円）"
              sx={{ mt: 2 }}
            />

            {/* その他費用 */}
            <ValidatedInput
              id="other-costs"
              label="その他費用"
              value={data.otherCosts}
              onChange={(value) => updateField('otherCosts', value)}
              validator={validateSalary}
              type="integer"
              step={1000}
              unit="円"
              showIncrementButtons
              helperText="その他費用を入力してください（0円～1億円）"
              sx={{ mt: 2 }}
            />

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon />
              効果予測
            </Typography>

            {/* 現在の資格手当 */}
            <ValidatedInput
              id="current-allowance"
              label="現在の資格手当 (月額)"
              value={data.currentAllowance}
              onChange={(value) => updateField('currentAllowance', value)}
              validator={validateSalary}
              type="integer"
              step={1000}
              unit="円"
              showIncrementButtons
              helperText="現在の資格手当を入力してください（0円～1億円）"
              sx={{ mt: 2 }}
            />

            {/* 期待される資格手当 */}
            <ValidatedInput
              id="expected-allowance"
              label="期待される資格手当 (月額)"
              value={data.expectedAllowance}
              onChange={(value) => updateField('expectedAllowance', value)}
              validator={validateSalary}
              type="integer"
              step={1000}
              unit="円"
              showIncrementButtons
              helperText="期待される資格手当を入力してください（0円～1億円）"
              sx={{ mt: 2 }}
            />

            {/* 昇給効果 */}
            <ValidatedInput
              id="salary-increase"
              label="昇給効果 (年額)"
              value={data.salaryIncrease}
              onChange={(value) => updateField('salaryIncrease', value)}
              validator={validateSalary}
              type="integer"
              step={1000}
              unit="円"
              showIncrementButtons
              helperText="昇給効果を入力してください（0円～1億円）"
              sx={{ mt: 2 }}
            />

            {/* 転職時年収アップ */}
            <ValidatedInput
              id="job-change-increase"
              label="転職時年収アップ"
              value={data.jobChangeIncrease}
              onChange={(value) => updateField('jobChangeIncrease', value)}
              validator={validateSalary}
              type="integer"
              step={1000}
              unit="円"
              showIncrementButtons
              helperText="転職時年収アップを入力してください（0円～1億円）"
              sx={{ mt: 2 }}
            />
          </Paper>
        </Box>

        {/* 結果表示 */}
        <Box sx={{ flex: 1 }}>
          {result ? (
            <Stack spacing={2}>
              {/* 投資効果サマリー */}
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TrendingUpIcon color="primary" />
                    投資効果サマリー
                  </Typography>

                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mt: 2 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">ROI</Typography>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {result.roi.toFixed(1)}%
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">回収期間</Typography>
                      <Typography variant="h4" color="primary" fontWeight="bold">
                        {isFinite(result.paybackPeriod) ? `${result.paybackPeriod.toFixed(1)}年` : '∞'}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">総投資額</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(result.totalInvestment)}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary">年間効果</Typography>
                      <Typography variant="h6" fontWeight="bold">
                        {formatCurrency(result.totalAnnualBenefit)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* 詳細分析 */}
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>詳細分析</Typography>

                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">投資内訳</Typography>
                      <Typography variant="body1">機会コスト: {formatCurrency(result.opportunityCost)}</Typography>
                      <Typography variant="body1">直接費用: {formatCurrency(result.directCosts)}</Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="body2" color="text.secondary">効果内訳</Typography>
                      <Typography variant="body1">
                        資格手当増: {formatCurrency(result.annualAllowanceIncrease)}
                      </Typography>
                      <Typography variant="body1">
                        昇給効果: {formatCurrency(result.annualSalaryIncrease)}
                      </Typography>
                      <Typography variant="body1">
                        転職効果: {formatCurrency(result.annualJobChangeIncrease)}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="body2" color="text.secondary">長期効果</Typography>
                      <Typography variant="body1">
                        10年累積効果: {formatCurrency(result.tenYearBenefit)}
                      </Typography>
                      <Typography variant="body1">
                        NPV (5%割引): {formatCurrency(result.npv)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* 投資評価 */}
              {evaluation && (
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>投資評価</Typography>
                    <Chip
                      label={evaluation.level === 'excellent' ? '優秀' :
                             evaluation.level === 'good' ? '良好' :
                             evaluation.level === 'fair' ? '普通' : '要検討'}
                      color={getEvaluationColor(evaluation.level) as 'success' | 'info' | 'warning' | 'error' | 'default'}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {evaluation.message}
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Stack>
          ) : (
            <Alert severity="info">
              資格情報を入力すると投資効果を分析できます
            </Alert>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default QualificationCalculator;