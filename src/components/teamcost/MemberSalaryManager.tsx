import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Autocomplete,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  ArrowDropUp as ArrowDropUpIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from '@mui/icons-material';
import type { Position, SalaryData } from '../../types/teamCost';

interface MemberSalaryManagerProps {
  positions: Position[];
  salaryData: SalaryData;
  onPositionsChange: (positions: Position[]) => void;
  onSalaryChange: (salaryData: SalaryData) => void;
}

const DEFAULT_POSITIONS = [
  'リーダー',
  'サブリーダー',
  'シニア',
  'ミドル',
  'ジュニア',
  'マネージャー',
  'アシスタント',
];

export const MemberSalaryManager: React.FC<MemberSalaryManagerProps> = ({
  positions,
  salaryData,
  onPositionsChange,
  onSalaryChange,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', count: 1 });

  const handleAdd = () => {
    const newPosition: Position = {
      id: `pos_${Date.now()}`,
      name: '',
      count: 1,
    };

    onPositionsChange([...positions, newPosition]);
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const newPosition: Position = {
      id: `pos_${Date.now()}`,
      name: formData.name.trim(),
      count: Math.max(1, formData.count),
    };

    onPositionsChange([...positions, newPosition]);
    setDialogOpen(false);
  };

  const handleDelete = (positionId: string) => {
    onPositionsChange(positions.filter(p => p.id !== positionId));
  };

  const handleCountChange = (positionId: string, count: number) => {
    onPositionsChange(positions.map(p =>
      p.id === positionId ? { ...p, count: Math.max(0, count) } : p
    ));
  };

  const handleSalaryTypeChange = (positionName: string, newType: 'hourly' | 'monthly' | 'annual') => {
    const currentSalary = salaryData.positions[positionName] || { type: 'monthly', amount: 0 };
    const oldType = currentSalary.type;
    const oldAmount = currentSalary.amount;

    // 現在の給与を年収に変換
    let annualAmount = 0;
    switch (oldType) {
      case 'hourly':
        annualAmount = oldAmount * 8 * 250; // 時給 × 8時間 × 250日
        break;
      case 'monthly':
        annualAmount = oldAmount * 10000 * 12; // 万円/月 → 円/年
        break;
      case 'annual':
        annualAmount = oldAmount * 10000; // 万円/年 → 円/年
        break;
    }

    // 新しい給与形式に変換
    let newAmount = 0;
    switch (newType) {
      case 'hourly':
        newAmount = Math.round(annualAmount / (8 * 250)); // 円/年 → 時給
        break;
      case 'monthly':
        newAmount = Math.round(annualAmount / (10000 * 12)); // 円/年 → 万円/月
        break;
      case 'annual':
        newAmount = Math.round(annualAmount / 10000); // 円/年 → 万円/年
        break;
    }

    onSalaryChange({
      ...salaryData,
      positions: {
        ...salaryData.positions,
        [positionName]: {
          type: newType,
          amount: newAmount,
        },
      },
    });
  };

  const handleSalaryAmountChange = (positionName: string, amount: number) => {
    onSalaryChange({
      ...salaryData,
      positions: {
        ...salaryData.positions,
        [positionName]: {
          type: salaryData.positions[positionName]?.type || 'monthly',
          amount: Math.max(0, amount),
        },
      },
    });
  };

  const getStepAmount = (type: 'hourly' | 'monthly' | 'annual') => {
    switch (type) {
      case 'hourly': return 100; // 100円単位
      case 'monthly': return 1; // 1万円単位（入力は万円）
      case 'annual': return 10; // 10万円単位（入力は万円）
      default: return 1;
    }
  };

  const handleIncrement = (positionName: string) => {
    const salaryInfo = salaryData.positions[positionName] || { type: 'monthly', amount: 0 };
    const step = getStepAmount(salaryInfo.type);
    handleSalaryAmountChange(positionName, salaryInfo.amount + step);
  };

  const handleDecrement = (positionName: string) => {
    const salaryInfo = salaryData.positions[positionName] || { type: 'monthly', amount: 0 };
    const step = getStepAmount(salaryInfo.type);
    handleSalaryAmountChange(positionName, Math.max(0, salaryInfo.amount - step));
  };

  const getUnitLabel = (type: 'hourly' | 'monthly' | 'annual') => {
    switch (type) {
      case 'hourly': return '円/時';
      case 'monthly': return '万円/月';
      case 'annual': return '万円/年';
      default: return '';
    }
  };

  const getPlaceholder = (type: 'hourly' | 'monthly' | 'annual') => {
    switch (type) {
      case 'hourly': return '3000';
      case 'monthly': return '60';
      case 'annual': return '720';
      default: return '';
    }
  };

  const totalMembers = positions.reduce((sum, pos) => sum + pos.count, 0);

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 1 }} />
            メンバー構成と給与設定
          </Typography>
          <Typography variant="body2" color="text.secondary">
            総計: {totalMembers}名
          </Typography>
        </Box>

        {positions.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              役職とメンバー数、給与を設定してください
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={handleAdd}
            >
              メンバー追加
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
                  役職名
                </Typography>
              </Box>
              <Box sx={{ width: '80px', minWidth: '80px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  人数
                </Typography>
              </Box>
              <Box sx={{ width: '100px', minWidth: '100px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  給与形式
                </Typography>
              </Box>
              <Box sx={{ width: '200px', minWidth: '200px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  給与額
                </Typography>
              </Box>
              <Box sx={{ width: '120px', minWidth: '120px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  年収換算
                </Typography>
              </Box>
              <Box sx={{ width: '40px', minWidth: '40px' }}>
              </Box>
            </Box>

            {/* データ行 */}
            {positions.map((position) => {
              const salaryInfo = salaryData.positions[position.name] || { type: 'monthly', amount: 0 };
              const salaryType = salaryInfo.type;
              const salaryAmount = salaryInfo.amount;
              const annualSalary = (() => {
                switch (salaryType) {
                  case 'hourly': return salaryAmount * 8 * 250;
                  case 'monthly': return salaryAmount * 10000 * 12;
                  case 'annual': return salaryAmount * 10000;
                  default: return 0;
                }
              })();

              return (
                <Box key={position.id} sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mb: 1,
                  px: 1,
                  gap: 2
                }}>
                  <Box sx={{ width: '200px', minWidth: '200px' }}>
                    <Autocomplete
                      freeSolo
                      options={DEFAULT_POSITIONS}
                      value={position.name}
                      onChange={(_, newValue) => {
                        onPositionsChange(positions.map(p =>
                          p.id === position.id ? { ...p, name: newValue || '' } : p
                        ));
                      }}
                      onInputChange={(_, newInputValue) => {
                        onPositionsChange(positions.map(p =>
                          p.id === position.id ? { ...p, name: newInputValue } : p
                        ));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          variant="outlined"
                          placeholder="役職を選択"
                        />
                      )}
                    />
                  </Box>
                  <Box sx={{ width: '80px', minWidth: '80px' }}>
                    <TextField
                      type="number"
                      value={position.count}
                      onChange={(e) => handleCountChange(position.id, parseInt(e.target.value) || 0)}
                      size="small"
                      inputProps={{ min: 0, max: 999 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">名</InputAdornment>,
                      }}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ width: '100px', minWidth: '100px' }}>
                    <Select
                      value={salaryType}
                      onChange={(e) => handleSalaryTypeChange(position.name, e.target.value as 'hourly' | 'monthly' | 'annual')}
                      size="small"
                      fullWidth
                    >
                      <MenuItem value="monthly">月収</MenuItem>
                      <MenuItem value="annual">年収</MenuItem>
                      <MenuItem value="hourly">時給</MenuItem>
                    </Select>
                  </Box>
                  <Box sx={{ width: '200px', minWidth: '200px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TextField
                      type="number"
                      value={salaryAmount}
                      onChange={(e) => handleSalaryAmountChange(position.name, parseFloat(e.target.value) || 0)}
                      size="small"
                      placeholder={getPlaceholder(salaryType)}
                      inputProps={{ min: 0, max: 999999 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">{getUnitLabel(salaryType)}</InputAdornment>,
                      }}
                      sx={{ flex: 1 }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleIncrement(position.name)}
                        sx={{ padding: '2px' }}
                      >
                        <ArrowDropUpIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDecrement(position.name)}
                        sx={{ padding: '2px' }}
                      >
                        <ArrowDropDownIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Box sx={{ width: '120px', minWidth: '120px' }}>
                    <Typography variant="body2" color={salaryAmount > 0 ? 'primary.main' : 'text.secondary'}>
                      {annualSalary > 0 ? `${Math.round(annualSalary / 10000)}万円` : '-'}
                    </Typography>
                  </Box>
                  <Box sx={{ width: '40px', minWidth: '40px' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(position.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              );
            })}

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAdd}
              >
                メンバー追加
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>役職追加</DialogTitle>
        <DialogContent>
          <Autocomplete
            freeSolo
            options={DEFAULT_POSITIONS}
            value={formData.name}
            onChange={(_, newValue) => setFormData({ ...formData, name: newValue || '' })}
            onInputChange={(_, newInputValue) => setFormData({ ...formData, name: newInputValue })}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                margin="dense"
                label="役職名"
                fullWidth
                variant="outlined"
                placeholder="選択または入力してください"
              />
            )}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="人数"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.count}
            onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) || 1 })}
            inputProps={{ min: 1, max: 99 }}
            InputProps={{
              endAdornment: <InputAdornment position="end">名</InputAdornment>,
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
            追加
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};