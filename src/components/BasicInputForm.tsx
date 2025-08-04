import React from 'react';
import {
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Button,
    Box,
    Checkbox,
    FormControlLabel,
    TextField,
    IconButton,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import type { SalaryCalculationData, HolidayShortcut } from '../types';
import YearSelector from './YearSelector';
import { useHolidayCount } from '../hooks/useHolidayCount';

interface BasicInputFormProps {
    data: SalaryCalculationData;
    onChange: (data: SalaryCalculationData) => void;
}

const BasicInputForm: React.FC<BasicInputFormProps> = ({ data, onChange }) => {
    const { holidayTypeCount, loading } = useHolidayCount(data);

    const getHolidayShortcuts = (): HolidayShortcut[] => {
        if (data.useDynamicHolidays && holidayTypeCount) {
            return [
                { 
                    label: '週休二日制（土日）', 
                    days: holidayTypeCount.weeklyTwoDay,
                    description: '基本土日休み、月1回土日出勤、祝日は出勤'
                },
                { 
                    label: '週休二日制（土日祝）', 
                    days: holidayTypeCount.weeklyTwoDayWithHolidays,
                    description: '基本土日祝休み、月1回土日出勤'
                },
                { 
                    label: '完全週休二日制（土日）', 
                    days: holidayTypeCount.fullWeekendOnly,
                    description: '完全土日休み、祝日は出勤'
                },
                { 
                    label: '完全週休二日制（土日祝）', 
                    days: holidayTypeCount.fullWeekendWithHolidays,
                    description: '完全土日祝休み'
                },
            ];
        } else {
            // フォールバック（従来の固定値）
            return [
                { label: '週休二日制（土日）', days: 97, description: '推定値' },
                { label: '週休二日制（土日祝）', days: 110, description: '推定値' },
                { label: '完全週休二日制（土日）', days: 104, description: '推定値' },
                { label: '完全週休二日制（土日祝）', days: 120, description: '推定値' },
            ];
        }
    };

    const holidayShortcuts = getHolidayShortcuts();

    // 総休日数を計算する関数
    const calculateTotalHolidays = () => {
        let total = data.annualHolidays;

        if (data.goldenWeekHolidays) {
            let gwDays = 10;
            if (data.annualHolidays === 120 || data.annualHolidays === 119) {
                gwDays = 6; // 平日のみ
            }
            if (data.annualHolidays === 119) {
                gwDays = 4; // 平日のみで祝日除外
            }
            total += gwDays;
        }

        if (data.obon) {
            total += 5;
        }

        if (data.yearEndNewYear) {
            let yearEndDays = 6;
            if (data.annualHolidays === 120 || data.annualHolidays === 119) {
                yearEndDays = 4; // 平日のみ
            }
            if (data.annualHolidays === 119) {
                yearEndDays = 3; // 平日のみで祝日除外
            }
            total += yearEndDays;
        }

        total += data.customHolidays;
        return total;
    };



    const handleSalaryTypeChange = (
        _: React.MouseEvent<HTMLElement>,
        newSalaryType: 'monthly' | 'annual' | null
    ) => {
        if (newSalaryType) {
            onChange({ ...data, salaryType: newSalaryType });
        }
    };

    const handleSalaryAmountChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(event.target.value) || 0;
        onChange({ ...data, salaryAmount: value });
    };

    const handleSalaryIncrease = () => {
        const increment = data.salaryType === 'monthly' ? 1000 : 10000;
        onChange({ ...data, salaryAmount: data.salaryAmount + increment });
    };

    const handleSalaryDecrease = () => {
        const decrement = data.salaryType === 'monthly' ? 1000 : 10000;
        const newAmount = Math.max(0, data.salaryAmount - decrement);
        onChange({ ...data, salaryAmount: newAmount });
    };

    const handleHolidaysChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(event.target.value) || 0;
        onChange({ ...data, annualHolidays: value });
    };

    const handleWorkingHoursChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseFloat(event.target.value) || 0;
        onChange({ ...data, dailyWorkingHours: value });
    };

    const handleWorkingHoursTypeChange = (
        _: React.MouseEvent<HTMLElement>,
        newType: 'daily' | 'weekly' | 'monthly' | null
    ) => {
        if (newType) {
            // 単位変更時に値を適切に変換
            let convertedHours = data.dailyWorkingHours;

            if (data.workingHoursType === 'daily' && newType === 'weekly') {
                convertedHours = data.dailyWorkingHours * 5; // 週5日勤務と仮定
            } else if (
                data.workingHoursType === 'daily' &&
                newType === 'monthly'
            ) {
                convertedHours = data.dailyWorkingHours * 22; // 月22日勤務と仮定
            } else if (
                data.workingHoursType === 'weekly' &&
                newType === 'daily'
            ) {
                convertedHours = data.dailyWorkingHours / 5;
            } else if (
                data.workingHoursType === 'weekly' &&
                newType === 'monthly'
            ) {
                convertedHours = data.dailyWorkingHours * 4.4; // 1ヶ月約4.4週
            } else if (
                data.workingHoursType === 'monthly' &&
                newType === 'daily'
            ) {
                convertedHours = data.dailyWorkingHours / 22;
            } else if (
                data.workingHoursType === 'monthly' &&
                newType === 'weekly'
            ) {
                convertedHours = data.dailyWorkingHours / 4.4;
            }

            onChange({
                ...data,
                workingHoursType: newType,
                dailyWorkingHours: Math.round(convertedHours * 10) / 10, // 小数点1桁で四捨五入
            });
        }
    };

    // 表示用の労働時間を取得
    const getDisplayWorkingHours = () => {
        switch (data.workingHoursType) {
            case 'weekly':
                return data.dailyWorkingHours;
            case 'monthly':
                return data.dailyWorkingHours;
            default:
                return data.dailyWorkingHours;
        }
    };

    // 1日あたりの労働時間を計算（計算で使用）
    const getDailyWorkingHours = () => {
        switch (data.workingHoursType) {
            case 'weekly':
                return data.dailyWorkingHours / 5; // 週5日勤務と仮定
            case 'monthly':
                return data.dailyWorkingHours / 22; // 月22日勤務と仮定
            default:
                return data.dailyWorkingHours;
        }
    };

    const handleHolidayShortcut = (days: number) => {
        onChange({ ...data, annualHolidays: days });
    };

    const handleCustomHolidayChange =
        (field: keyof SalaryCalculationData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange({ ...data, [field]: event.target.checked });
        };

    const handleCustomHolidayDaysChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(event.target.value) || 0;
        onChange({ ...data, customHolidays: value });
    };

    return (
        <Box>
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 'bold', mb: 3 }}
            >
                基本情報
            </Typography>


            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 給与種別選択 */}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        給与種別
                    </Typography>
                    <ToggleButtonGroup
                        value={data.salaryType}
                        exclusive
                        onChange={handleSalaryTypeChange}
                        aria-label="salary type"
                        fullWidth
                    >
                        <ToggleButton value="monthly" aria-label="monthly">
                            月収
                        </ToggleButton>
                        <ToggleButton value="annual" aria-label="annual">
                            年収
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* 給与額入力 */}
                <Box>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="salary-amount">
                            {data.salaryType === 'monthly' ? '月収' : '年収'}
                        </InputLabel>
                        <OutlinedInput
                            id="salary-amount"
                            type="number"
                            value={data.salaryAmount || ''}
                            onChange={handleSalaryAmountChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            mr: 1,
                                        }}
                                    >
                                        <IconButton
                                            size="small"
                                            onClick={handleSalaryIncrease}
                                            sx={{ p: 0.2, height: 20 }}
                                        >
                                            <KeyboardArrowUp fontSize="small" />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={handleSalaryDecrease}
                                            sx={{ p: 0.2, height: 20 }}
                                        >
                                            <KeyboardArrowDown fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    円
                                </InputAdornment>
                            }
                            label={
                                data.salaryType === 'monthly' ? '月収' : '年収'
                            }
                        />
                    </FormControl>
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ ml: 1, mt: 0.5 }}
                    >
                        {data.salaryType === 'monthly'
                            ? '▲▼ボタンで1,000円単位で調整'
                            : '▲▼ボタンで10,000円単位で調整'}
                    </Typography>
                </Box>

                {/* 年間休日 */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">
                            年間休日
                        </Typography>
                        <YearSelector data={data} onChange={onChange} />
                    </Box>
                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                        <InputLabel htmlFor="annual-holidays">
                            年間休日
                        </InputLabel>
                        <OutlinedInput
                            id="annual-holidays"
                            type="number"
                            value={data.annualHolidays || ''}
                            onChange={handleHolidaysChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    日
                                </InputAdornment>
                            }
                            label="年間休日"
                        />
                    </FormControl>

                    <Box
                        sx={{
                            mb: 2,
                            p: 2,
                            bgcolor: 'primary.main',
                            borderRadius: 1,
                            color: 'white',
                        }}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                fontWeight: 'bold',
                                textAlign: 'center',
                                mb: 1,
                            }}
                        >
                            総休日数: {calculateTotalHolidays()}日 
                            <Typography component="span" variant="body2" sx={{ opacity: 0.7, ml: 1 }}>
                                (基本{data.annualHolidays}日
                                {data.goldenWeekHolidays && (
                                    <>
                                        + GW{(() => {
                                            let gwDays = 10;
                                            if (data.annualHolidays === 120 || data.annualHolidays === 119) gwDays = 6;
                                            if (data.annualHolidays === 119) gwDays = 4;
                                            return gwDays;
                                        })()}日
                                    </>
                                )}
                                {data.obon && (
                                    <> + お盆5日</>
                                )}
                                {data.yearEndNewYear && (
                                    <>
                                        + 年末年始{(() => {
                                            let yearEndDays = 6;
                                            if (data.annualHolidays === 120 || data.annualHolidays === 119) yearEndDays = 4;
                                            if (data.annualHolidays === 119) yearEndDays = 3;
                                            return yearEndDays;
                                        })()}日
                                    </>
                                )}
                                {data.customHolidays > 0 && (
                                    <> + その他{data.customHolidays}日</>
                                )}
                                )
                            </Typography>
                        </Typography>
                    </Box>

                    {/* ショートカットボタン */}
                    <Box sx={{ mb: 2 }}>
                        {loading && (
                            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                休日日数を計算中...
                            </Typography>
                        )}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                            {holidayShortcuts.map((shortcut) => (
                                <Button
                                    key={shortcut.label}
                                    onClick={() =>
                                        handleHolidayShortcut(shortcut.days)
                                    }
                                    size="small"
                                    variant={
                                        data.annualHolidays === shortcut.days
                                            ? 'contained'
                                            : 'outlined'
                                    }
                                    color={
                                        data.annualHolidays === shortcut.days
                                            ? 'primary'
                                            : 'inherit'
                                    }
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        px: 1,
                                        py: 1.5,
                                        minHeight: 70,
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold', lineHeight: 1.2, fontSize: '0.8rem' }}>
                                        {shortcut.label} <span style={{ color: 'var(--mui-palette-primary-main)' }}>{shortcut.days}日</span>
                                    </Typography>
                                    {shortcut.description && (
                                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', mt: 0.5, lineHeight: 1.2 }}>
                                            {shortcut.description}
                                        </Typography>
                                    )}
                                </Button>
                            ))}
                        </Box>
                    </Box>

                    {/* カスタム休日チェックボックス */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.goldenWeekHolidays}
                                    onChange={handleCustomHolidayChange(
                                        'goldenWeekHolidays'
                                    )}
                                />
                            }
                            label="GW休み"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.obon}
                                    onChange={handleCustomHolidayChange('obon')}
                                />
                            }
                            label="お盆休み"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={data.yearEndNewYear}
                                    onChange={handleCustomHolidayChange(
                                        'yearEndNewYear'
                                    )}
                                />
                            }
                            label="年末年始"
                        />
                        <TextField
                            size="small"
                            label="その他特別休暇"
                            type="number"
                            value={data.customHolidays || ''}
                            onChange={handleCustomHolidayDaysChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        日
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ minWidth: 150 }}
                        />
                    </Box>
                </Box>

                {/* 労働時間 */}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        労働時間
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                        <ToggleButtonGroup
                            value={data.workingHoursType}
                            exclusive
                            onChange={handleWorkingHoursTypeChange}
                            aria-label="working hours type"
                            size="small"
                        >
                            <ToggleButton value="daily" aria-label="daily">
                                1日単位
                            </ToggleButton>
                            <ToggleButton value="weekly" aria-label="weekly">
                                1週単位
                            </ToggleButton>
                            <ToggleButton value="monthly" aria-label="monthly">
                                1ヶ月単位
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="working-hours">
                            {data.workingHoursType === 'daily'
                                ? '1日の労働時間'
                                : data.workingHoursType === 'weekly'
                                ? '1週の労働時間'
                                : '1ヶ月の労働時間'}
                        </InputLabel>
                        <OutlinedInput
                            id="working-hours"
                            type="number"
                            inputProps={{
                                step:
                                    data.workingHoursType === 'daily'
                                        ? '0.5'
                                        : '1',
                            }}
                            value={getDisplayWorkingHours() || ''}
                            onChange={handleWorkingHoursChange}
                            endAdornment={
                                <InputAdornment position="end">
                                    時間
                                </InputAdornment>
                            }
                            label={
                                data.workingHoursType === 'daily'
                                    ? '1日の労働時間'
                                    : data.workingHoursType === 'weekly'
                                    ? '1週の労働時間'
                                    : '1ヶ月の労働時間'
                            }
                        />
                    </FormControl>
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ ml: 1, mt: 0.5 }}
                    >
                        1日あたり: {getDailyWorkingHours().toFixed(1)}時間
                    </Typography>
                </Box>
            </Box>

        </Box>
    );
};

export default BasicInputForm;
