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
  Alert,
  Divider,
} from '@mui/material';
import type { TeamMember, SalaryCalculationData, CalculationResult } from '../../types';
import SalaryCalculator from '../SalaryCalculator';

interface TeamMemberFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (memberData: {
    name: string;
    role: string;
    salaryData: SalaryCalculationData;
    notes?: string;
  }) => void;
  editingMember?: TeamMember;
  title?: string;
}

const steps = ['基本情報', '給与設定', '確認'];

const defaultSalaryData: SalaryCalculationData = {
  salaryType: 'monthly',
  salaryAmount: 300000,
  annualHolidays: 105,
  dailyWorkingHours: 8,
  workingHoursType: 'daily',
  useDynamicHolidays: true,
  holidayYear: new Date().getFullYear(),
  holidayYearType: 'calendar',
  enableBenefits: false,
  welfareAmount: 0,
  welfareType: 'monthly',
  welfareInputMethod: 'total',
  housingAllowance: 0,
  regionalAllowance: 0,
  familyAllowance: 0,
  qualificationAllowance: 0,
  otherAllowance: 0,
  summerBonus: 0,
  winterBonus: 0,
  settlementBonus: 0,
  otherBonus: 0,
  goldenWeekHolidays: true,
  obon: true,
  yearEndNewYear: true,
  customHolidays: 0,
};

export const TeamMemberForm: React.FC<TeamMemberFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingMember,
  title,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    notes: '',
  });
  const [salaryData, setSalaryData] = useState<SalaryCalculationData>(defaultSalaryData);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        role: editingMember.role,
        notes: editingMember.notes || '',
      });
      setSalaryData(editingMember.salaryData);
    } else {
      setFormData({
        name: '',
        role: '',
        notes: '',
      });
      setSalaryData(defaultSalaryData);
    }
    setActiveStep(0);
    setCalculationResult(null);
  }, [editingMember, open]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = () => {
    onSubmit({
      name: formData.name.trim(),
      role: formData.role.trim(),
      salaryData,
      notes: formData.notes.trim() || undefined,
    });
    handleClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    setFormData({ name: '', role: '', notes: '' });
    setSalaryData(defaultSalaryData);
    setCalculationResult(null);
    onClose();
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return formData.name.trim() !== '' && formData.role.trim() !== '';
      case 1:
        return calculationResult !== null;
      case 2:
        return true;
      default:
        return false;
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
              label="メンバー名"
              fullWidth
              variant="outlined"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              margin="dense"
              label="役割・職種"
              fullWidth
              variant="outlined"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              sx={{ mb: 2 }}
              required
              placeholder="例: エンジニア、デザイナー、マネージャー"
            />
            <TextField
              margin="dense"
              label="備考（任意）"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="スキルレベル、担当領域、特記事項など"
            />
          </Box>
        );
      
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              {formData.name} さんの給与設定
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              役割: {formData.role}
            </Typography>
            <SalaryCalculator
              data={salaryData}
              onChange={setSalaryData}
              onResultChange={setCalculationResult}
            />
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
                  名前: <strong>{formData.name}</strong>
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  役割: <strong>{formData.role}</strong>
                </Typography>
              </Box>
              {formData.notes && (
                <Box sx={{ mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    備考: {formData.notes}
                  </Typography>
                </Box>
              )}
            </Paper>

            {calculationResult && (
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  給与計算結果
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      時間単価
                    </Typography>
                    <Typography variant="h6">
                      ¥{calculationResult.hourlyWage.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      年収（実質）
                    </Typography>
                    <Typography variant="h6">
                      ¥{calculationResult.actualAnnualIncome.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      月収（実質）
                    </Typography>
                    <Typography variant="body2">
                      ¥{calculationResult.actualMonthlyIncome.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      年間労働時間
                    </Typography>
                    <Typography variant="body2">
                      {calculationResult.totalWorkingHours.toLocaleString()}時間
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            )}
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
      maxWidth="lg"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          height: '80vh',
        },
      }}
    >
      <DialogTitle>
        {title || (editingMember ? 'メンバー編集' : 'メンバー追加')}
      </DialogTitle>
      
      <DialogContent>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: '400px' }}>
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
            {editingMember ? '更新' : '登録'}
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