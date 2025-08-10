import React, { useState } from 'react';
import {
  Box,
  FormControlLabel,
  Switch,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

interface DataPersistenceSettingsProps {
  isEnabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  onClearData: () => void;
  isSupported: boolean;
}

const DataPersistenceSettings: React.FC<DataPersistenceSettingsProps> = ({
  isEnabled,
  onToggleEnabled,
  onClearData,
  isSupported,
}) => {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleEnabled(event.target.checked);
  };

  const handleClearData = () => {
    onClearData();
    setShowClearDialog(false);
  };

  if (!isSupported) {
    return (
      <Box sx={{ p: { xs: 1, sm: 1 }, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          データ保存設定
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
          お使いのブラウザはローカルストレージをサポートしていません
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: { xs: 1, sm: 1 }, border: '1px solid', borderColor: 'grey.300', borderRadius: 1, bgcolor: 'grey.50' }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          データ保存設定
        </Typography>
        
        <FormControlLabel
          control={
            <Switch
              checked={isEnabled}
              onChange={handleToggle}
              color="primary"
              size="small"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              入力データをブラウザに自動保存
            </Typography>
          }
          sx={{ m: 0, mb: 1 }}
        />

        {isEnabled && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
            <Button
              onClick={() => setShowClearDialog(true)}
              size="small"
              color="error"
              sx={{ 
                fontSize: '0.75rem',
                minHeight: 'auto',
                py: 0.5,
                px: 1,
              }}
            >
              データクリア
            </Button>
          </Box>
        )}

        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ 
            display: 'block', 
            mt: 1, 
            fontSize: '0.75rem',
            lineHeight: 1.2,
          }}
        >
          データはお使いのブラウザ内にのみ保存され、外部に送信されません
        </Typography>
      </Box>

      {/* データクリア確認ダイアログ */}
      <Dialog
        open={showClearDialog}
        onClose={() => setShowClearDialog(false)}
        aria-labelledby="clear-data-dialog-title"
        aria-describedby="clear-data-dialog-description"
      >
        <DialogTitle id="clear-data-dialog-title">
          データクリアの確認
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="clear-data-dialog-description">
            保存されているすべての入力データを削除しますか？
            この操作は取り消すことができません。
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowClearDialog(false)} color="primary">
            キャンセル
          </Button>
          <Button onClick={handleClearData} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DataPersistenceSettings;