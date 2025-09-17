import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
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
import {
  History as HistoryIcon,
  Calculate as CalculateIcon,
  Compare as CompareIcon,
  Group as GroupIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import SalaryCalculator from './components/SalaryCalculator';
import ComparisonForm from './components/ComparisonForm';
import { CalculationHistory } from './components/CalculationHistory';
import ResultDisplay from './components/ResultDisplay';
import { TeamCostCalculatorV2 } from './components/teamcost/TeamCostCalculatorV2';
import { QualificationCalculator } from './components/qualification/QualificationCalculator';
import type { SalaryCalculationData, CalculationResult } from './types';
import type { CostCalculationResult } from './types/teamCost';
import type { QualificationResult } from './types/qualification';
import { useCalculationHistory } from './hooks/useCalculationHistory';
import { useComparison } from './hooks/useComparison';
import { LiveRegion } from './components/LiveRegion';
import { ScreenReaderOnly } from './components/ScreenReaderOnly';
import { appTheme } from './theme';


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
    const [liveMessage, setLiveMessage] = useState<string>('');

    // 資格計算の状態
    const [qualificationResult, setQualificationResult] = useState<QualificationResult | null>(null);

    const calculationHistory = useCalculationHistory();
    const comparison = useComparison(calculationData);

    // データ変更時の処理
    const handleDataChange = useCallback((newData: SalaryCalculationData) => {
        setCalculationData(newData);
    }, []);

    // 計算結果更新時の処理
    const handleResultChange = useCallback((result: CalculationResult) => {
        setCalculationResult(result);
        
        // スクリーンリーダー向けに計算結果を通知
        const formattedWage = new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            maximumFractionDigits: 0,
        }).format(result.hourlyWage);
        setLiveMessage(`時給が計算されました。${formattedWage}です。`);
    }, []);

    // 手動で履歴に保存する処理（デバウンス付き）をuseCallbackで最適化
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

    // 履歴からのデータ復元処理をuseCallbackで最適化
    const handleRestoreFromHistory = useCallback(
        (data: SalaryCalculationData) => {
            setCalculationData(data);
        },
        []
    );

    // 履歴ドロワーの開閉をuseCallbackで最適化
    const handleHistoryOpen = useCallback(() => setHistoryOpen(true), []);
    const handleHistoryClose = useCallback(() => setHistoryOpen(false), []);

    const [currentMode, setCurrentMode] = useState<'hourly-calculation' | 'hourly-comparison' | 'team-cost' | 'qualification'>('hourly-calculation');

    // フォーカス管理のためのref
    const mainContentRef = useRef<HTMLDivElement>(null);
    const modeToggleRef = useRef<HTMLDivElement>(null);

    // 機能モード切り替え
    const handleModeChange = useCallback((_: React.MouseEvent<HTMLElement>, newMode: 'hourly-calculation' | 'hourly-comparison' | 'team-cost' | 'qualification' | null) => {
        if (newMode !== null) {
            setCurrentMode(newMode);
            // 既存のcomparison状態も更新
            if (newMode === 'hourly-calculation') {
                comparison.setMode('single');
            } else if (newMode === 'hourly-comparison') {
                comparison.setMode('comparison');
            }
            
            // モード変更後、メインコンテンツにフォーカスを移動
            setTimeout(() => {
                if (mainContentRef.current) {
                    mainContentRef.current.focus();
                }
            }, 100);
            
            // モード変更をスクリーンリーダーに通知
            const modeNames = {
                'hourly-calculation': '時給計算',
                'hourly-comparison': '時給比較',
                'team-cost': 'チームコスト計算',
                'qualification': '資格投資計算'
            };
            setLiveMessage(`${modeNames[newMode]}モードに切り替えました。`);
        }
    }, [comparison]);

    // キーボードショートカット処理
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Alt + 数字キーでモード切り替え
            if (event.altKey && !event.ctrlKey && !event.shiftKey) {
                switch (event.key) {
                    case '1':
                        event.preventDefault();
                        setCurrentMode('hourly-calculation');
                        comparison.setMode('single');
                        break;
                    case '2':
                        event.preventDefault();
                        setCurrentMode('hourly-comparison');
                        comparison.setMode('comparison');
                        break;
                    case '3':
                        event.preventDefault();
                        setCurrentMode('team-cost');
                        break;
                    case '4':
                        event.preventDefault();
                        setCurrentMode('qualification');
                        break;
                    case 'h':
                        event.preventDefault();
                        handleHistoryOpen();
                        break;
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [comparison, handleHistoryOpen]);

    // 通貨フォーマット関数をuseMemoで最適化
    const formatCurrency = useMemo(() => (amount: number): string => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            maximumFractionDigits: 0,
        }).format(amount);
    }, []);

    // パーセンテージフォーマット関数をuseMemoで最適化
    const formatPercentage = useMemo(() => (percentage: number): string => {
        return `(${percentage.toFixed(1)}%)`;
    }, []);

    return (
        <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <Box
                component="main"
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
                {/* スキップリンク */}
                <Box
                    component="a"
                    href="#main-content"
                    sx={{
                        position: 'absolute',
                        left: '-9999px',
                        width: '1px',
                        height: '1px',
                        overflow: 'hidden',
                        '&:focus': {
                            position: 'fixed',
                            top: '10px',
                            left: '10px',
                            width: 'auto',
                            height: 'auto',
                            padding: '8px 16px',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            textDecoration: 'none',
                            borderRadius: 1,
                            zIndex: 9999,
                        },
                    }}
                >
                    メインコンテンツへスキップ
                </Box>

                {/* 固定ヘッダー */}
                <Box
                    component="header"
                    role="banner"
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
                                {currentMode === 'hourly-calculation' ? 'あなたの時給を正確に計算しましょう' :
                                 currentMode === 'hourly-comparison' ? '複数の条件で時給を比較できます' :
                                 currentMode === 'team-cost' ? 'チームの作業コストを自動計算' :
                                 '資格取得の投資効果を分析できます'}
                            </Typography>

                            {/* 機能選択ナビゲーション */}
                            <Box 
                                component="nav"
                                role="navigation"
                                aria-label="機能選択"
                                ref={modeToggleRef}
                                sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    mb: 2,
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 2, sm: 3 },
                                    alignItems: 'center'
                                }}
                            >
                                <Paper elevation={1} sx={{ p: 0.5 }}>
                                    <ToggleButtonGroup
                                        value={currentMode}
                                        exclusive
                                        onChange={handleModeChange}
                                        aria-label="機能を選択してください (Alt+1: 時給計算, Alt+2: 時給比較, Alt+3: チームコスト, Alt+4: 資格投資)"
                                        size="small"
                                    >
                                        <ToggleButton 
                                            value="hourly-calculation" 
                                            aria-label="時給計算モード Alt+1で切り替え"
                                        >
                                            <CalculateIcon sx={{ mr: 1 }} aria-hidden="true" />
                                            時給計算
                                        </ToggleButton>
                                        <ToggleButton 
                                            value="hourly-comparison" 
                                            aria-label="時給比較モード Alt+2で切り替え"
                                        >
                                            <CompareIcon sx={{ mr: 1 }} aria-hidden="true" />
                                            時給比較
                                        </ToggleButton>
                                        <ToggleButton
                                            value="team-cost"
                                            aria-label="チームコストモード Alt+3で切り替え"
                                        >
                                            <GroupIcon sx={{ mr: 1 }} aria-hidden="true" />
                                            チームコスト
                                        </ToggleButton>
                                        <ToggleButton
                                          value="qualification"
                                          aria-label="資格投資モード Alt+4で切り替え"
                                        >
                                          <SchoolIcon sx={{ mr: 1 }} aria-hidden="true" />
                                          資格投資
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Paper>
                                <Box 
                                    component="span" 
                                    sx={{ 
                                        fontSize: '0.75rem', 
                                        color: 'text.secondary',
                                        textAlign: 'center',
                                        display: { xs: 'none', md: 'block' }
                                    }}
                                    aria-label="キーボードショートカット説明"
                                >
                                    Alt+数字キーで切り替え可能
                                    <ScreenReaderOnly>
                                        キーボードショートカットを使用できます。Alt+1で時給計算、Alt+2で時給比較、Alt+3でチームコスト、Alt+4で資格投資、Alt+Hで履歴を開けます。
                                    </ScreenReaderOnly>
                                </Box>
                            </Box>
                        </Box>

                        {/* 計算結果表示 */}
                        {currentMode === 'hourly-calculation' && calculationResult && (
                            <Box
                                component="section"
                                aria-label="時給計算結果"
                                role="region"
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

                        {/* 比較結果表示 */}
                        {currentMode === 'hourly-comparison' && comparison.comparisonResult && (
                            <Box
                                component="section"
                                aria-label="時給比較結果"
                                role="region"
                                sx={{
                                    bgcolor: 'primary.main',
                                    color: 'primary.contrastText',
                                    borderRadius: 2,
                                    p: { xs: 1, sm: 2 },
                                    mb: { xs: 1, sm: 2 },
                                }}
                            >
                                {/* 比較元・比較先の時給と年収を横1行表示 */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: { xs: 2, sm: 3 },
                                    alignItems: 'stretch',
                                    textAlign: 'center'
                                }}>
                                    {/* 比較元 */}
                                    <Box sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'center',
                                        minHeight: 'auto'
                                    }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                            {comparison.comparisonResult.items[0]?.label || '比較元'}
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                            時給: {formatCurrency(comparison.comparisonResult.items[0]?.result?.hourlyWage || 0)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            年収: {formatCurrency(comparison.comparisonResult.items[0]?.result?.actualAnnualIncome || 0)}
                                        </Typography>
                                    </Box>

                                    {/* 比較先 */}
                                    <Box sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'center',
                                        minHeight: 'auto'
                                    }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                            {comparison.comparisonResult.items[1]?.label || '比較先'}
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                            時給: {formatCurrency(comparison.comparisonResult.items[1]?.result?.hourlyWage || 0)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            年収: {formatCurrency(comparison.comparisonResult.items[1]?.result?.actualAnnualIncome || 0)}
                                        </Typography>
                                    </Box>

                                    {/* 差額表示 */}
                                    <Box sx={{ 
                                        flex: 1, 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        justifyContent: 'center',
                                        minHeight: 'auto'
                                    }}>
                                        <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                                            差額
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                                            時給: {formatCurrency(comparison.comparisonResult.differences.maxHourlyWageDiff)} {formatPercentage(comparison.comparisonResult.differences.maxHourlyWageDiffPercent)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                            年収: {formatCurrency(comparison.comparisonResult.differences.maxAnnualIncomeDiff)} {formatPercentage(comparison.comparisonResult.differences.maxAnnualIncomeDiffPercent)}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                        )}

                        {/* チームコスト計算結果表示 */}
                        {currentMode === 'team-cost' && (
                            teamCostErrors.length > 0 ? (
                                <Alert 
                                    severity="warning" 
                                    sx={{ mb: { xs: 1, sm: 2 } }}
                                    role="alert"
                                    aria-live="polite"
                                >
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
                                    component="section"
                                    aria-label="チームコスト計算結果"
                                    role="region"
                                    aria-live="polite"
                                    sx={{
                                        bgcolor: 'primary.main',
                                        color: 'primary.contrastText',
                                        borderRadius: 2,
                                        p: { xs: 1, sm: 2 },
                                        mb: { xs: 1, sm: 2 },
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: { xs: 'column', md: 'row' },
                                        gap: 3,
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                年間総コスト
                                            </Typography>
                                            <Typography variant="h3" fontWeight="bold">
                                                {formatCurrency(teamCostResult.totalAnnualCost)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                月平均コスト
                                            </Typography>
                                            <Typography variant="h5">
                                                {formatCurrency(teamCostResult.totalAnnualCost / 12)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                年間作業時間: {teamCostResult.totalAnnualHours.toFixed(1)}h
                                            </Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                月平均作業時間
                                            </Typography>
                                            <Typography variant="h5">
                                                {teamCostResult.totalMonthlyHours.toFixed(1)}時間
                                            </Typography>
                                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                1時間あたり: {formatCurrency(teamCostResult.totalAnnualCost / teamCostResult.totalAnnualHours)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            ) : (
                                <Alert 
                                    severity="info" 
                                    sx={{ mb: { xs: 1, sm: 2 } }}
                                    role="status"
                                    aria-live="polite"
                                >
                                    設定を完了すると計算結果が表示されます
                                </Alert>
                            )
                        )}

                        {/* 資格計算結果表示 */}
                        {currentMode === 'qualification' && qualificationResult && (
                          <Box
                            component="section"
                            aria-label="資格投資計算結果"
                            role="region"
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'primary.contrastText',
                              borderRadius: 2,
                              p: { xs: 1, sm: 2 },
                              mb: { xs: 1, sm: 2 },
                            }}
                          >
                            {/* ROI指標表示 */}
                            <Box sx={{
                              display: 'flex',
                              flexDirection: { xs: 'column', md: 'row' },
                              gap: 3,
                              alignItems: 'center',
                              textAlign: 'center'
                            }}>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                  投資収益率 (ROI)
                                </Typography>
                                <Typography variant="h3" fontWeight="bold">
                                  {qualificationResult.roi.toFixed(1)}%
                                </Typography>
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                  回収期間
                                </Typography>
                                <Typography variant="h5">
                                  {isFinite(qualificationResult.paybackPeriod) ?
                                    `${qualificationResult.paybackPeriod.toFixed(1)}年` : '計算不可'}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                  総投資額: {formatCurrency(qualificationResult.totalInvestment)}
                                </Typography>
                              </Box>
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                  年間効果
                                </Typography>
                                <Typography variant="h5">
                                  {formatCurrency(qualificationResult.totalAnnualBenefit)}
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                  NPV: {formatCurrency(qualificationResult.npv)}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        )}
                    </Container>
                </Box>

                {/* メインコンテンツ */}
                <Container
                    component="section"
                    id="main-content"
                    ref={mainContentRef}
                    tabIndex={-1}
                    maxWidth="lg"
                    sx={{
                        flex: 1,
                        py: { xs: 1, sm: 2 },
                        px: { xs: 2, sm: 3 },
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        '&:focus': {
                            outline: 'none',
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: '100%',
                            maxWidth: { xs: '100%', sm: '1200px' },
                        }}
                    >
                        {currentMode === 'hourly-calculation' ? (
                            <SalaryCalculator
                                data={calculationData}
                                onChange={handleDataChange}
                                onResultChange={handleResultChange}
                                layout="horizontal"
                            />
                        ) : currentMode === 'hourly-comparison' ? (
                            <ComparisonForm
                                items={comparison.state.items}
                                activeItemId={comparison.state.activeItemId}
                                onAddItem={comparison.addItem}
                                onRemoveItem={comparison.removeItem}
                                onUpdateItem={comparison.updateItem}
                                onUpdateLabel={comparison.updateLabel}
                                onSetActiveItem={comparison.setActiveItem}
                                maxItems={2}
                            />
                        ) : currentMode === 'team-cost' ? (
                            <TeamCostCalculatorV2
                                onResultChange={setTeamCostResult}
                                onErrorsChange={setTeamCostErrors}
                            />
                        ) : (
                            // 資格計算モード追加
                            <QualificationCalculator
                                currentHourlyWage={calculationResult?.hourlyWage || 0}
                                onResultChange={setQualificationResult}
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
                        aria-label={`計算履歴を開く (${calculationHistory.history.length}件保存済み) Alt+Hで開けます`}
                        onClick={handleHistoryOpen}
                        title="計算履歴を開く Alt+H"
                    >
                        <HistoryIcon aria-hidden="true" />
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
                
                {/* スクリーンリーダー向けライブリージョン */}
                <LiveRegion message={liveMessage} priority="polite" />
            </Box>
        </ThemeProvider>
    );
}

export default App;
