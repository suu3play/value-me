import React from 'react';
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  RestoreFromTrash as RestoreIcon,
} from '@mui/icons-material';
import type { CalculationHistoryEntry } from '../types';

interface HistoryListItemProps {
  entry: CalculationHistoryEntry;
  onRestore: (entry: CalculationHistoryEntry) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDateTime = (timestamp: number): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp));
};

const getSalaryTypeLabel = (salaryType: 'monthly' | 'annual'): string => {
  return salaryType === 'monthly' ? '月給' : '年俸';
};

export const HistoryListItem: React.FC<HistoryListItemProps> = ({
  entry,
  onRestore,
  onDelete,
}) => {
  const { inputData, result, timestamp, id, label } = entry;
  
  const handleRestoreClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onRestore(entry);
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(id);
  };

  const salaryTypeLabel = getSalaryTypeLabel(inputData.salaryType);
  const formattedDateTime = formatDateTime(timestamp);
  const formattedHourlyWage = formatCurrency(result.hourlyWage);
  const formattedSalary = formatCurrency(inputData.salaryAmount);

  return (
    <ListItem
      onClick={handleRestoreClick}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
      }}
    >
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="body1" component="span">
              時給 {formattedHourlyWage}
            </Typography>
            <Chip
              label={salaryTypeLabel}
              size="small"
              variant="outlined"
              color="primary"
            />
            {label && (
              <Chip
                label={label}
                size="small"
                variant="filled"
                color="secondary"
              />
            )}
          </Box>
        }
        secondary={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              {salaryTypeLabel}: {formattedSalary} | 
              年間休日: {inputData.annualHolidays}日 | 
              勤務時間: {inputData.dailyWorkingHours}時間
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formattedDateTime}
            </Typography>
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton
            edge="end"
            aria-label="restore"
            onClick={handleRestoreClick}
            size="small"
            color="primary"
          >
            <RestoreIcon fontSize="small" />
          </IconButton>
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={handleDeleteClick}
            size="small"
            color="error"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  );
};