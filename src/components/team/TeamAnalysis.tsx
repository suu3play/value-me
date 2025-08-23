import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Stack,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  CompareArrows as CompareArrowsIcon,
} from '@mui/icons-material';
import { useTeamManagement } from '../../hooks/useTeamManagement';
import { useTeamAnalysis } from '../../hooks/useTeamAnalysis';
import type { CostCalculationMethod } from '../../types';

interface TeamAnalysisProps {
  teamId: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analysis-tabpanel-${index}`}
      aria-labelledby={`analysis-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const TeamAnalysis: React.FC<TeamAnalysisProps> = ({ teamId }) => {
  const { getTeamById, getActiveMembers } = useTeamManagement();
  const { calculateTeamCost, calculateMemberCost } = useTeamAnalysis();

  const [selectedMethod, setSelectedMethod] = useState<CostCalculationMethod>('average');
  const [tabValue, setTabValue] = useState(0);

  const team = getTeamById(teamId);
  const activeMembers = team ? getActiveMembers(teamId) : [];

  const teamCostCalculations = useMemo(() => {
    if (!team || activeMembers.length === 0) return null;

    const methods: CostCalculationMethod[] = ['average', 'individual', 'byRole'];
    const calculations = methods.map(method => ({
      method,
      result: calculateTeamCost(teamId, method),
    }));

    return calculations;
  }, [team, activeMembers, teamId, calculateTeamCost]);

  const memberCostDetails = useMemo(() => {
    return activeMembers.map(member => ({
      member,
      cost: calculateMemberCost(member),
    }));
  }, [activeMembers, calculateMemberCost]);

  const roleStats = useMemo(() => {
    const roleMap = new Map<string, {
      count: number;
      totalHourlyCost: number;
      totalMonthlyCost: number;
      totalAnnualCost: number;
      members: typeof memberCostDetails;
    }>();

    memberCostDetails.forEach(({ member, cost }) => {
      const role = member.role;
      if (!roleMap.has(role)) {
        roleMap.set(role, {
          count: 0,
          totalHourlyCost: 0,
          totalMonthlyCost: 0,
          totalAnnualCost: 0,
          members: [],
        });
      }

      const roleData = roleMap.get(role)!;
      roleData.count += 1;
      roleData.totalHourlyCost += cost.hourlyWage;
      roleData.totalMonthlyCost += cost.actualMonthlyIncome;
      roleData.totalAnnualCost += cost.actualAnnualIncome;
      roleData.members.push({ member, cost });
    });

    return Array.from(roleMap.entries()).map(([role, data]) => ({
      role,
      ...data,
      averageHourlyCost: data.totalHourlyCost / data.count,
      averageMonthlyCost: data.totalMonthlyCost / data.count,
      averageAnnualCost: data.totalAnnualCost / data.count,
    }));
  }, [memberCostDetails]);

  if (!team) {
    return (
      <Alert severity="error">
        チームが見つかりません
      </Alert>
    );
  }

  if (activeMembers.length === 0) {
    return (
      <Alert severity="warning">
        アクティブなメンバーがいないため、分析を実行できません。
      </Alert>
    );
  }

  const selectedCalculation = teamCostCalculations?.find(calc => calc.method === selectedMethod)?.result;

  const getMethodLabel = (method: CostCalculationMethod): string => {
    switch (method) {
      case 'average': return '平均コスト';
      case 'individual': return '個別積算';
      case 'byRole': return '役割別';
      default: return method;
    }
  };

  const getMethodDescription = (method: CostCalculationMethod): string => {
    switch (method) {
      case 'average': return 'メンバーの平均時間単価を使用';
      case 'individual': return '各メンバーの個別単価を積算';
      case 'byRole': return '役割ごとの平均単価を使用';
      default: return '';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {team.name} - 分析・レポート
        </Typography>
        <Typography variant="body2" color="text.secondary">
          チームコスト分析と効率性レポート
        </Typography>
      </Box>

      {/* Analysis Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
          <Tab 
            label="コスト比較分析" 
            icon={<CompareArrowsIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="メンバー詳細" 
            icon={<PeopleIcon />} 
            iconPosition="start"
          />
          <Tab 
            label="役割別統計" 
            icon={<AssessmentIcon />} 
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Tab 1: Cost Comparison Analysis */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Method Selection */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>計算方法</InputLabel>
              <Select
                value={selectedMethod}
                label="計算方法"
                onChange={(e) => setSelectedMethod(e.target.value as CostCalculationMethod)}
              >
                {teamCostCalculations?.map(calc => (
                  <MenuItem key={calc.method} value={calc.method}>
                    {getMethodLabel(calc.method)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedCalculation && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {getMethodDescription(selectedMethod)}
              </Typography>
            )}
          </Grid>

          {/* Current Method Results */}
          {selectedCalculation && (
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon sx={{ mr: 1 }} />
                    {getMethodLabel(selectedMethod)} - 結果
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        時間単価
                      </Typography>
                      <Typography variant="h5">
                        ¥{selectedCalculation.totalHourlyCost.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        月額コスト
                      </Typography>
                      <Typography variant="h5">
                        ¥{selectedCalculation.totalMonthlyCost.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        年額コスト
                      </Typography>
                      <Typography variant="h5">
                        ¥{selectedCalculation.totalAnnualCost.toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Comparison Table */}
          <Grid item xs={12}>
            <Paper>
              <Typography variant="h6" sx={{ p: 2 }}>
                計算方法別比較
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>計算方法</TableCell>
                      <TableCell align="right">時間単価</TableCell>
                      <TableCell align="right">月額コスト</TableCell>
                      <TableCell align="right">年額コスト</TableCell>
                      <TableCell>説明</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamCostCalculations?.map((calc) => (
                      <TableRow 
                        key={calc.method}
                        sx={{ 
                          backgroundColor: calc.method === selectedMethod ? 'action.selected' : 'inherit'
                        }}
                      >
                        <TableCell>
                          <Chip 
                            label={getMethodLabel(calc.method)}
                            color={calc.method === selectedMethod ? 'primary' : 'default'}
                            variant={calc.method === selectedMethod ? 'filled' : 'outlined'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          ¥{calc.result.totalHourlyCost.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ¥{calc.result.totalMonthlyCost.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          ¥{calc.result.totalAnnualCost.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {getMethodDescription(calc.method)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          {/* Cost Optimization Suggestions */}
          <Grid item xs={12}>
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                コスト最適化の提案
              </Typography>
              <Typography variant="body2">
                • 個別積算方式が最も正確なコスト算出を提供します<br />
                • 役割別方式は大まかな予算策定に適しています<br />
                • 平均コスト方式は簡易的な見積もりに便利です
              </Typography>
            </Alert>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Tab 2: Member Details */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>メンバー名</TableCell>
                <TableCell>役割</TableCell>
                <TableCell align="right">時間単価</TableCell>
                <TableCell align="right">月収</TableCell>
                <TableCell align="right">年収</TableCell>
                <TableCell align="right">年間労働時間</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {memberCostDetails.map(({ member, cost }) => (
                <TableRow key={member.id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>
                    <Chip label={member.role} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">
                    ¥{cost.hourlyWage.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ¥{cost.actualMonthlyIncome.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    ¥{cost.actualAnnualIncome.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {cost.totalWorkingHours.toLocaleString()}時間
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Tab 3: Role Statistics */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {roleStats.map((roleStat) => (
            <Grid item xs={12} md={6} key={roleStat.role}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {roleStat.role}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      メンバー数
                    </Typography>
                    <Typography variant="body1">
                      {roleStat.count} 名
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    平均コスト
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        時間単価
                      </Typography>
                      <Typography variant="body1">
                        ¥{Math.round(roleStat.averageHourlyCost).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        月収
                      </Typography>
                      <Typography variant="body1">
                        ¥{Math.round(roleStat.averageMonthlyCost).toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        年収
                      </Typography>
                      <Typography variant="body1">
                        ¥{Math.round(roleStat.averageAnnualCost).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    合計コスト
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    年額: ¥{roleStat.totalAnnualCost.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>
    </Box>
  );
};