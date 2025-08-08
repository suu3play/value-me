import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SalaryCalculator from './components/SalaryCalculator';
import type { SalaryCalculationData } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';

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
    
    const localStorage = useLocalStorage(initialData);

    // LocalStorageからの復元
    useEffect(() => {
        if (localStorage.data && localStorage.isEnabled) {
            setCalculationData(localStorage.data);
        }
    }, [localStorage.data, localStorage.isEnabled]);

    // データ変更時の自動保存（デバウンス処理）
    useEffect(() => {
        if (!localStorage.isEnabled) return;
        
        const timeoutId = window.setTimeout(() => {
            localStorage.saveData(calculationData);
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [calculationData, localStorage]);

    // データ変更時の処理
    const handleDataChange = useCallback((newData: SalaryCalculationData) => {
        setCalculationData(newData);
    }, []);

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
                        py: { xs: 1.5, sm: 2 },
                        mb: { xs: 2, sm: 3 },
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
                            }}
                        >
                            あなたの時給を正確に計算しましょう
                        </Typography>
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
                        <SalaryCalculator
                            data={calculationData}
                            onChange={handleDataChange}
                            localStorageProps={{
                                isEnabled: localStorage.isEnabled,
                                onToggleEnabled: localStorage.toggleEnabled,
                                onClearData: localStorage.clearData,
                                isSupported: localStorage.isSupported,
                            }}
                        />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
