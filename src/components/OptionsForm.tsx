import React from 'react';
import {
    Typography,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    ToggleButton,
    ToggleButtonGroup,
    Box,
    Paper,
    IconButton,
} from '@mui/material';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import type { SalaryCalculationData } from '../types';

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

    const handleWelfareAmountChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(event.target.value) || 0;
        onChange({ ...data, welfareAmount: value });
    };

    const handleWelfareIncrease = () => {
        const increment = data.welfareType === 'monthly' ? 1000 : 10000;
        onChange({ ...data, welfareAmount: data.welfareAmount + increment });
    };

    const handleWelfareDecrease = () => {
        const decrement = data.welfareType === 'monthly' ? 1000 : 10000;
        const newAmount = Math.max(0, data.welfareAmount - decrement);
        onChange({ ...data, welfareAmount: newAmount });
    };

    const handleAllowanceChange =
        (field: keyof SalaryCalculationData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(event.target.value) || 0;
            onChange({ ...data, [field]: value });
        };

    const handleAllowanceIncrease =
        (field: keyof SalaryCalculationData) => () => {
            const currentValue = data[field] as number;
            const increment = data.welfareType === 'monthly' ? 1000 : 10000;
            onChange({ ...data, [field]: currentValue + increment });
        };

    const handleAllowanceDecrease =
        (field: keyof SalaryCalculationData) => () => {
            const currentValue = data[field] as number;
            const decrement = data.welfareType === 'monthly' ? 1000 : 10000;
            const newValue = Math.max(0, currentValue - decrement);
            onChange({ ...data, [field]: newValue });
        };

    const handleBonusChange =
        (field: keyof SalaryCalculationData) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(event.target.value) || 0;
            onChange({ ...data, [field]: value });
        };

    const handleBonusIncrease = (field: keyof SalaryCalculationData) => () => {
        const currentValue = data[field] as number;
        onChange({ ...data, [field]: currentValue + 10000 });
    };

    const handleBonusDecrease = (field: keyof SalaryCalculationData) => () => {
        const currentValue = data[field] as number;
        const newValue = Math.max(0, currentValue - 10000);
        onChange({ ...data, [field]: newValue });
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
                            <FormControl
                                fullWidth
                                variant="outlined"
                                sx={{ mb: 2 }}
                            >
                                <InputLabel htmlFor="welfare-amount">
                                    福利厚生額（
                                    {data.welfareType === 'monthly'
                                        ? '月額'
                                        : '年額'}
                                    ）
                                </InputLabel>
                                <OutlinedInput
                                    id="welfare-amount"
                                    type="number"
                                    value={
                                        data.welfareInputMethod === 'individual'
                                            ? data.housingAllowance +
                                              data.regionalAllowance +
                                              data.familyAllowance +
                                              data.qualificationAllowance +
                                              data.otherAllowance
                                            : data.welfareAmount || ''
                                    }
                                    onChange={handleWelfareAmountChange}
                                    disabled={
                                        data.welfareInputMethod === 'individual'
                                    }
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
                                                    onClick={
                                                        handleWelfareIncrease
                                                    }
                                                    sx={{ p: 0.2, height: 20 }}
                                                    disabled={
                                                        data.welfareInputMethod ===
                                                        'individual'
                                                    }
                                                >
                                                    <KeyboardArrowUp fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={
                                                        handleWelfareDecrease
                                                    }
                                                    sx={{ p: 0.2, height: 20 }}
                                                    disabled={
                                                        data.welfareInputMethod ===
                                                        'individual'
                                                    }
                                                >
                                                    <KeyboardArrowDown fontSize="small" />
                                                </IconButton>
                                            </Box>
                                            円
                                        </InputAdornment>
                                    }
                                    label={`福利厚生額（${
                                        data.welfareType === 'monthly'
                                            ? '月額'
                                            : '年額'
                                    }）`}
                                />
                            </FormControl>
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
                                    <FormControl
                                        sx={{ minWidth: 200, flex: 1 }}
                                        variant="outlined"
                                    >
                                        <InputLabel htmlFor="housing-allowance">
                                            住宅手当（
                                            {data.welfareType === 'monthly'
                                                ? '月額'
                                                : '年額'}
                                            ）
                                        </InputLabel>
                                        <OutlinedInput
                                            id="housing-allowance"
                                            type="number"
                                            value={data.housingAllowance || ''}
                                            onChange={handleAllowanceChange(
                                                'housingAllowance'
                                            )}
                                            disabled={
                                                data.welfareInputMethod ===
                                                'total'
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceIncrease(
                                                                'housingAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowUp fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceDecrease(
                                                                'housingAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowDown fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                    円
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        sx={{ minWidth: 200, flex: 1 }}
                                        variant="outlined"
                                    >
                                        <InputLabel htmlFor="regional-allowance">
                                            地域手当（
                                            {data.welfareType === 'monthly'
                                                ? '月額'
                                                : '年額'}
                                            ）
                                        </InputLabel>
                                        <OutlinedInput
                                            id="regional-allowance"
                                            type="number"
                                            value={data.regionalAllowance || ''}
                                            onChange={handleAllowanceChange(
                                                'regionalAllowance'
                                            )}
                                            disabled={
                                                data.welfareInputMethod ===
                                                'total'
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceIncrease(
                                                                'regionalAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowUp fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceDecrease(
                                                                'regionalAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowDown fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                    円
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <FormControl
                                        sx={{ minWidth: 200, flex: 1 }}
                                        variant="outlined"
                                    >
                                        <InputLabel htmlFor="family-allowance">
                                            家族手当（
                                            {data.welfareType === 'monthly'
                                                ? '月額'
                                                : '年額'}
                                            ）
                                        </InputLabel>
                                        <OutlinedInput
                                            id="family-allowance"
                                            type="number"
                                            value={data.familyAllowance || ''}
                                            onChange={handleAllowanceChange(
                                                'familyAllowance'
                                            )}
                                            disabled={
                                                data.welfareInputMethod ===
                                                'total'
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceIncrease(
                                                                'familyAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowUp fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceDecrease(
                                                                'familyAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowDown fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                    円
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        sx={{ minWidth: 200, flex: 1 }}
                                        variant="outlined"
                                    >
                                        <InputLabel htmlFor="qualification-allowance">
                                            資格手当（
                                            {data.welfareType === 'monthly'
                                                ? '月額'
                                                : '年額'}
                                            ）
                                        </InputLabel>
                                        <OutlinedInput
                                            id="qualification-allowance"
                                            type="number"
                                            value={
                                                data.qualificationAllowance ||
                                                ''
                                            }
                                            onChange={handleAllowanceChange(
                                                'qualificationAllowance'
                                            )}
                                            disabled={
                                                data.welfareInputMethod ===
                                                'total'
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceIncrease(
                                                                'qualificationAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowUp fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceDecrease(
                                                                'qualificationAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowDown fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                    円
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 2,
                                        flexWrap: 'wrap',
                                    }}
                                >
                                    <FormControl
                                        sx={{ minWidth: 200, flex: 1 }}
                                        variant="outlined"
                                    >
                                        <InputLabel htmlFor="other-allowance">
                                            その他手当（
                                            {data.welfareType === 'monthly'
                                                ? '月額'
                                                : '年額'}
                                            ）
                                        </InputLabel>
                                        <OutlinedInput
                                            id="other-allowance"
                                            type="number"
                                            value={data.otherAllowance || ''}
                                            onChange={handleAllowanceChange(
                                                'otherAllowance'
                                            )}
                                            disabled={
                                                data.welfareInputMethod ===
                                                'total'
                                            }
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'column',
                                                            mr: 1,
                                                        }}
                                                    >
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceIncrease(
                                                                'otherAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowUp fontSize="small" />
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            onClick={handleAllowanceDecrease(
                                                                'otherAllowance'
                                                            )}
                                                            sx={{
                                                                p: 0.2,
                                                                height: 20,
                                                            }}
                                                            disabled={
                                                                data.welfareInputMethod ===
                                                                'total'
                                                            }
                                                        >
                                                            <KeyboardArrowDown fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                    円
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>
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
                                <FormControl
                                    sx={{ minWidth: 200, flex: 1 }}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="summer-bonus">
                                        夏期賞与
                                    </InputLabel>
                                    <OutlinedInput
                                        id="summer-bonus"
                                        type="number"
                                        value={data.summerBonus || ''}
                                        onChange={handleBonusChange(
                                            'summerBonus'
                                        )}
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
                                                        onClick={handleBonusIncrease(
                                                            'summerBonus'
                                                        )}
                                                        sx={{
                                                            p: 0.2,
                                                            height: 20,
                                                        }}
                                                    >
                                                        <KeyboardArrowUp fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleBonusDecrease(
                                                            'summerBonus'
                                                        )}
                                                        sx={{
                                                            p: 0.2,
                                                            height: 20,
                                                        }}
                                                    >
                                                        <KeyboardArrowDown fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                円
                                            </InputAdornment>
                                        }
                                        label="夏期賞与"
                                    />
                                </FormControl>
                                <FormControl
                                    sx={{ minWidth: 200, flex: 1 }}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="winter-bonus">
                                        冬期賞与
                                    </InputLabel>
                                    <OutlinedInput
                                        id="winter-bonus"
                                        type="number"
                                        value={data.winterBonus || ''}
                                        onChange={handleBonusChange(
                                            'winterBonus'
                                        )}
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
                                                        onClick={handleBonusIncrease(
                                                            'winterBonus'
                                                        )}
                                                        sx={{
                                                            p: 0.2,
                                                            height: 20,
                                                        }}
                                                    >
                                                        <KeyboardArrowUp fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleBonusDecrease(
                                                            'winterBonus'
                                                        )}
                                                        sx={{
                                                            p: 0.2,
                                                            height: 20,
                                                        }}
                                                    >
                                                        <KeyboardArrowDown fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                円
                                            </InputAdornment>
                                        }
                                        label="冬期賞与"
                                    />
                                </FormControl>
                            </Box>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <FormControl
                                    sx={{ minWidth: 200, flex: 1 }}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="settlement-bonus">
                                        決算賞与
                                    </InputLabel>
                                    <OutlinedInput
                                        id="settlement-bonus"
                                        type="number"
                                        value={data.settlementBonus || ''}
                                        onChange={handleBonusChange(
                                            'settlementBonus'
                                        )}
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
                                                        onClick={handleBonusIncrease(
                                                            'settlementBonus'
                                                        )}
                                                        sx={{
                                                            p: 0.2,
                                                            height: 20,
                                                        }}
                                                    >
                                                        <KeyboardArrowUp fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleBonusDecrease(
                                                            'settlementBonus'
                                                        )}
                                                        sx={{
                                                            p: 0.2,
                                                            height: 20,
                                                        }}
                                                    >
                                                        <KeyboardArrowDown fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                円
                                            </InputAdornment>
                                        }
                                        label="決算賞与"
                                    />
                                </FormControl>
                                <FormControl
                                    sx={{ minWidth: 200, flex: 1 }}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="other-bonus">
                                        その他特別賞与
                                    </InputLabel>
                                    <OutlinedInput
                                        id="other-bonus"
                                        type="number"
                                        value={data.otherBonus || ''}
                                        onChange={handleBonusChange(
                                            'otherBonus'
                                        )}
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
                                                        onClick={handleBonusIncrease(
                                                            'otherBonus'
                                                        )}
                                                        sx={{
                                                            p: 0.2,
                                                            height: 20,
                                                        }}
                                                    >
                                                        <KeyboardArrowUp fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleBonusDecrease(
                                                            'otherBonus'
                                                        )}
                                                        sx={{
                                                            p: 0.2,
                                                            height: 20,
                                                        }}
                                                    >
                                                        <KeyboardArrowDown fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                                円
                                            </InputAdornment>
                                        }
                                        label="その他特別賞与"
                                    />
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};

export default OptionsForm;
