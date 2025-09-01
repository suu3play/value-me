import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Card,
    CardContent,
    Chip,
    Divider,
    Alert,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Timeline as TimelineIcon,
} from '@mui/icons-material';
import type { ComparisonResult, ComparisonItem } from '../types';

interface ComparisonResultsProps {
    comparisonResult: ComparisonResult | null;
    loading?: boolean;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({
    comparisonResult,
    loading = false,
}) => {
    if (loading) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                    計算中...
                </Typography>
            </Paper>
        );
    }

    if (!comparisonResult || comparisonResult.items.length === 0) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="textSecondary">
                    比較するデータがありません
                </Typography>
            </Paper>
        );
    }

    const { items, highest, lowest, differences } = comparisonResult;

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatPercentage = (value: number): string => {
        return `${value.toFixed(1)}%`;
    };

    const getItemStatus = (
        item: ComparisonItem,
        metric: 'hourlyWage' | 'annualIncome'
    ) => {
        const isHighest = highest[metric]?.id === item.id;
        const isLowest = lowest[metric]?.id === item.id;

        if (isHighest && isLowest) return 'neutral';
        if (isHighest) return 'highest';
        if (isLowest) return 'lowest';
        return 'neutral';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'highest':
                return 'success';
            case 'lowest':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'highest':
                return <TrendingUpIcon fontSize="small" />;
            case 'lowest':
                return <TrendingDownIcon fontSize="small" />;
            default:
                return <TimelineIcon fontSize="small" />;
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'highest':
                return '最高';
            case 'lowest':
                return '最低';
            default:
                return '';
        }
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* サマリー情報 */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                >
                    <TimelineIcon color="primary" />
                    比較サマリー
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        mb: 2,
                    }}
                >
                    <Alert severity="info">
                        <Typography variant="body2">
                            <strong>時給差額:</strong>{' '}
                            {formatCurrency(differences.maxHourlyWageDiff)}
                            {differences.maxHourlyWageDiff > 0 &&
                                lowest.hourlyWage && (
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{ ml: 1 }}
                                    >
                                        (
                                        {formatPercentage(
                                            (differences.maxHourlyWageDiff /
                                                (lowest.hourlyWage.result
                                                    ?.hourlyWage || 1)) *
                                                100
                                        )}{' '}
                                        差)
                                    </Typography>
                                )}
                        </Typography>
                    </Alert>
                    <Alert severity="info">
                        <Typography variant="body2">
                            <strong>年収差額:</strong>{' '}
                            {formatCurrency(differences.maxAnnualIncomeDiff)}
                            {differences.maxAnnualIncomeDiff > 0 &&
                                lowest.annualIncome && (
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        sx={{ ml: 1 }}
                                    >
                                        (
                                        {formatPercentage(
                                            (differences.maxAnnualIncomeDiff /
                                                (lowest.annualIncome.result
                                                    ?.actualAnnualIncome ||
                                                    1)) *
                                                100
                                        )}{' '}
                                        差)
                                    </Typography>
                                )}
                        </Typography>
                    </Alert>
                </Box>
            </Paper>

            {/* 詳細比較結果 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {items.map((item) => {
                    if (!item.result) return null;

                    const hourlyWageStatus = getItemStatus(item, 'hourlyWage');
                    const annualIncomeStatus = getItemStatus(
                        item,
                        'annualIncome'
                    );

                    return (
                        <Card
                            key={item.id}
                            elevation={2}
                            sx={{
                                width: '100%',
                                border: hourlyWageStatus === 'highest' ? 2 : 1,
                                borderColor:
                                    hourlyWageStatus === 'highest'
                                        ? 'success.main'
                                        : 'divider',
                                bgcolor:
                                    hourlyWageStatus === 'highest'
                                        ? 'success.light'
                                        : 'background.paper',
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            <CardContent>
                                {/* ヘッダー */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        mb: 3,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="h3"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {item.label}
                                    </Typography>
                                    {hourlyWageStatus !== 'neutral' && (
                                        <Chip
                                            icon={getStatusIcon(
                                                hourlyWageStatus
                                            )}
                                            label={getStatusLabel(
                                                hourlyWageStatus
                                            )}
                                            color={
                                                getStatusColor(
                                                    hourlyWageStatus
                                                ) as
                                                    | 'default'
                                                    | 'primary'
                                                    | 'secondary'
                                                    | 'error'
                                                    | 'info'
                                                    | 'success'
                                                    | 'warning'
                                            }
                                            size="small"
                                        />
                                    )}
                                </Box>

                                {/* メイン情報を縦並びで表示 */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 3,
                                        mb: 3,
                                    }}
                                >
                                    {/* 時給 */}
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            時給
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 'bold',
                                                color:
                                                    hourlyWageStatus ===
                                                    'highest'
                                                        ? 'success.main'
                                                        : hourlyWageStatus ===
                                                          'lowest'
                                                        ? 'error.main'
                                                        : 'text.primary',
                                            }}
                                        >
                                            {formatCurrency(
                                                item.result.hourlyWage
                                            )}
                                        </Typography>
                                    </Box>

                                    {/* 年収 */}
                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                            gutterBottom
                                        >
                                            実質年収
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 'bold',
                                                color:
                                                    annualIncomeStatus ===
                                                    'highest'
                                                        ? 'success.main'
                                                        : annualIncomeStatus ===
                                                          'lowest'
                                                        ? 'error.main'
                                                        : 'text.primary',
                                            }}
                                        >
                                            {formatCurrency(
                                                item.result.actualAnnualIncome
                                            )}
                                        </Typography>
                                        {annualIncomeStatus !== 'neutral' && (
                                            <Chip
                                                icon={getStatusIcon(
                                                    annualIncomeStatus
                                                )}
                                                label={getStatusLabel(
                                                    annualIncomeStatus
                                                )}
                                                color={
                                                    getStatusColor(
                                                        annualIncomeStatus
                                                    ) as
                                                        | 'default'
                                                        | 'primary'
                                                        | 'secondary'
                                                        | 'error'
                                                        | 'info'
                                                        | 'success'
                                                        | 'warning'
                                                }
                                                size="small"
                                                sx={{ mt: 0.5 }}
                                            />
                                        )}
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 2 }} />

                                {/* 詳細情報を縦並びで表示 */}
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 2,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            月収
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 'medium' }}
                                        >
                                            {formatCurrency(
                                                item.result.actualMonthlyIncome
                                            )}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            年間労働時間
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 'medium' }}
                                        >
                                            {item.result.totalWorkingHours.toLocaleString()}
                                            時間
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            color="textSecondary"
                                        >
                                            年間休日
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ fontWeight: 'medium' }}
                                        >
                                            {item.result.totalAnnualHolidays}日
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    );
                })}
            </Box>

            {/* 比較が1件のみの場合の注意 */}
            {items.length === 1 && (
                <Alert severity="info" sx={{ mt: 3 }}>
                    複数の条件を追加すると、より詳細な比較ができます。
                </Alert>
            )}
        </Box>
    );
};

export default ComparisonResults;
