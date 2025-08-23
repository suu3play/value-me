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
  Delete as DeleteIcon,
  People as PeopleIcon,
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

  const handleSalaryTypeChange = (type: SalaryData['type']) => {
    onSalaryChange({ ...salaryData, type });
  };

  const handleSalaryAmountChange = (positionName: string, amount: number) => {
    onSalaryChange({
      ...salaryData,
      positions: {
        ...salaryData.positions,
        [positionName]: Math.max(0, amount),
      },
    });
  };

  const getUnitLabel = () => {
    switch (salaryData.type) {
      case 'hourly': return '円/時';
      case 'monthly': return '万円/月';
      case 'annual': return '万円/年';
      default: return '';
    }
  };

  const getPlaceholder = () => {
    switch (salaryData.type) {
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              総計: {totalMembers}名
            </Typography>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>給与形式</InputLabel>
              <Select
                value={salaryData.type}
                label="給与形式"
                onChange={(e) => handleSalaryTypeChange(e.target.value as SalaryData['type'])}
              >
                <MenuItem value="monthly">月収</MenuItem>
                <MenuItem value="annual">年収</MenuItem>
                <MenuItem value="hourly">時給</MenuItem>
              </Select>
            </FormControl>
          </Box>
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
              <Box sx={{ width: '120px', minWidth: '120px' }}>
                <Typography variant="caption" color="text.secondary" fontWeight="medium">
                  {salaryData.type === 'monthly' ? '月収' : salaryData.type === 'annual' ? '年収' : '時給'}
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
              const salaryAmount = salaryData.positions[position.name] || 0;
              const annualSalary = (() => {
                switch (salaryData.type) {
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
                  <Box sx={{ width: '150px', minWidth: '150px' }}>
                    <TextField
                      type="number"
                      value={salaryAmount}
                      onChange={(e) => handleSalaryAmountChange(position.name, parseFloat(e.target.value) || 0)}
                      size="small"
                      placeholder={getPlaceholder()}
                      inputProps={{ min: 0, max: 999999 }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
                      }}
                      fullWidth
                    />
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