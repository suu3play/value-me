import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider,
  Stack,
} from '@mui/material';
import {
  Calculate as CalculateIcon,
} from '@mui/icons-material';
import { MemberSalaryManager } from './MemberSalaryManager';
import type { TeamCostData, CostCalculationResult } from '../../types/teamCost';
import { 
  calculateTeamCost, 
  createDefaultTeamCostData, 
  validateTeamCostData 
} from '../../utils/teamCostCalculations';

export const TeamCostCalculator: React.FC = () => {
  const [teamData, setTeamData] = useState<TeamCostData>(createDefaultTeamCostData());
  const [result, setResult] = useState<CostCalculationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const validationErrors = validateTeamCostData(teamData);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      try {
        const calculationResult = calculateTeamCost(teamData);
        setResult(calculationResult);
      } catch {
        setResult(null);
      }
    } else {
      setResult(null);
    }

    // データ保存（ローカルストレージ）
    try {
      localStorage.setItem('team-cost-data', JSON.stringify(teamData));
    } catch (error) {
      console.warn('データの保存に失敗しました:', error);
    }
  }, [teamData]);

  // 初期データ読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem('team-cost-data');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setTeamData({
          ...createDefaultTeamCostData(),
          ...parsedData,
        });
      }
    } catch (error) {
      console.warn('データの読み込みに失敗しました:', error);
    }
  }, []);

  const updateTeamData = (updates: Partial<TeamCostData>) => {
    setTeamData(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          チームコスト計算
        </Typography>
        <Typography variant="body1" color="text.secondary">
          メンバー構成、作業項目、給与設定から作業コストを自動計算します
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* 設定エリア */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            {/* メンバー構成・給与設定 */}
            <MemberSalaryManager
              positions={teamData.positions}
              salaryData={teamData.salaryData}
              onPositionsChange={(positions) => updateTeamData({ positions })}
              onSalaryChange={(salaryData) => updateTeamData({ salaryData })}
            />
          </Stack>
        </Grid>

        {/* 結果表示エリア */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ position: 'sticky', top: 24 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalculateIcon sx={{ mr: 1 }} />
                  計算結果
                </Typography>

                {errors.length > 0 ? (
                  <Alert severity="warning">
                    <Typography variant="subtitle2" gutterBottom>
                      設定を完了してください:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </Alert>
                ) : result ? (
                  <Box>
                    {/* 総コスト */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" color="text.secondary">
                        年間総コスト
                      </Typography>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {formatCurrency(result.totalAnnualCost)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        月平均: {formatCurrency(result.totalAnnualCost / 12)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* 時間統計 */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        作業時間統計
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid size={6}>
                          <Typography variant="body2" color="text.secondary">
                            年間総時間
                          </Typography>
                          <Typography variant="h6">
                            {result.totalAnnualHours.toFixed(1)}h
                          </Typography>
                        </Grid>
                        <Grid size={6}>
                          <Typography variant="body2" color="text.secondary">
                            月平均時間
                          </Typography>
                          <Typography variant="h6">
                            {result.totalMonthlyHours.toFixed(1)}h
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* 役職別内訳 */}
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        役職別給与
                      </Typography>
                      <Stack spacing={1}>
                        {result.positionBreakdown.map((position) => (
                          <Box key={position.positionName} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="body2">
                                {position.positionName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {position.count}名 × {Math.round(position.hourlyRate).toLocaleString()}円/h
                              </Typography>
                            </Box>
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(position.totalAnnualSalary)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                ) : (
                  <Alert severity="info">
                    設定を完了すると計算結果が表示されます
                  </Alert>
                )}
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};