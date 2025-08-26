import React from 'react';
import {
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Box,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
} from '@mui/material';
import type { SalaryCalculationData } from '../types';
import ValidatedInput from './ValidatedInput';
import {
    validateWelfareAmount,
    validateAllowance,
    validateBonus
} from '../utils/validation';
import { getAvailablePrefectures } from '../utils/socialInsuranceCalculations';

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

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
                {/* 福利厚生 */}
                <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50' }}>
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
                                        sx={{
                                            '& .MuiToggleButton-root': {
                                                minHeight: { xs: 44, sm: 40 },
                                            }
                                        }}
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
                                        sx={{
                                            '& .MuiToggleButton-root': {
                                                minHeight: { xs: 44, sm: 40 },
                                            }
                                        }}
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
                <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50' }}>
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

                {/* 社会保障費設定 */}
                <Paper elevation={1} sx={{ p: { xs: 2, sm: 3 }, bgcolor: 'grey.50' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                        社会保障費計算
                    </Typography>
                    
                    <FormControlLabel
                        control={
                            <Switch
                                checked={data.enableSocialInsurance || false}
                                onChange={(e) => onChange({ ...data, enableSocialInsurance: e.target.checked })}
                                color="primary"
                            />
                        }
                        label="会社負担の社会保障費を表示する"
                        sx={{ mb: 2 }}
                    />

                    {data.enableSocialInsurance && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <FormControl sx={{ minWidth: 200, flex: 1 }}>
                                    <InputLabel>居住地（都道府県）</InputLabel>
                                    <Select
                                        value={data.prefecture || '東京都'}
                                        onChange={(e) => onChange({ ...data, prefecture: e.target.value })}
                                        label="居住地（都道府県）"
                                    >
                                        {getAvailablePrefectures().map((prefecture) => (
                                            <MenuItem key={prefecture} value={prefecture}>
                                                {prefecture}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <ValidatedInput
                                    id="age"
                                    label="年齢"
                                    value={data.age || 30}
                                    onChange={(value) => onChange({ ...data, age: value })}
                                    validator={(value) => {
                                        if (value < 18 || value > 75) {
                                            return { isValid: false, message: '年齢は18歳から75歳までで入力してください' };
                                        }
                                        return { isValid: true };
                                    }}
                                    type="integer"
                                    unit="歳"
                                    helperText="年齢を入力してください（18～75歳）"
                                    sx={{ minWidth: 150, flex: 1 }}
                                    fullWidth={false}
                                />

                                <ValidatedInput
                                    id="dependents"
                                    label="扶養者数"
                                    value={data.dependents || 0}
                                    onChange={(value) => onChange({ ...data, dependents: value })}
                                    validator={(value) => {
                                        if (value < 0 || value > 10) {
                                            return { isValid: false, message: '扶養者数は0～10人で入力してください' };
                                        }
                                        return { isValid: true };
                                    }}
                                    type="integer"
                                    unit="人"
                                    helperText="扶養者数を入力してください（0～10人）"
                                    sx={{ minWidth: 150, flex: 1 }}
                                    fullWidth={false}
                                />
                            </Box>
                            <Typography variant="caption" color="textSecondary">
                                ※ 社会保険料率は令和6年度の料率を使用しています。実際の料率は勤務先の健康保険組合や業種により異なる場合があります。
                            </Typography>
                        </Box>
                    )}
                </Paper>
            </Box>
        </Box>
    );
};

export default OptionsForm;
