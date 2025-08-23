import { useState, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Badge from '@mui/material/Badge';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import { 
  History as HistoryIcon,
  Calculate as CalculateIcon,
  Compare as CompareIcon,
  Group as GroupIcon,
} from '@mui/icons-material';
import SalaryCalculator from './components/SalaryCalculator';
import ComparisonForm from './components/ComparisonForm';
import ComparisonResults from './components/ComparisonResults';
import { CalculationHistory } from './components/CalculationHistory';
import ResultDisplay from './components/ResultDisplay';
import { TeamCostCalculatorV2 } from './components/teamcost/TeamCostCalculatorV2';
import type { SalaryCalculationData, CalculationResult } from './types';
import type { CostCalculationResult } from './types/teamCost';
import { useCalculationHistory } from './hooks/useCalculationHistory';
import { useComparison } from './hooks/useComparison';
import { useTeamManagement } from './hooks/useTeamManagement';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2196F3',
        },
        secondary: {
            main: '#4CAF50',
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Noto Sans JP"',
            '"Segoe UI"',
            'Roboto',
            'sans-serif',
        ].join(','),
        h4: {
            '@media (max-width:600px)': {
                fontSize: '1.75rem',
            },
        },
        subtitle1: {
            '@media (max-width:600px)': {
                fontSize: '0.9rem',
            },
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    minHeight: 44,
                    '@media (max-width:600px)': {
                        minHeight: 48,
                        fontSize: '1rem',
                        padding: '12px 16px',
                    },
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        '& .MuiInputBase-root': {
                            minHeight: 48,
                        },
                    },
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '@media (max-width:600px)': {
                        '& .MuiInputBase-root': {
                            minHeight: 48,
                        },
                    },
                },
            },
        },
    },
});

const initialData: SalaryCalculationData = {
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

function App() {
    const [calculationData, setCalculationData] =
        useState<SalaryCalculationData>(initialData);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [calculationResult, setCalculationResult] =
        useState<CalculationResult | null>(null);
    
    // チームコスト計算の状態
    const [teamCostResult, setTeamCostResult] = useState<CostCalculationResult | null>(null);
    const [teamCostErrors, setTeamCostErrors] = useState<string[]>([]);

    const calculationHistory = useCalculationHistory();
    const comparison = useComparison();

    // データ変更時の処理
    const handleDataChange = useCallback((newData: SalaryCalculationData) => {
        setCalculationData(newData);
    }, []);

    // 計算結果更新時の処理
    const handleResultChange = useCallback((result: CalculationResult) => {
        setCalculationResult(result);
    }, []);

    // 手動で履歴に保存する処理（デバウンス付き）
    const handleSaveToHistory = useCallback(async () => {
        if (calculationHistory.isSupported && !isSaving) {
            setIsSaving(true);

            try {
                const { calculateHourlyWage } = await import(
                    './utils/calculations'
                );
                const { calculateHourlyWageWithDynamicHolidays } = await import(
                    './utils/dynamicHolidayCalculations'
                );

                let result;
                try {
                    // 動的祝日計算を優先して試行
                    result = await calculateHourlyWageWithDynamicHolidays(
                        calculationData,
                        {
                            useCurrentYear: true,
                        }
                    );
                } catch (error) {
                    // フォールバック計算
                    console.warn(
                        '動的祝日計算に失敗。フォールバック計算を使用:',
                        error
                    );
                    result = calculateHourlyWage(calculationData);
                }

                if (result.hourlyWage > 0) {
                    calculationHistory.addToHistory(calculationData, result);
                    console.log('履歴に保存されました:', result.hourlyWage);
                }
            } catch (error) {
                console.error('履歴保存エラー:', error);
            } finally {
                // 500ms後にボタンを再有効化
                setTimeout(() => {
                    setIsSaving(false);
                }, 500);
            }
        }
    }, [calculationData, calculationHistory, isSaving]);

    // 履歴からのデータ復元処理
    const handleRestoreFromHistory = useCallback(
        (data: SalaryCalculationData) => {
            setCalculationData(data);
        },
        []
    );

    // 履歴ドロワーの開閉
    const handleHistoryOpen = () => setHistoryOpen(true);
    const handleHistoryClose = () => setHistoryOpen(false);

    const [currentTab, setCurrentTab] = useState<'calculation' | 'team'>('calculation');

    // モード切り替え
    const handleModeChange = useCallback((_: React.MouseEvent<HTMLElement>, newMode: 'single' | 'comparison' | null) => {
        if (newMode !== null) {
            comparison.setMode(newMode);
        }
    }, [comparison]);

    // タブ切り替え
    const handleTabChange = useCallback((_: React.MouseEvent<HTMLElement>, newTab: 'calculation' | 'team' | null) => {
        if (newTab !== null) {
            setCurrentTab(newTab);
        }
    }, []);

    // 通貨フォーマット関数
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: '100vh',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'grey.50',
                    '@media (max-height: 600px) and (orientation: landscape)': {
                        minHeight: 'auto',
                    },
                }}
            >
                {/* 固定ヘッダー */}
                <Box
                    sx={{
                        position: 'sticky',
                        top: 0,
                        zIndex: 1000,
                        bgcolor: 'white',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        width: '100%',
                    }}
                >
                    <Container
                        maxWidth="lg"
                        sx={{
                            width: '100%',
                            px: { xs: 2, sm: 3 },
                        }}
                    >
                        {/* タイトル部分 */}
                        <Box sx={{ py: { xs: 1.5, sm: 2 } }}>
                            <Typography
                                variant="h4"
                                component="h1"
                                align="center"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'primary.main',
                                    mb: { xs: 0.5, sm: 1 },
                                    fontSize: { xs: '1.75rem', sm: '2.125rem' },
                                }}
                            >
                                Value-me
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="p"
                                align="center"
                                color="textSecondary"
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem' },
                                    mb: 2,
                                }}
                            >
                                {currentTab === 'calculation' ? 'あなたの時給を正確に計算しましょう' : 'チームの作業コストを自動計算'}
                            </Typography>

                            {/* タブ切り替えボタン */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Paper elevation={1} sx={{ p: 0.5 }}>
                                    <ToggleButtonGroup
                                        value={currentTab}
                                        exclusive
                                        onChange={handleTabChange}
                                        aria-label="main tab"
                                        size="small"
                                    >
                                        <ToggleButton value="calculation" aria-label="calculation tab">
                                            <CalculateIcon sx={{ mr: 1 }} />
                                            計算
                                        </ToggleButton>
                                        <ToggleButton value="team" aria-label="team tab">
                                            <GroupIcon sx={{ mr: 1 }} />
                                            チームコスト
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Paper>
                            </Box>

                            {/* 計算モード切り替えボタン（計算タブのみ） */}
                            {currentTab === 'calculation' && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                    <Paper elevation={1} sx={{ p: 0.5 }}>
                                        <ToggleButtonGroup
                                            value={comparison.state.mode}
                                            exclusive
                                            onChange={handleModeChange}
                                            aria-label="calculation mode"
                                            size="small"
                                        >
                                            <ToggleButton value="single" aria-label="single calculation">
                                                <CalculateIcon sx={{ mr: 1 }} />
                                                単一計算
                                            </ToggleButton>
                                            <ToggleButton value="comparison" aria-label="comparison mode">
                                                <CompareIcon sx={{ mr: 1 }} />
                                                条件比較
                                            </ToggleButton>
                                        </ToggleButtonGroup>
                                    </Paper>
                                </Box>
                            )}
                        </Box>

                        {/* 計算結果表示 */}
                        {currentTab === 'calculation' && comparison.state.mode === 'single' && calculationResult && (
                            <Box
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    borderRadius: 2,
                                    p: { xs: 1, sm: 2 },
                                    mb: { xs: 1, sm: 2 },
                                }}
                            >
                                <ResultDisplay
                                    result={calculationResult}
                                    onSaveToHistory={handleSaveToHistory}
                                    isSaving={isSaving}
                                />
                            </Box>
                        )}

                        {/* チームコスト計算結果表示 */}
                        {currentTab === 'team' && (
                            teamCostErrors.length > 0 ? (
                                <Alert severity="warning" sx={{ mb: { xs: 1, sm: 2 } }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        設定を完了してください:
                                    </Typography>
                                    <ul style={{ margin: 0, paddingLeft: '1.2em' }}>
                                        {teamCostErrors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            ) : teamCostResult ? (
                                <Box
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        borderRadius: 2,
                                        p: { xs: 1, sm: 2 },
                                        mb: { xs: 1, sm: 2 },
                                    }}
                                >
                                    <Grid container spacing={3} alignItems="center">
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                年間総コスト
                                            </Typography>
                                            <Typography variant="h3" fontWeight="bold">
                                                {formatCurrency(teamCostResult.totalAnnualCost)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                月平均コスト
                                            </Typography>
                                            <Typography variant="h5">
                                                {formatCurrency(teamCostResult.totalAnnualCost / 12)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                年間作業時間: {teamCostResult.totalAnnualHours.toFixed(1)}h
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                月平均作業時間
                                            </Typography>
                                            <Typography variant="h5">
                                                {teamCostResult.totalMonthlyHours.toFixed(1)}時間
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                1時間あたり: {formatCurrency(teamCostResult.totalAnnualCost / teamCostResult.totalAnnualHours)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ) : (
                                <Alert severity="info" sx={{ mb: { xs: 1, sm: 2 } }}>
                                    設定を完了すると計算結果が表示されます
                                </Alert>
                            )
                        )}
                    </Container>
                </Box>

                {/* メインコンテンツ */}
                <Container
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        py: { xs: 1, sm: 2 },
                        px: { xs: 2, sm: 3 },
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '1200px' },
                        }}
                    >
                        {currentTab === 'calculation' ? (
                            comparison.state.mode === 'single' ? (
                                <SalaryCalculator
                                    data={calculationData}
                                    onChange={handleDataChange}
                                    onResultChange={handleResultChange}
                                />
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                    <ComparisonForm
                                        items={comparison.state.items}
                                        activeItemId={comparison.state.activeItemId}
                                        onAddItem={comparison.addItem}
                                        onRemoveItem={comparison.removeItem}
                                        onUpdateItem={comparison.updateItem}
                                        onUpdateLabel={comparison.updateLabel}
                                        onSetActiveItem={comparison.setActiveItem}
                                        maxItems={3}
                                    />
                                    <ComparisonResults
                                        comparisonResult={comparison.comparisonResult}
                                        loading={comparison.isCalculating}
                                    />
                                </Box>
                            )
                        ) : (
                            <TeamCostCalculatorV2 
                                onResultChange={setTeamCostResult}
                                onErrorsChange={setTeamCostErrors}
                            />
                        )}
                    </Box>
                </Container>

                {/* 履歴表示FAB */}
                <Badge
                    badgeContent={calculationHistory.history.length}
                    color="secondary"
                    max={99}
                    sx={{
                        position: 'fixed',
                        bottom: { xs: 16, sm: 24 },
                        right: { xs: 16, sm: 24 },
                        zIndex: 1000,
                    }}
                >
                    <Fab
                        color="primary"
                        aria-label="calculation history"
                        onClick={handleHistoryOpen}
                    >
                        <HistoryIcon />
                    </Fab>
                </Badge>

                {/* 履歴ドロワー */}
                <CalculationHistory
                    open={historyOpen}
                    onClose={handleHistoryClose}
                    onRestoreData={handleRestoreFromHistory}
                    history={calculationHistory.history}
                    onRemoveFromHistory={calculationHistory.removeFromHistory}
                    onClearHistory={calculationHistory.clearHistory}
                    isSupported={calculationHistory.isSupported}
                />
            </Box>
        </ThemeProvider>
    );
}

export default App;
