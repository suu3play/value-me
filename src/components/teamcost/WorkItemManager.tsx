import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import type { WorkItem } from '../../types/teamCost';
import { FREQUENCY_LABELS, FREQUENCY_MULTIPLIERS } from '../../types/teamCost';

interface WorkItemManagerProps {
  workItems: WorkItem[];
  onChange: (workItems: WorkItem[]) => void;
}

const DEFAULT_WORK_ITEMS = [
  '定例会',
  '日次MTG',
  '週次レビュー',
  '月次レポート作成',
  '四半期振り返り',
  '年次監査',
  'プロジェクト企画',
  'システム保守',
  '顧客対応',
  '研修・教育',
  'ドキュメント作成',
];

export const WorkItemManager: React.FC<WorkItemManagerProps> = ({ workItems, onChange }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkItem | null>(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    frequency: 'monthly' as const,
    hours: 1 
  });

  const handleAdd = () => {
    const newItem: WorkItem = {
      id: `work_${Date.now()}`,
      name: '',
      frequency: 'monthly',
      hours: 1,
    };

    onChange([...workItems, newItem]);
  };

  const handleEdit = (item: WorkItem) => {
    setEditingItem(item);
    setFormData({ name: item.name, frequency: item.frequency, hours: item.hours });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const newItem: WorkItem = {
      id: editingItem?.id || `work_${Date.now()}`,
      name: formData.name.trim(),
      frequency: formData.frequency,
      hours: Math.max(0.1, formData.hours),
    };

    if (editingItem) {
      // 編集
      onChange(workItems.map(w => w.id === editingItem.id ? newItem : w));
    } else {
      // 新規追加
      onChange([...workItems, newItem]);
    }

    setDialogOpen(false);
  };

  const handleDelete = (itemId: string) => {
    onChange(workItems.filter(w => w.id !== itemId));
  };

  const handleWorkItemChange = (itemId: string, field: keyof WorkItem, value: any) => {
    onChange(workItems.map(w => 
      w.id === itemId ? { ...w, [field]: value } : w
    ));
  };

  const getFrequencyColor = (frequency: WorkItem['frequency']) => {
    const colors = {
      daily: 'error',
      weekly: 'warning', 
      monthly: 'info',
      yearly: 'success',
    } as const;
    return colors[frequency];
  };

  const getTotalAnnualHours = () => {
    return workItems.reduce((total, item) => {
      return total + (item.hours * FREQUENCY_MULTIPLIERS[item.frequency]);
    }, 0);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <AssignmentIcon sx={{ mr: 1 }} />
            作業項目
          </Typography>
          <Chip 
            label={`年間総時間: ${getTotalAnnualHours().toFixed(1)}h`} 
            color="primary" 
            variant="outlined"
          />
        </Box>

        {workItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              作業項目と実行頻度・時間を設定してください
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              作業を追加
            </Button>
          </Box>
        ) : (
          <Box>
            {/* ヘッダー行 */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1, 
              px: 1, 
              gap: 2 
            }}>
              <Box sx={{ width: '200px', minWidth: '200px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  作業名
                </Typography>
              </Box>
              <Box sx={{ width: '100px', minWidth: '100px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  頻度
                </Typography>
              </Box>
              <Box sx={{ width: '100px', minWidth: '100px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  時間
                </Typography>
              </Box>
              <Box sx={{ width: '120px', minWidth: '120px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  年間時間
                </Typography>
              </Box>
              <Box sx={{ width: '40px', minWidth: '40px' }}>
              </Box>
            </Box>

            {/* データ行 */}
            {workItems.map((item) => (
              <Box key={item.id} sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 1, 
                px: 1, 
                gap: 2 
              }}>
                <Box sx={{ width: '200px', minWidth: '200px' }}>
                  <Autocomplete
                    freeSolo
                    options={DEFAULT_WORK_ITEMS}
                    value={item.name}
                    onChange={(_, newValue) => {
                      handleWorkItemChange(item.id, 'name', newValue || '');
                    }}
                    onInputChange={(_, newInputValue) => {
                      handleWorkItemChange(item.id, 'name', newInputValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        variant="outlined"
                        placeholder="作業を選択"
                      />
                    )}
                  />
                </Box>
                <Box sx={{ width: '100px', minWidth: '100px' }}>
                  <FormControl fullWidth size="small">
                    <Select
                      value={item.frequency}
                      onChange={(e) => handleWorkItemChange(item.id, 'frequency', e.target.value)}
                      variant="outlined"
                    >
                      <MenuItem value="daily">日次</MenuItem>
                      <MenuItem value="weekly">週次</MenuItem>
                      <MenuItem value="monthly">月次</MenuItem>
                      <MenuItem value="yearly">年次</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ width: '100px', minWidth: '100px' }}>
                  <TextField
                    type="number"
                    value={item.hours}
                    onChange={(e) => handleWorkItemChange(item.id, 'hours', Math.max(0.1, parseFloat(e.target.value) || 0))}
                    size="small"
                    inputProps={{ min: 0.1, max: 999, step: 0.5 }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">h</InputAdornment>,
                    }}
                    fullWidth
                  />
                </Box>
                <Box sx={{ width: '120px', minWidth: '120px' }}>
                  <Typography variant="body2" color="primary.main">
                    {(item.hours * FREQUENCY_MULTIPLIERS[item.frequency]).toFixed(1)}h
                  </Typography>
                </Box>
                <Box sx={{ width: '40px', minWidth: '40px' }}>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(item.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                作業を追加
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? '作業編集' : '作業追加'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="作業名"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="例: 月次レビュー, 週次MTG, 年次監査"
            sx={{ mb: 2 }}
          />
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>実行頻度</InputLabel>
            <Select
              value={formData.frequency}
              label="実行頻度"
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
            >
              <MenuItem value="daily">日次</MenuItem>
              <MenuItem value="weekly">週次</MenuItem>
              <MenuItem value="monthly">月次</MenuItem>
              <MenuItem value="yearly">年次</MenuItem>
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="1回あたりの時間"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.hours}
            onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) || 1 })}
            inputProps={{ min: 0.1, max: 999, step: 0.5 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">時間</InputAdornment>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            キャンセル
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingItem ? '更新' : '追加'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};