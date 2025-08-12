import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  Button,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  Close as CloseIcon,
  DeleteSweep as DeleteSweepIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { HistoryListItem } from './HistoryListItem';
import type { CalculationHistoryEntry, SalaryCalculationData } from '../types';

interface CalculationHistoryProps {
  open: boolean;
  onClose: () => void;
  onRestoreData: (data: SalaryCalculationData) => void;
  history: CalculationHistoryEntry[];
  onRemoveFromHistory: (id: string) => void;
  onClearHistory: () => void;
  isSupported: boolean;
}

export const CalculationHistory: React.FC<CalculationHistoryProps> = ({
  open,
  onClose,
  onRestoreData,
  history,
  onRemoveFromHistory,
  onClearHistory,
  isSupported,
}) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const handleRestore = (entry: CalculationHistoryEntry) => {
    onRestoreData(entry.inputData);
    onClose();
  };

  const handleDeleteClick = (id: string) => {
    setSelectedEntryId(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedEntryId) {
      onRemoveFromHistory(selectedEntryId);
      setSelectedEntryId(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleDeleteCancel = () => {
    setSelectedEntryId(null);
    setDeleteConfirmOpen(false);
  };

  const handleClearAllClick = () => {
    setClearConfirmOpen(true);
  };

  const handleClearAllConfirm = () => {
    onClearHistory();
    setClearConfirmOpen(false);
  };

  const handleClearAllCancel = () => {
    setClearConfirmOpen(false);
  };

  if (!isSupported) {
    return (
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{ zIndex: 1300 }}
      >
        <Box sx={{ width: 400, p: 2 }}>
          <Alert severity="warning">
            このブラウザではローカルストレージがサポートされていないため、
            計算履歴機能を使用できません。
          </Alert>
        </Box>
      </Drawer>
    );
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        sx={{ zIndex: 1300 }}
        PaperProps={{
          sx: { width: { xs: '100vw', sm: 450, md: 500 } }
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* ヘッダー */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HistoryIcon color="primary" />
              <Typography variant="h6">計算履歴</Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* 履歴件数と操作ボタン */}
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                保存済み: {history.length}件 (最大50件)
              </Typography>
              {history.length > 0 && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleClearAllClick}
                  color="error"
                >
                  全削除
                </Button>
              )}
            </Box>
          </Box>

          {/* 履歴リスト */}
          <Box sx={{ flex: 1, overflow: 'auto' }}>
            {history.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  p: 4,
                  textAlign: 'center',
                }}
              >
                <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  履歴がありません
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  計算を実行すると、履歴がここに表示されます
                </Typography>
              </Box>
            ) : (
              <List sx={{ py: 0 }}>
                {history.map((entry, index) => (
                  <React.Fragment key={entry.id}>
                    <HistoryListItem
                      entry={entry}
                      onRestore={handleRestore}
                      onDelete={handleDeleteClick}
                    />
                    {index < history.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </Drawer>

      {/* 個別削除確認ダイアログ */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-confirm-dialog-title"
      >
        <DialogTitle id="delete-confirm-dialog-title">
          履歴を削除しますか？
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            選択した計算履歴を削除します。この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>キャンセル</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 全削除確認ダイアログ */}
      <Dialog
        open={clearConfirmOpen}
        onClose={handleClearAllCancel}
        aria-labelledby="clear-confirm-dialog-title"
      >
        <DialogTitle id="clear-confirm-dialog-title">
          全履歴を削除しますか？
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            すべての計算履歴を削除します。この操作は取り消せません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClearAllCancel}>キャンセル</Button>
          <Button onClick={handleClearAllConfirm} color="error" variant="contained">
            全削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};