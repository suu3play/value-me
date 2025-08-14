import React from 'react';
import { Typography, Box, Divider, Button } from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
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
                    あなたの時給
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(result.hourlyWage)}
                </Typography>
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
                        <Typography variant="caption">実質年収</Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.7rem',
                            }}
                        >
                            （
                            {Math.round(
                                (result.actualAnnualIncome / 100000) * 10
                            )}
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
                                {formatCurrency(result.actualAnnualIncome)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ minWidth: { xs: 70, sm: 120 }, flex: 1 }}>
                        <Typography variant="caption">実質月収</Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: '0.7rem',
                            }}
                        >
                            （
                            {Math.round(
                                (result.actualMonthlyIncome / 10000) * 10
                            ) / 10}
                            万円）
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                fontSize: { xs: '0.9rem', sm: '1.3rem' },
                            }}
                        >
                            {formatCurrency(result.actualMonthlyIncome)}
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
        </Box>
    );
};

export default ResultDisplay;
