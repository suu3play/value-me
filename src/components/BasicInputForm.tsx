import React from 'react';
import {
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Button,
    Box,
    Checkbox,
    FormControlLabel,
} from '@mui/material';
import type { SalaryCalculationData, HolidayShortcut } from '../types';
import YearSelector from './YearSelector';
import { useHolidayCount } from '../hooks/useHolidayCount';
import ValidatedInput from './ValidatedInput';
import {
    validateSalary,
    validateHolidays,
    validateWorkingHours,
    validateCustomHolidays,
} from '../utils/validation';

interface BasicInputFormProps {
    data: SalaryCalculationData;
    onChange: (data: SalaryCalculationData) => void;
}

const BasicInputForm: React.FC<BasicInputFormProps> = React.memo(({ data, onChange }) => {
    const { holidayTypeCount, loading } = useHolidayCount(data);

    // 固定残業代から残業時間を逆算する関数
    const calculateOvertimeHoursFromFixedPay = (): number => {
        if (!data.fixedOvertimePay || data.fixedOvertimePay <= 0) {
            return 0;
        }

        const baseSalary = data.baseSalary || data.salaryAmount || 0;
        if (baseSalary <= 0) {
            return 0;
        }

        // 年間休日の計算
        let totalAnnualHolidays = data.annualHolidays;
        if (data.goldenWeekHolidays) {
            let gwDays = 10;
            if (data.annualHolidays === 120 || data.annualHolidays === 119) gwDays = 6;
            if (data.annualHolidays === 119) gwDays = 4;
            totalAnnualHolidays += gwDays;
        }
        if (data.obon) totalAnnualHolidays += 5;
        if (data.yearEndNewYear) {
            let yearEndDays = 6;
            if (data.annualHolidays === 120 || data.annualHolidays === 119) yearEndDays = 4;
            if (data.annualHolidays === 119) yearEndDays = 3;
            totalAnnualHolidays += yearEndDays;
        }
        totalAnnualHolidays += data.customHolidays;

        const workingDays = 365 - totalAnnualHolidays;
        const monthlyAverageWorkingDays = workingDays / 12;

        // 1日あたりの労働時間を取得
        let actualDailyWorkingHours = data.dailyWorkingHours;
        switch (data.workingHoursType) {
            case 'weekly':
                actualDailyWorkingHours = data.dailyWorkingHours / 5;
                break;
            case 'monthly':
                actualDailyWorkingHours = data.dailyWorkingHours / 22;
                break;
        }

        // 基本時給の計算
        const monthlyBaseWorkingHours = actualDailyWorkingHours * monthlyAverageWorkingDays;
        const baseHourlyWage = monthlyBaseWorkingHours > 0 ? baseSalary / monthlyBaseWorkingHours : 0;

        if (baseHourlyWage <= 0) {
            return 0;
        }

        // 逆算式: 残業時間 = 固定残業代 / (基本時給 × 1.25)
        const monthlyOvertimeHours = data.fixedOvertimePay / (baseHourlyWage * 1.25);

        // 労働時間の単位に応じて変換
        switch (data.workingHoursType) {
            case 'daily':
                return monthlyOvertimeHours / monthlyAverageWorkingDays;
            case 'weekly':
                return (monthlyOvertimeHours / monthlyAverageWorkingDays) * 5;
            default: // monthly
                return monthlyOvertimeHours;
        }
    };

    const getHolidayShortcuts = (): HolidayShortcut[] => {
        if (data.useDynamicHolidays && holidayTypeCount) {
            return [
                {
                    label: '週休二日制（土日）',
                    days: holidayTypeCount.weeklyTwoDay,
                    description: '基本土日休み、月1回土日出勤、祝日は出勤',
                },
                {
                    label: '週休二日制（土日祝）',
                    days: holidayTypeCount.weeklyTwoDayWithHolidays,
                    description: '基本土日祝休み、月1回土日出勤',
                },
                {
                    label: '完全週休二日制（土日）',
                    days: holidayTypeCount.fullWeekendOnly,
                    description: '完全土日休み、祝日は出勤',
                },
                {
                    label: '完全週休二日制（土日祝）',
                    days: holidayTypeCount.fullWeekendWithHolidays,
                    description: '完全土日祝休み',
                },
            ];
        } else {
            // フォールバック（従来の固定値）
            return [
                {
                    label: '週休二日制（土日）',
                    days: 97,
                    description: '推定値',
                },
                {
                    label: '週休二日制（土日祝）',
                    days: 110,
                    description: '推定値',
                },
                {
                    label: '完全週休二日制（土日）',
                    days: 104,
                    description: '推定値',
                },
                {
                    label: '完全週休二日制（土日祝）',
                    days: 120,
                    description: '推定値',
                },
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

    const handleOvertimeInputTypeChange = (
        _: React.MouseEvent<HTMLElement>,
        newType: 'hours' | 'fixed' | null
    ) => {
        if (newType) {
            // 入力方式切り替え時に前の値をクリア
            if (newType === 'hours') {
                // 時間入力モードに切り替え: 固定残業代をクリア
                onChange({
                    ...data,
                    overtimeInputType: newType,
                    fixedOvertimePay: undefined
                });
            } else {
                // 固定残業代モードに切り替え: 残業時間をクリア
                onChange({
                    ...data,
                    overtimeInputType: newType,
                    overtimeHours: 0,
                    nightOvertimeHours: 0
                });
            }
        }
    };

    const handleWorkingHoursTypeChange = (
        _: React.MouseEvent<HTMLElement>,
        newType: 'daily' | 'weekly' | 'monthly' | null
    ) => {
        if (newType) {
            // 単位変更時に値を適切に変換
            let convertedHours = data.dailyWorkingHours;
            let convertedOvertime = data.overtimeHours || 0;
            let convertedNightOvertime = data.nightOvertimeHours || 0;

            if (data.workingHoursType === 'daily' && newType === 'weekly') {
                convertedHours = data.dailyWorkingHours * 5; // 週5日勤務と仮定
                convertedOvertime = (data.overtimeHours || 0) * 5;
                convertedNightOvertime = (data.nightOvertimeHours || 0) * 5;
            } else if (
                data.workingHoursType === 'daily' &&
                newType === 'monthly'
            ) {
                convertedHours = data.dailyWorkingHours * 22; // 月22日勤務と仮定
                convertedOvertime = (data.overtimeHours || 0) * 22;
                convertedNightOvertime = (data.nightOvertimeHours || 0) * 22;
            } else if (
                data.workingHoursType === 'weekly' &&
                newType === 'daily'
            ) {
                convertedHours = data.dailyWorkingHours / 5;
                convertedOvertime = (data.overtimeHours || 0) / 5;
                convertedNightOvertime = (data.nightOvertimeHours || 0) / 5;
            } else if (
                data.workingHoursType === 'weekly' &&
                newType === 'monthly'
            ) {
                convertedHours = data.dailyWorkingHours * 4.4; // 1ヶ月約4.4週
                convertedOvertime = (data.overtimeHours || 0) * 4.4;
                convertedNightOvertime = (data.nightOvertimeHours || 0) * 4.4;
            } else if (
                data.workingHoursType === 'monthly' &&
                newType === 'daily'
            ) {
                convertedHours = data.dailyWorkingHours / 22;
                convertedOvertime = (data.overtimeHours || 0) / 22;
                convertedNightOvertime = (data.nightOvertimeHours || 0) / 22;
            } else if (
                data.workingHoursType === 'monthly' &&
                newType === 'weekly'
            ) {
                convertedHours = data.dailyWorkingHours / 4.4;
                convertedOvertime = (data.overtimeHours || 0) / 4.4;
                convertedNightOvertime = (data.nightOvertimeHours || 0) / 4.4;
            }

            onChange({
                ...data,
                workingHoursType: newType,
                dailyWorkingHours: Math.round(convertedHours * 10) / 10, // 小数点1桁で四捨五入
                overtimeHours: Math.round(convertedOvertime * 10) / 10,
                nightOvertimeHours: Math.round(convertedNightOvertime * 10) / 10,
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

    return (
        <Box>
            <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 'bold', mb: 3 }}
            >
                基本情報
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: { xs: 2.5, sm: 3 },
                }}
            >
                {/* 基本給入力 */}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        基本給（月収）
                    </Typography>
                    <ValidatedInput
                        id="base-salary"
                        label="基本給"
                        value={data.baseSalary || data.salaryAmount || 0}
                        onChange={(value) =>
                            onChange({ ...data, baseSalary: value })
                        }
                        validator={validateSalary}
                        type="integer"
                        step={1000}
                        unit="円"
                        showIncrementButtons
                        helperText="月額の基本給を入力してください（残業代は含みません）"
                    />
                </Box>

                {/* 残業入力方式選択と残業入力欄 */}
                <Box>
                    <Typography variant="h6" gutterBottom>
                        残業入力方式
                    </Typography>
                    <ToggleButtonGroup
                        value={data.overtimeInputType || 'hours'}
                        exclusive
                        onChange={handleOvertimeInputTypeChange}
                        aria-label="overtime input type"
                        fullWidth
                        sx={{
                            mb: 2,
                            '& .MuiToggleButton-root': {
                                minHeight: { xs: 48, sm: 44 },
                            },
                        }}
                    >
                        <ToggleButton value="hours" aria-label="hours">
                            残業時間で入力
                        </ToggleButton>
                        <ToggleButton value="fixed" aria-label="fixed">
                            固定残業代で入力
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {/* 残業入力（方式に応じて切り替え） */}
                    {(data.overtimeInputType || 'hours') === 'hours' ? (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                残業時間を入力すると、残業代が自動計算されて時給に反映されます
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <ValidatedInput
                                    id="overtime-hours"
                                    label={
                                        data.workingHoursType === 'daily'
                                            ? '1日の通常残業時間'
                                            : data.workingHoursType === 'weekly'
                                            ? '1週の通常残業時間'
                                            : '1ヶ月の通常残業時間'
                                    }
                                    value={data.overtimeHours || 0}
                                    onChange={(value) => onChange({ ...data, overtimeHours: value })}
                                    validator={(value) => {
                                        const maxHours = data.workingHoursType === 'daily' ? 24 :
                                                        data.workingHoursType === 'weekly' ? 168 : 744;
                                        if (value < 0) return { isValid: false, message: '0時間以上を入力してください' };
                                        if (value > maxHours) return { isValid: false, message: `${maxHours}時間以下を入力してください` };
                                        return { isValid: true };
                                    }}
                                    type="float"
                                    step={data.workingHoursType === 'daily' ? 0.5 : 1}
                                    unit="時間"
                                    showIncrementButtons
                                    helperText="通常残業時間（割増率1.25倍）"
                                    sx={{ minWidth: 200, flex: 1 }}
                                    fullWidth={false}
                                />
                                <ValidatedInput
                                    id="night-overtime-hours"
                                    label={
                                        data.workingHoursType === 'daily'
                                            ? '1日の深夜残業時間'
                                            : data.workingHoursType === 'weekly'
                                            ? '1週の深夜残業時間'
                                            : '1ヶ月の深夜残業時間'
                                    }
                                    value={data.nightOvertimeHours || 0}
                                    onChange={(value) => onChange({ ...data, nightOvertimeHours: value })}
                                    validator={(value) => {
                                        const maxHours = data.workingHoursType === 'daily' ? 24 :
                                                        data.workingHoursType === 'weekly' ? 168 : 744;
                                        if (value < 0) return { isValid: false, message: '0時間以上を入力してください' };
                                        if (value > maxHours) return { isValid: false, message: `${maxHours}時間以下を入力してください` };
                                        return { isValid: true };
                                    }}
                                    type="float"
                                    step={data.workingHoursType === 'daily' ? 0.5 : 1}
                                    unit="時間"
                                    showIncrementButtons
                                    helperText="深夜残業時間（22時〜5時、割増率1.5倍）"
                                    sx={{ minWidth: 200, flex: 1 }}
                                    fullWidth={false}
                                />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                固定残業代から残業時間を逆算します
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <ValidatedInput
                                    id="fixed-overtime-pay"
                                    label="月額固定残業代"
                                    value={data.fixedOvertimePay || 0}
                                    onChange={(value) => onChange({ ...data, fixedOvertimePay: value })}
                                    validator={(value) => {
                                        if (value < 0) return { isValid: false, message: '0円以上を入力してください' };
                                        if (value > 10000000) return { isValid: false, message: '1000万円以下を入力してください' };
                                        return { isValid: true };
                                    }}
                                    type="integer"
                                    step={1000}
                                    unit="円"
                                    showIncrementButtons
                                    helperText="月額の固定残業代を入力してください"
                                    fullWidth={false}
                                    sx={{ minWidth: 200, flex: 1 }}
                                />
                                {data.fixedOvertimePay && data.fixedOvertimePay > 0 && (
                                    <Box sx={{ minWidth: 200, flex: 1, p: 2, bgcolor: 'info.light', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                                逆算された残業時間
                                            </Typography>
                                            <Typography variant="h6" color="primary">
                                                {data.workingHoursType === 'daily' && `1日あたり ${calculateOvertimeHoursFromFixedPay().toFixed(1)}時間`}
                                                {data.workingHoursType === 'weekly' && `1週あたり ${calculateOvertimeHoursFromFixedPay().toFixed(1)}時間`}
                                                {data.workingHoursType === 'monthly' && `1ヶ月あたり ${calculateOvertimeHoursFromFixedPay().toFixed(1)}時間`}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                ※ 基本時給から通常残業（1.25倍）として計算
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        </>
                    )}
                </Box>

                {/* 年間休日と総休日数 */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">年間休日</Typography>
                        <YearSelector data={data} onChange={onChange} />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                        <ValidatedInput
                            id="annual-holidays"
                            label="年間休日"
                            value={data.annualHolidays}
                            onChange={(value) =>
                                onChange({ ...data, annualHolidays: value })
                            }
                            validator={validateHolidays}
                            type="integer"
                            unit="日"
                            helperText="年間休日数を入力してください（0～366日）"
                            sx={{ minWidth: 200, flex: 1 }}
                            fullWidth={false}
                        />

                        <Box
                            sx={{
                                minWidth: 200,
                                flex: 1,
                                p: 2,
                                bgcolor: 'primary.main',
                                borderRadius: 1,
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                総休日数: {calculateTotalHolidays()}日
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ opacity: 0.7, ml: 1, display: 'block', mt: 0.5 }}
                                >
                                    (基本{data.annualHolidays}日
                                    {data.goldenWeekHolidays && (
                                        <>
                                            + GW
                                            {(() => {
                                                let gwDays = 10;
                                                if (
                                                    data.annualHolidays === 120 ||
                                                    data.annualHolidays === 119
                                                )
                                                    gwDays = 6;
                                                if (data.annualHolidays === 119)
                                                    gwDays = 4;
                                                return gwDays;
                                            })()}
                                            日
                                        </>
                                    )}
                                    {data.obon && <> + お盆5日</>}
                                    {data.yearEndNewYear && (
                                        <>
                                            + 年末年始
                                            {(() => {
                                                let yearEndDays = 6;
                                                if (
                                                    data.annualHolidays === 120 ||
                                                    data.annualHolidays === 119
                                                )
                                                    yearEndDays = 4;
                                                if (data.annualHolidays === 119)
                                                    yearEndDays = 3;
                                                return yearEndDays;
                                            })()}
                                            日
                                        </>
                                    )}
                                    {data.customHolidays > 0 && (
                                        <> + その他{data.customHolidays}日</>
                                    )}
                                    )
                                </Typography>
                            </Typography>
                        </Box>
                    </Box>

                    {/* ショートカットボタン */}
                    <Box sx={{ mb: 2 }}>
                        {loading && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mb: 1, display: 'block' }}
                            >
                                休日日数を計算中...
                            </Typography>
                        )}
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: '1fr 1fr',
                                },
                                gap: { xs: 1.5, sm: 1 },
                            }}
                        >
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
                                        justifyContent: 'center',
                                        '&:hover': {
                                            '@media (hover: hover)': {
                                                '& .shortcut-label': {
                                                    fontWeight: 'bold',
                                                },
                                                '& .shortcut-days': {
                                                    transform: 'scale(1.1)',
                                                },
                                            },
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        className="shortcut-label"
                                        sx={{
                                            fontWeight: 'bold',
                                            lineHeight: 1.2,
                                            fontSize: '0.8rem',
                                            transition: 'font-weight 0.2s ease',
                                        }}
                                    >
                                        {shortcut.label}{' '}
                                        <span
                                            className="shortcut-days"
                                            style={{
                                                color: 'var(--mui-palette-primary-main)',
                                                display: 'inline-block',
                                                transition: 'transform 0.2s ease',
                                            }}
                                        >
                                            {shortcut.days}日
                                        </span>
                                    </Typography>
                                    {shortcut.description && (
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                fontSize: '0.7rem',
                                                mt: 0.5,
                                                lineHeight: 1.2,
                                            }}
                                        >
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
                        <ValidatedInput
                            id="custom-holidays"
                            label="その他特別休暇"
                            value={data.customHolidays}
                            onChange={(value) =>
                                onChange({ ...data, customHolidays: value })
                            }
                            validator={validateCustomHolidays}
                            type="integer"
                            unit="日"
                            helperText="その他の特別休暇日数（0～365日）"
                            sx={{ minWidth: 200 }}
                            fullWidth={false}
                        />
                    </Box>
                </Box>

                {/* 労働時間入力 */}
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
                            sx={{
                                '& .MuiToggleButton-root': {
                                    minHeight: { xs: 44, sm: 40 },
                                },
                            }}
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
                    <ValidatedInput
                        id="working-hours"
                        label={
                            data.workingHoursType === 'daily'
                                ? '1日の労働時間'
                                : data.workingHoursType === 'weekly'
                                ? '1週の労働時間'
                                : '1ヶ月の労働時間'
                        }
                        value={getDisplayWorkingHours()}
                        onChange={(value) =>
                            onChange({ ...data, dailyWorkingHours: value })
                        }
                        validator={(value) => validateWorkingHours(
                            value,
                            data.workingHoursType === 'daily' ? 24 :
                            data.workingHoursType === 'weekly' ? 168 :
                            744 // monthly
                        )}
                        type="float"
                        step={data.workingHoursType === 'daily' ? 0.5 : 1}
                        unit="時間"
                        helperText={
                            data.workingHoursType === 'daily'
                                ? '労働時間を入力してください（0.5～24時間）'
                                : data.workingHoursType === 'weekly'
                                ? '労働時間を入力してください（0.5～168時間）'
                                : '労働時間を入力してください（0.5～744時間）'
                        }
                        fullWidth={false}
                        sx={{ maxWidth: 300 }}
                    />
                    <Typography
                        variant="caption"
                        color="textSecondary"
                        sx={{ ml: 1, mt: 1, display: 'block' }}
                    >
                        1日あたり: {getDailyWorkingHours().toFixed(1)}時間
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
});

export default BasicInputForm;
