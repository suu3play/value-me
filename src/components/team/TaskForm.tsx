import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Chip,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import {
  Timer as TimerIcon,
  Schedule as ScheduleIcon,
  Label as LabelIcon,
} from '@mui/icons-material';
import type { TaskDefinition, TaskFrequency } from '../../types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (taskData: {
    name: string;
    description?: string;
    estimatedMinutes: number;
    frequency: TaskFrequency;
    tags?: string[];
  }) => void;
  editingTask?: TaskDefinition;
  title?: string;
}

const steps = ['基本情報', '頻度設定', '確認'];

const frequencyTypes = [
  { value: 'once', label: '一回のみ' },
  { value: 'daily', label: '毎日' },
  { value: 'weekly', label: '毎週' },
  { value: 'monthly', label: '毎月' },
  { value: 'yearly', label: '毎年' },
];

const weekDays = [
  { value: 0, label: '日' },
  { value: 1, label: '月' },
  { value: 2, label: '火' },
  { value: 3, label: '水' },
  { value: 4, label: '木' },
  { value: 5, label: '金' },
  { value: 6, label: '土' },
];

export const TaskForm: React.FC<TaskFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingTask,
  title,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    estimatedHours: 0,
    estimatedMinutes: 0,
  });
  
  const [frequency, setFrequency] = useState<TaskFrequency>({
    type: 'once',
  });
  
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (editingTask) {
      const totalMinutes = editingTask.estimatedMinutes;
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      setFormData({
        name: editingTask.name,
        description: editingTask.description || '',
        estimatedHours: hours,
        estimatedMinutes: minutes,
      });
      setFrequency(editingTask.frequency);
      setTags(editingTask.tags || []);
    } else {
      setFormData({
        name: '',
        description: '',
        estimatedHours: 0,
        estimatedMinutes: 30,
      });
      setFrequency({ type: 'once' });
      setTags([]);
    }
    setActiveStep(0);
    setNewTag('');
  }, [editingTask, open]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    const totalMinutes = formData.estimatedHours * 60 + formData.estimatedMinutes;
    
    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      estimatedMinutes: totalMinutes,
      frequency,
      tags: tags.length > 0 ? tags : undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormData({ name: '', description: '', estimatedHours: 0, estimatedMinutes: 0 });
    setFrequency({ type: 'once' });
    setTags([]);
    setNewTag('');
    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return formData.name.trim() !== '' && 
               (formData.estimatedHours > 0 || formData.estimatedMinutes > 0);
      case 1:
        return true; // 頻度設定は常に有効とする
      case 2:
        return true; // 確認画面は常に有効とする
      default:
        return false;
    }
  };

  const formatFrequencyDisplay = (): string => {
    switch (frequency.type) {
      case 'once':
        return '一回のみ';
      case 'daily':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}日ごと` 
          : '毎日';
      case 'weekly':
        let weeklyText = frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}週間ごと` 
          : '毎週';
        if (frequency.daysOfWeek && frequency.daysOfWeek.length > 0) {
          const dayNames = frequency.daysOfWeek.map(day => 
            weekDays.find(wd => wd.value === day)?.label
          ).join('・');
          weeklyText += ` (${dayNames}曜日)`;
        }
        return weeklyText;
      case 'monthly':
        let monthlyText = frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}ヶ月ごと` 
          : '毎月';
        if (frequency.dayOfMonth) {
          monthlyText += ` (${frequency.dayOfMonth}日)`;
        }
        return monthlyText;
      case 'yearly':
        let yearlyText = frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}年ごと` 
          : '毎年';
        if (frequency.monthOfYear) {
          yearlyText += ` (${frequency.monthOfYear}月)`;
        }
        return yearlyText;
      default:
        return '不明';
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="作業名"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            
            <TextField
              margin="dense"
              label="説明（任意）"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              sx={{ mb: 3 }}
              placeholder="作業の詳細、注意点、手順など"
            />

            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <TimerIcon sx={{ mr: 1 }} />
              見積時間
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <TextField
                  label="時間"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    estimatedHours: Math.max(0, parseInt(e.target.value) || 0)
                  })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">時間</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 24 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="分"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={formData.estimatedMinutes}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    estimatedMinutes: Math.max(0, parseInt(e.target.value) || 0)
                  })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">分</InputAdornment>,
                  }}
                  inputProps={{ min: 0, max: 59 }}
                />
              </Grid>
            </Grid>

            <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <LabelIcon sx={{ mr: 1 }} />
              タグ（任意）
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                placeholder="タグを追加"
                size="small"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button onClick={handleAddTag} variant="outlined" size="small">
                追加
              </Button>
            </Box>
            
            {tags.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {tags.map((tag, index) => (
                  <Chip
                    key={index}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    size="small"
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            )}
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <ScheduleIcon sx={{ mr: 1 }} />
              実行頻度の設定
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>頻度タイプ</InputLabel>
              <Select
                value={frequency.type}
                label="頻度タイプ"
                onChange={(e) => setFrequency({ 
                  type: e.target.value as any,
                  ...(e.target.value === 'once' ? {} : { interval: 1 })
                })}
              >
                {frequencyTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {frequency.type !== 'once' && (
              <TextField
                label="間隔"
                type="number"
                variant="outlined"
                fullWidth
                value={frequency.interval || 1}
                onChange={(e) => setFrequency({ 
                  ...frequency, 
                  interval: Math.max(1, parseInt(e.target.value) || 1)
                })}
                sx={{ mb: 3 }}
                inputProps={{ min: 1 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {frequency.type === 'daily' && '日'}
                      {frequency.type === 'weekly' && '週'}
                      {frequency.type === 'monthly' && 'ヶ月'}
                      {frequency.type === 'yearly' && '年'}
                    </InputAdornment>
                  ),
                }}
              />
            )}

            {frequency.type === 'weekly' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  曜日を選択（未選択の場合は全曜日）
                </Typography>
                <Grid container spacing={1}>
                  {weekDays.map((day) => (
                    <Grid item key={day.value}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={frequency.daysOfWeek?.includes(day.value) || false}
                            onChange={(e) => {
                              const currentDays = frequency.daysOfWeek || [];
                              const newDays = e.target.checked
                                ? [...currentDays, day.value]
                                : currentDays.filter(d => d !== day.value);
                              setFrequency({ 
                                ...frequency, 
                                daysOfWeek: newDays.length > 0 ? newDays : undefined
                              });
                            }}
                          />
                        }
                        label={day.label}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {frequency.type === 'monthly' && (
              <TextField
                label="実行日"
                type="number"
                variant="outlined"
                fullWidth
                value={frequency.dayOfMonth || ''}
                onChange={(e) => setFrequency({ 
                  ...frequency, 
                  dayOfMonth: parseInt(e.target.value) || undefined
                })}
                sx={{ mb: 3 }}
                inputProps={{ min: 1, max: 31 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">日</InputAdornment>,
                }}
                placeholder="未指定の場合は毎月実行"
              />
            )}

            {frequency.type === 'yearly' && (
              <TextField
                label="実行月"
                type="number"
                variant="outlined"
                fullWidth
                value={frequency.monthOfYear || ''}
                onChange={(e) => setFrequency({ 
                  ...frequency, 
                  monthOfYear: parseInt(e.target.value) || undefined
                })}
                sx={{ mb: 3 }}
                inputProps={{ min: 1, max: 12 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">月</InputAdornment>,
                }}
                placeholder="未指定の場合は毎年実行"
              />
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              設定した頻度に基づいて年間実行回数とコストが自動計算されます。
            </Alert>
          </Box>
        );
      
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              登録内容の確認
            </Typography>
            
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                基本情報
              </Typography>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  作業名: <strong>{formData.name}</strong>
                </Typography>
              </Box>
              {formData.description && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    説明: {formData.description}
                  </Typography>
                </Box>
              )}
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  見積時間: <strong>
                    {formData.estimatedHours > 0 && `${formData.estimatedHours}時間`}
                    {formData.estimatedHours > 0 && formData.estimatedMinutes > 0 && ' '}
                    {formData.estimatedMinutes > 0 && `${formData.estimatedMinutes}分`}
                  </strong>
                </Typography>
              </Box>
              {tags.length > 0 && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    タグ:
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {tags.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                実行頻度
              </Typography>
              <Typography variant="body1">
                {formatFrequencyDisplay()}
              </Typography>
            </Paper>
          </Box>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          height: '70vh',
        },
      }}
    >
      <DialogTitle>
        {title || (editingTask ? '作業編集' : '作業追加')}
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: '300px' }}>
          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={handleClose}>
          キャンセル
        </Button>
        
        <Box sx={{ flex: '1 1 auto' }} />
        
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          戻る
        </Button>
        
        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isStepValid(activeStep)}
          >
            {editingTask ? '更新' : '登録'}
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid(activeStep)}
          >
            次へ
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};