import React from 'react';
import { Typography, Box, Divider, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { Save as SaveIcon, ExpandMore as ExpandMoreIcon, BusinessCenter as BusinessCenterIcon } from '@mui/icons-material';
import type { CalculationResult } from '../types';
import { formatCurrency, formatNumber } from '../utils/calculations';

interface ResultDisplayProps {
    result: CalculationResult;
    onSaveToHistory?: () => void;
    isSaving?: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({
    result,
    onSaveToHistory,
    isSaving = false,
}) => {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexWrap: 'wrap',
            }}
        >
            {/* 時給表示 */}
            <Box sx={{ textAlign: 'center', minWidth: 200 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    {result.socialInsurance ? '総人件費ベースの時給' : 'あなたの時給'}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {result.socialInsurance 
                        ? formatCurrency(Math.round((result.socialInsurance.totalLaborCost * 12) / result.totalWorkingHours))
                        : formatCurrency(result.hourlyWage)
                    }
                </Typography>
                {result.socialInsurance && (
                    <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                        給与のみ: {formatCurrency(result.hourlyWage)}
                    </Typography>
                )}
            </Box>

            <Divider
                orientation="vertical"
                flexItem
                sx={{ borderColor: 'rgba(255, 255, 255, 0.3)' }}
            />

            {/* 内訳 */}
            <Box sx={{ flex: 1, minWidth: 300 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                >
                    内訳
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                        gap: { xs: 1, sm: 2 },
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <Box sx={{ minWidth: { xs: 80, sm: 120 }, flex: 1 }}>
                        <Typography variant="caption">
                            {result.socialInsurance ? '総人件費（年間）' : '実質年収'}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.7rem',
                            }}
                        >
                            （
                            {result.socialInsurance
                                ? Math.round((result.socialInsurance.totalLaborCost * 12 / 100000) * 10)
                                : Math.round((result.actualAnnualIncome / 100000) * 10)
                            }
                            万円）
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'baseline',
                                gap: 1,
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 'bold',
                                    fontSize: { xs: '0.9rem', sm: '1.3rem' },
                                }}
                            >
                                {result.socialInsurance
                                    ? formatCurrency(result.socialInsurance.totalLaborCost * 12)
                                    : formatCurrency(result.actualAnnualIncome)
                                }
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ minWidth: { xs: 70, sm: 120 }, flex: 1 }}>
                        <Typography variant="caption">
                            {result.socialInsurance ? '総人件費（月間）' : '実質月収'}
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.7rem',
                            }}
                        >
                            （
                            {result.socialInsurance
                                ? Math.round((result.socialInsurance.totalLaborCost / 10000) * 10) / 10
                                : Math.round((result.actualMonthlyIncome / 10000) * 10) / 10
                            }
                            万円）
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '0.9rem', sm: '1.3rem' },
                            }}
                        >
                            {result.socialInsurance
                                ? formatCurrency(result.socialInsurance.totalLaborCost)
                                : formatCurrency(result.actualMonthlyIncome)
                            }
                        </Typography>
                    </Box>

                    <Box sx={{ minWidth: { xs: 70, sm: 120 }, flex: 1 }}>
                        <Typography variant="caption">年間労働時間</Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '0.9rem', sm: '1.3rem' },
                            }}
                        >
                            {formatNumber(result.totalWorkingHours)}時間
                        </Typography>
                    </Box>

                    <Box sx={{ minWidth: { xs: 60, sm: 100 }, flex: 1 }}>
                        <Typography variant="caption">年間休日</Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '0.9rem', sm: '1.3rem' },
                            }}
                        >
                            {formatNumber(result.totalAnnualHolidays)}日
                        </Typography>
                    </Box>

                    {/* 保存ボタン */}
                    {result.hourlyWage > 0 && onSaveToHistory && (
                        <Box
                            sx={{
                                minWidth: { xs: 80, sm: 120 },
                                flexShrink: 0,
                            }}
                        >
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<SaveIcon />}
                                onClick={onSaveToHistory}
                                disabled={isSaving}
                                sx={{
                                    backgroundColor: isSaving
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(255, 255, 255, 0.15)',
                                    color: 'inherit',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                                    border: '1px solid rgba(255, 255, 255, 0.3)',
                                    '&:hover:not(:disabled)': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.25)',
                                        boxShadow:
                                            '0 4px 12px rgba(0, 0, 0, 0.2)',
                                        transform: 'translateY(-1px)',
                                    },
                                    '&:disabled': {
                                        color: 'rgba(255, 255, 255, 0.5)',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                }}
                            >
                                {isSaving ? '保存中...' : '履歴に保存'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>

            {result.hourlyWage === 0 && (
                <Box
                    sx={{
                        ml: 'auto',
                        p: 1.5,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 1,
                    }}
                >
                    <Typography variant="body2">
                        給与額と労働時間を入力してください
                    </Typography>
                </Box>
            )}

            {/* 社会保障費表示 */}
            {result.socialInsurance && (
                <Box sx={{ width: '100%', mt: 2 }}>
                    <Accordion 
                        sx={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            '&:before': { display: 'none' },
                            boxShadow: 'none',
                            borderRadius: '8px !important',
                        }}
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon sx={{ color: 'inherit' }} />}
                            aria-controls="social-insurance-content"
                            id="social-insurance-header"
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <BusinessCenterIcon sx={{ fontSize: '1.2rem' }} />
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    社会保障費詳細
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 2, opacity: 0.8 }}>
                                    総人件費: {formatCurrency(result.socialInsurance.totalLaborCost)}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {/* 概要表示 */}
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-around',
                                    textAlign: 'center',
                                    mb: 2,
                                    flexWrap: 'wrap',
                                    gap: 2
                                }}>
                                    <Box>
                                        <Typography variant="caption">従業員負担</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                                            {formatCurrency(result.socialInsurance.totalEmployeeContribution)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption">会社負担</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                                            {formatCurrency(result.socialInsurance.totalEmployerContribution)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption">合計</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                            {formatCurrency(result.socialInsurance.totalContribution)}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* 詳細内訳 */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                    {/* 健康保険 */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            健康保険 ({result.socialInsurance.healthInsurance.rate.toFixed(2)}%)
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#ff9800' }}>
                                                従業員: {formatCurrency(result.socialInsurance.healthInsurance.employeeContribution)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#4caf50' }}>
                                                会社: {formatCurrency(result.socialInsurance.healthInsurance.employerContribution)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* 厚生年金 */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            厚生年金 ({result.socialInsurance.pensionInsurance.rate.toFixed(2)}%)
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#ff9800' }}>
                                                従業員: {formatCurrency(result.socialInsurance.pensionInsurance.employeeContribution)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#4caf50' }}>
                                                会社: {formatCurrency(result.socialInsurance.pensionInsurance.employerContribution)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* 雇用保険 */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            雇用保険 ({result.socialInsurance.employmentInsurance.employeeRate.toFixed(2)}% / {result.socialInsurance.employmentInsurance.employerRate.toFixed(2)}%)
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#ff9800' }}>
                                                従業員: {formatCurrency(result.socialInsurance.employmentInsurance.employeeContribution)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#4caf50' }}>
                                                会社: {formatCurrency(result.socialInsurance.employmentInsurance.employerContribution)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* 労災保険 */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            労災保険 ({result.socialInsurance.workersCompensation.rate.toFixed(2)}%)
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                従業員: -
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#4caf50' }}>
                                                会社: {formatCurrency(result.socialInsurance.workersCompensation.employerContribution)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* 住民税 */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                            住民税 ({result.socialInsurance.residentTax.rate.toFixed(1)}% + 均等割)
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Typography variant="body2" sx={{ color: '#ff9800' }}>
                                                従業員: {formatCurrency(result.socialInsurance.residentTax.employeeContribution)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                会社: -
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', my: 1 }} />
                                
                                <Typography variant="caption" sx={{ opacity: 0.8, textAlign: 'center' }}>
                                    ※ 社会保険料は標準報酬月額に基づいて計算されます。実際の料率は加入組合や業種により異なる場合があります。
                                </Typography>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>
            )}
        </Box>
    );
};

export default ResultDisplay;
