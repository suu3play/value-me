import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import type { ComparisonItem, SalaryCalculationData } from '../types';
import SalaryCalculator from './SalaryCalculator';

interface ComparisonFormProps {
  items: ComparisonItem[];
  activeItemId: string | null;
  onAddItem: (label: string, data: SalaryCalculationData) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItem: (id: string, data: SalaryCalculationData) => void;
  onUpdateLabel: (id: string, label: string) => void;
  onSetActiveItem: (id: string) => void;
  maxItems?: number;
}

const ComparisonForm: React.FC<ComparisonFormProps> = ({
  items,
  activeItemId,
  onAddItem,
  onRemoveItem,
  onUpdateItem,
  onUpdateLabel,
  onSetActiveItem,
  maxItems = 3,
}) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editLabelDialogOpen, setEditLabelDialogOpen] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState('');

  const activeItem = items.find(item => item.id === activeItemId);

  const handleAddItem = () => {
    if (newItemLabel.trim()) {
      const defaultData: SalaryCalculationData = {
        salaryType: 'monthly',
        salaryAmount: 200000,
        annualHolidays: 119,
        dailyWorkingHours: 8,
        workingHoursType: 'daily',
        useDynamicHolidays: true,
        holidayYear: (() => {
          const currentMonth = new Date().getMonth() + 1;
          const currentYear = new Date().getFullYear();
          return currentMonth >= 4 ? currentYear : currentYear - 1;
        })(),
        holidayYearType: 'fiscal',
        enableBenefits: false,
        welfareAmount: 0,
        welfareType: 'monthly',
        welfareInputMethod: 'individual',
        housingAllowance: 0,
        regionalAllowance: 0,
        familyAllowance: 0,
        qualificationAllowance: 0,
        otherAllowance: 0,
        summerBonus: 0,
        winterBonus: 0,
        settlementBonus: 0,
        otherBonus: 0,
        goldenWeekHolidays: false,
        obon: false,
        yearEndNewYear: false,
        customHolidays: 0,
      };
      
      onAddItem(newItemLabel.trim(), defaultData);
      setNewItemLabel('');
      setAddDialogOpen(false);
    }
  };

  const handleEditLabel = (itemId: string, currentLabel: string) => {
    setEditingItemId(itemId);
    setEditingLabel(currentLabel);
    setEditLabelDialogOpen(true);
  };

  const handleSaveLabel = () => {
    if (editingItemId && editingLabel.trim()) {
      onUpdateLabel(editingItemId, editingLabel.trim());
      setEditLabelDialogOpen(false);
      setEditingItemId(null);
      setEditingLabel('');
    }
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    onSetActiveItem(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={1} sx={{ bgcolor: 'grey.50' }}>
        {/* タブヘッダー */}
        <Box sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: 1,
        }}>
          <Tabs
            value={activeItemId || false}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ flex: 1 }}
          >
            {items.map((item) => (
              <Tab
                key={item.id}
                value={item.id}
                label={
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 0.5,
                    minWidth: 0,
                  }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: { xs: '80px', sm: '120px' },
                      }}
                    >
                      {item.label}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditLabel(item.id, item.label);
                      }}
                      sx={{ 
                        ml: 0.5,
                        p: 0.25,
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <EditIcon fontSize="inherit" />
                    </IconButton>
                    {items.length > 1 && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveItem(item.id);
                        }}
                        sx={{ 
                          ml: 0.25,
                          p: 0.25,
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.light', color: 'error.contrastText' }
                        }}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    )}
                  </Box>
                }
                sx={{
                  minHeight: 48,
                  textTransform: 'none',
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiIconButton-root': {
                      color: 'inherit',
                    },
                  },
                }}
              />
            ))}
          </Tabs>
          
          {/* 追加ボタン */}
          {items.length < maxItems && (
            <IconButton
              onClick={() => setAddDialogOpen(true)}
              sx={{ 
                ml: 1,
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <AddIcon />
            </IconButton>
          )}
        </Box>

        {/* アクティブアイテムのフォーム */}
        {activeItem && (
          <Box sx={{ p: 2 }}>
            <SalaryCalculator
              data={activeItem.data}
              onChange={(data) => onUpdateItem(activeItem.id, data)}
              onResultChange={() => {}}
            />
          </Box>
        )}
      </Paper>

      {/* 新規項目追加ダイアログ */}
      <Dialog 
        open={addDialogOpen} 
        onClose={() => setAddDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>新しい比較項目を追加</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="項目名"
            placeholder="例: A社、B社、現在の職場など"
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddItem();
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>
            キャンセル
          </Button>
          <Button 
            onClick={handleAddItem}
            variant="contained"
            disabled={!newItemLabel.trim()}
          >
            追加
          </Button>
        </DialogActions>
      </Dialog>

      {/* ラベル編集ダイアログ */}
      <Dialog 
        open={editLabelDialogOpen} 
        onClose={() => setEditLabelDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>項目名を編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="項目名"
            value={editingLabel}
            onChange={(e) => setEditingLabel(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveLabel();
              }
            }}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditLabelDialogOpen(false)}>
            キャンセル
          </Button>
          <Button 
            onClick={handleSaveLabel}
            variant="contained"
            disabled={!editingLabel.trim()}
          >
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ComparisonForm;