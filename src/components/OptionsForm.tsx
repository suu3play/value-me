import React from 'react';
import {
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Box,
    Paper,
} from '@mui/material';
import type { SalaryCalculationData } from '../types';
import ValidatedInput from './ValidatedInput';
import {
    validateWelfareAmount,
    validateAllowance,
    validateBonus
} from '../utils/validation';

interface OptionsFormProps {
    data: SalaryCalculationData;
    onChange: (data: SalaryCalculationData) => void;
}

const OptionsForm: React.FC<OptionsFormProps> = ({ data, onChange }) => {
    const handleWelfareTypeChange = (
        _: React.MouseEvent<HTMLElement>,
        newWelfareType: 'monthly' | 'annual' | null
    ) => {
        if (newWelfareType) {
            onChange({ ...data, welfareType: newWelfareType });
        }
    };

    const handleWelfareInputMethodChange = (
        _: React.MouseEvent<HTMLElement>,
        newMethod: 'total' | 'individual' | null
    ) => {
        if (newMethod) {
            onChange({ ...data, welfareInputMethod: newMethod });
        }
    };


    return (
        <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                オプション機能
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* 福利厚生 */}
                <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 3,
                        }}
                    >
                        {/* 福利厚生の入力設定 */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                福利厚生の設定
                            </Typography>
                            <Box
                                sx={{
                                    mb: 2,
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    gap: 2,
                                    alignItems: { sm: 'center' },
                                }}
                            >
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        入力方式
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={data.welfareInputMethod}
                                        exclusive
                                        onChange={
                                            handleWelfareInputMethodChange
                                        }
                                        aria-label="welfare input method"
                                        size="small"
                                    >
                                        <ToggleButton
                                            value="individual"
                                            aria-label="individual"
                                        >
                                            各種手当を入力
                                        </ToggleButton>
                                        <ToggleButton
                                            value="total"
                                            aria-label="total"
                                        >
                                            全体額を入力
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                                <Box>
                                    <Typography variant="body2" sx={{ mb: 1 }}>
                                        計算単位
                                    </Typography>
                                    <ToggleButtonGroup
                                        value={data.welfareType}
                                        exclusive
                                        onChange={handleWelfareTypeChange}
                                        aria-label="welfare type"
                                        size="small"
                                    >
                                        <ToggleButton
                                            value="monthly"
                                            aria-label="monthly"
                                        >
                                            月額
                                        </ToggleButton>
                                        <ToggleButton
                                            value="annual"
                                            aria-label="annual"
                                            >
                                            年額
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Box>
                            </Box>
                            <Box
                                sx={{
                                    p: 1,
                                    bgcolor: 'info.light',
                                    borderRadius: 1,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    color="warning.contrastText"
                                >
                                    {data.welfareInputMethod === 'total'
                                        ? '「全体額を入力」選択時は、各種手当は入力できません。'
                                        : '「各種手当を入力」選択時は、各種手当の合算額が自動計算されます'}
                                </Typography>
                            </Box>
                        </Box>

                        {/* 福利厚生額の全体額 */}
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                福利厚生額の全体額
                            </Typography>
                            <ValidatedInput
                                id="welfare-amount"
                                label={`福利厚生額（${
                                    data.welfareType === 'monthly'
                                        ? '月額'
                                        : '年額'
                                }）`}
                                value={
                                    data.welfareInputMethod === 'individual'
                                        ? data.housingAllowance +
                                          data.regionalAllowance +
                                          data.familyAllowance +
                                          data.qualificationAllowance +
                                          data.otherAllowance
                                        : data.welfareAmount
                                }
                                onChange={(value) => onChange({ ...data, welfareAmount: value })}
                                validator={validateWelfareAmount}
                                type="integer"
                                step={data.welfareType === 'monthly' ? 1000 : 10000}
                                unit="円"
                                disabled={data.welfareInputMethod === 'individual'}
                                showIncrementButtons={data.welfareInputMethod !== 'individual'}
                                helperText="福利厚生額を入力してください（0円～1,000万円）"
                                sx={{ mb: 2 }}
                            />
                        </Box>

                        {/* 各種手当 */}
                        <Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    mb: 1,
                                }}
                            >
                                <Typography variant="h6">
                                    各種手当（
                                    {data.welfareType === 'monthly'
                                        ? '月額'
                                        : '年額'}
                                    ）
                                </Typography>
                            </Box>

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
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <ValidatedInput
                                        id="housing-allowance"
                                        label={`住宅手当（${
                                            data.welfareType === 'monthly' ? '月額' : '年額'
                                        }）`}
                                        value={data.housingAllowance}
                                        onChange={(value) => onChange({ ...data, housingAllowance: value })}
                                        validator={validateAllowance}
                                        type="integer"
                                        step={data.welfareType === 'monthly' ? 1000 : 10000}
                                        unit="円"
                                        disabled={data.welfareInputMethod === 'total'}
                                        showIncrementButtons={data.welfareInputMethod !== 'total'}
                                        helperText="住宅手当を入力してください（0円～1,000万円）"
                                        sx={{ minWidth: 200, flex: 1 }}
                                        fullWidth={false}
                                    />
                                    <ValidatedInput
                                        id="regional-allowance"
                                        label={`地域手当（${
                                            data.welfareType === 'monthly' ? '月額' : '年額'
                                        }）`}
                                        value={data.regionalAllowance}
                                        onChange={(value) => onChange({ ...data, regionalAllowance: value })}
                                        validator={validateAllowance}
                                        type="integer"
                                        step={data.welfareType === 'monthly' ? 1000 : 10000}
                                        unit="円"
                                        disabled={data.welfareInputMethod === 'total'}
                                        showIncrementButtons={data.welfareInputMethod !== 'total'}
                                        helperText="地域手当を入力してください（0円～1,000万円）"
                                        sx={{ minWidth: 200, flex: 1 }}
                                        fullWidth={false}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <ValidatedInput
                                        id="family-allowance"
                                        label={`家族手当（${
                                            data.welfareType === 'monthly' ? '月額' : '年額'
                                        }）`}
                                        value={data.familyAllowance}
                                        onChange={(value) => onChange({ ...data, familyAllowance: value })}
                                        validator={validateAllowance}
                                        type="integer"
                                        step={data.welfareType === 'monthly' ? 1000 : 10000}
                                        unit="円"
                                        disabled={data.welfareInputMethod === 'total'}
                                        showIncrementButtons={data.welfareInputMethod !== 'total'}
                                        helperText="家族手当を入力してください（0円～1,000万円）"
                                        sx={{ minWidth: 200, flex: 1 }}
                                        fullWidth={false}
                                    />
                                    <ValidatedInput
                                        id="qualification-allowance"
                                        label={`資格手当（${
                                            data.welfareType === 'monthly' ? '月額' : '年額'
                                        }）`}
                                        value={data.qualificationAllowance}
                                        onChange={(value) => onChange({ ...data, qualificationAllowance: value })}
                                        validator={validateAllowance}
                                        type="integer"
                                        step={data.welfareType === 'monthly' ? 1000 : 10000}
                                        unit="円"
                                        disabled={data.welfareInputMethod === 'total'}
                                        showIncrementButtons={data.welfareInputMethod !== 'total'}
                                        helperText="資格手当を入力してください（0円～1,000万円）"
                                        sx={{ minWidth: 200, flex: 1 }}
                                        fullWidth={false}
                                    />
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <ValidatedInput
                                        id="other-allowance"
                                        label={`その他手当（${
                                            data.welfareType === 'monthly' ? '月額' : '年額'
                                        }）`}
                                        value={data.otherAllowance}
                                        onChange={(value) => onChange({ ...data, otherAllowance: value })}
                                        validator={validateAllowance}
                                        type="integer"
                                        step={data.welfareType === 'monthly' ? 1000 : 10000}
                                        unit="円"
                                        disabled={data.welfareInputMethod === 'total'}
                                        showIncrementButtons={data.welfareInputMethod !== 'total'}
                                        helperText="その他手当を入力してください（0円～1,000万円）"
                                        sx={{ minWidth: 200, flex: 1 }}
                                        fullWidth={false}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Paper>

                {/* ボーナス */}
                <Paper elevation={1} sx={{ p: 3, bgcolor: 'grey.50' }}>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            ボーナス（年額）
                        </Typography>
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
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <ValidatedInput
                                    id="summer-bonus"
                                    label="夏期賞与"
                                    value={data.summerBonus}
                                    onChange={(value) => onChange({ ...data, summerBonus: value })}
                                    validator={validateBonus}
                                    type="integer"
                                    step={10000}
                                    unit="円"
                                    showIncrementButtons
                                    helperText="夏期賞与を入力してください（0円～1,000万円）"
                                    sx={{ minWidth: 200, flex: 1 }}
                                    fullWidth={false}
                                />
                                <ValidatedInput
                                    id="winter-bonus"
                                    label="冬期賞与"
                                    value={data.winterBonus}
                                    onChange={(value) => onChange({ ...data, winterBonus: value })}
                                    validator={validateBonus}
                                    type="integer"
                                    step={10000}
                                    unit="円"
                                    showIncrementButtons
                                    helperText="冬期賞与を入力してください（0円～1,000万円）"
                                    sx={{ minWidth: 200, flex: 1 }}
                                    fullWidth={false}
                                />
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <ValidatedInput
                                    id="settlement-bonus"
                                    label="決算賞与"
                                    value={data.settlementBonus}
                                    onChange={(value) => onChange({ ...data, settlementBonus: value })}
                                    validator={validateBonus}
                                    type="integer"
                                    step={10000}
                                    unit="円"
                                    showIncrementButtons
                                    helperText="決算賞与を入力してください（0円～1,000万円）"
                                    sx={{ minWidth: 200, flex: 1 }}
                                    fullWidth={false}
                                />
                                <ValidatedInput
                                    id="other-bonus"
                                    label="その他特別賞与"
                                    value={data.otherBonus}
                                    onChange={(value) => onChange({ ...data, otherBonus: value })}
                                    validator={validateBonus}
                                    type="integer"
                                    step={10000}
                                    unit="円"
                                    showIncrementButtons
                                    helperText="その他特別賞与を入力してください（0円～1,000万円）"
                                    sx={{ minWidth: 200, flex: 1 }}
                                    fullWidth={false}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default OptionsForm;
