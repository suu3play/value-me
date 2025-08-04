import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SalaryCalculator from './components/SalaryCalculator';
import type { SalaryCalculationData } from './types';

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
    },
    shape: {
        borderRadius: 12,
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
                        py: 2,
                        mb: 3,
                        width: '100%',
                    }}
                >
                    <Container maxWidth="lg" sx={{ width: '100%' }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            align="center"
                            sx={{
                                fontWeight: 'bold',
                                color: 'primary.main',
                                mb: 1,
                            }}
                        >
                            Value-me
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            component="p"
                            align="center"
                            color="textSecondary"
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
                        py: 2,
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                    }}
                >
                    <Box sx={{ width: '100%', maxWidth: '1200px' }}>
                        <SalaryCalculator
                            data={calculationData}
                            onChange={setCalculationData}
                        />
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
