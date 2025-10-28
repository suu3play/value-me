import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
    IconButton,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import type { ComparisonItem, SalaryCalculationData } from '../types';
import SalaryCalculator from './SalaryCalculator';
import DynamicHolidaySettings from './DynamicHolidaySettings';

interface ComparisonFormProps {
    items: ComparisonItem[];
    activeItemId: string | null;
    onAddItem: (label: string, data: SalaryCalculationData) => void;
    onRemoveItem: (id: string) => void;
    onUpdateItem: (id: string, data: SalaryCalculationData) => void;
    onUpdateLabel: (id: string, label: string) => void;
    onSetActiveItem: (id: string) => void;
    maxItems?: number;
}

const ComparisonForm: React.FC<ComparisonFormProps> = React.memo(({
    items,
    onAddItem,
    onUpdateItem,
    onUpdateLabel,
}) => {
    const [editLabelDialogOpen, setEditLabelDialogOpen] = useState(false);
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingLabel, setEditingLabel] = useState('');

    // 共有動的祝日設定の状態管理
    const [sharedHolidaySettings, setSharedHolidaySettings] = useState<{
        useDynamicHolidays: boolean;
        holidayYear: number;
        holidayYearType: 'fiscal' | 'calendar';
    }>({
        useDynamicHolidays: true,
        holidayYear: (() => {
            const currentMonth = new Date().getMonth() + 1;
            const currentYear = new Date().getFullYear();
            return currentMonth >= 4 ? currentYear : currentYear - 1;
        })(),
        holidayYearType: 'fiscal',
    });

    const sourceItem = items[0] || null;
    const targetItem = items[1] || null;

    const initializeItems = useCallback(() => {
        const defaultData: SalaryCalculationData = {
            baseSalary: 200000,
            overtimeInputType: 'hours',
            overtimeHours: 0,
            nightOvertimeHours: 0,
            annualHolidays: 119,
            dailyWorkingHours: 8,
            workingHoursType: 'daily',
            useDynamicHolidays: sharedHolidaySettings.useDynamicHolidays,
            holidayYear: sharedHolidaySettings.holidayYear,
            holidayYearType: sharedHolidaySettings.holidayYearType,
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

        // 比較元が存在しない場合は追加
        if (!sourceItem) {
            onAddItem('比較元', defaultData);
        }
        // 比較先が存在しない場合は追加
        if (!targetItem && sourceItem) {
            onAddItem('比較先', { ...defaultData, baseSalary: 250000 });
        }
    }, [sourceItem, targetItem, onAddItem, sharedHolidaySettings]);

    // コンポーネント初期化時に2項目を自動で作成
    useEffect(() => {
        if (items.length === 0) {
            initializeItems();
        }
    }, [items.length, initializeItems]);

    const handleEditLabel = (itemId: string, currentLabel: string) => {
        setEditingItemId(itemId);
        setEditingLabel(currentLabel);
        setEditLabelDialogOpen(true);
    };

    const handleSaveLabel = () => {
        if (editingItemId && editingLabel.trim()) {
            onUpdateLabel(editingItemId, editingLabel.trim());
            setEditLabelDialogOpen(false);
            setEditingItemId(null);
            setEditingLabel('');
        }
    };

    // 共有祝日設定の変更処理
    const handleSharedHolidaySettingsChange = useCallback(
        (newSettings: typeof sharedHolidaySettings) => {
            setSharedHolidaySettings(newSettings);

            // 全項目に共有設定を適用
            items.forEach((item) => {
                const updatedData: SalaryCalculationData = {
                    ...item.data,
                    useDynamicHolidays: newSettings.useDynamicHolidays,
                    holidayYear: newSettings.holidayYear,
                    holidayYearType: newSettings.holidayYearType,
                };
                onUpdateItem(item.id, updatedData);
            });
        },
        [items, onUpdateItem]
    );

    // 項目データ変更時の処理（共有設定以外の変更のみ）
    const handleItemDataChange = useCallback(
        (itemId: string, newData: SalaryCalculationData) => {
            // 共有設定を保持しながら他の設定のみ更新
            const dataWithSharedSettings: SalaryCalculationData = {
                ...newData,
                useDynamicHolidays: sharedHolidaySettings.useDynamicHolidays,
                holidayYear: sharedHolidaySettings.holidayYear,
                holidayYearType: sharedHolidaySettings.holidayYearType,
            };
            onUpdateItem(itemId, dataWithSharedSettings);
        },
        [sharedHolidaySettings, onUpdateItem]
    );

    return (
        <Box sx={{ width: '100%' }}>
            <Paper elevation={1} sx={{ bgcolor: 'grey.50' }}>
                {/* ヘッダー */}
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        px: 2,
                        py: 1,
                    }}
                >
                    <Typography variant="h6" color="primary">
                        条件比較（2項目）
                    </Typography>
                </Box>

                {/* 比較元・比較先2列並び比較フォーム */}
                <Box sx={{ p: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 3,
                        }}
                    >
                        {/* 比較元 */}
                        <Box sx={{ flex: 1 }}>
                            {sourceItem && (
                                <Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="primary.main"
                                        >
                                            {sourceItem.label}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                handleEditLabel(
                                                    sourceItem.id,
                                                    sourceItem.label
                                                )
                                            }
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <SalaryCalculator
                                        data={sourceItem.data}
                                        onChange={(data) =>
                                            handleItemDataChange(
                                                sourceItem.id,
                                                data
                                            )
                                        }
                                        onResultChange={() => {}}
                                        hideDynamicHolidaySettings={true}
                                    />
                                </Box>
                            )}
                        </Box>

                        {/* モバイル用水平区切り線 */}
                        <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                            <Divider sx={{ my: 1 }} />
                        </Box>

                        {/* 比較先 */}
                        <Box sx={{ flex: 1 }}>
                            {targetItem && (
                                <Box>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            color="secondary.main"
                                        >
                                            {targetItem.label}
                                        </Typography>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                handleEditLabel(
                                                    targetItem.id,
                                                    targetItem.label
                                                )
                                            }
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <SalaryCalculator
                                        data={targetItem.data}
                                        onChange={(data) =>
                                            handleItemDataChange(
                                                targetItem.id,
                                                data
                                            )
                                        }
                                        onResultChange={() => {}}
                                        hideDynamicHolidaySettings={true}
                                    />
                                </Box>
                            )}
                        </Box>
                    </Box>

                    {/* 共有動的祝日設定 */}
                    <Box sx={{ mt: 2 }}>
                        <DynamicHolidaySettings
                            data={{
                                useDynamicHolidays:
                                    sharedHolidaySettings.useDynamicHolidays,
                                holidayYear: sharedHolidaySettings.holidayYear,
                                holidayYearType:
                                    sharedHolidaySettings.holidayYearType,
                                // DynamicHolidaySettingsが必要とする他の必須プロパティを追加
                                baseSalary: 0,
                                overtimeInputType: 'hours',
                                annualHolidays: 0,
                                dailyWorkingHours: 0,
                                workingHoursType: 'daily',
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
                            }}
                            onChange={(data) =>
                                handleSharedHolidaySettingsChange({
                                    useDynamicHolidays:
                                        data.useDynamicHolidays ?? true,
                                    holidayYear:
                                        data.holidayYear ??
                                        sharedHolidaySettings.holidayYear,
                                    holidayYearType:
                                        data.holidayYearType === 'calendar'
                                            ? 'calendar'
                                            : 'fiscal',
                                })
                            }
                        />
                    </Box>
                </Box>
            </Paper>

            {/* ラベル編集ダイアログ */}
            <Dialog
                open={editLabelDialogOpen}
                onClose={() => setEditLabelDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>項目名を編集</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        fullWidth
                        label="項目名"
                        value={editingLabel}
                        onChange={(e) => setEditingLabel(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSaveLabel();
                            }
                        }}
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditLabelDialogOpen(false)}>
                        キャンセル
                    </Button>
                    <Button
                        onClick={handleSaveLabel}
                        variant="contained"
                        disabled={!editingLabel.trim()}
                    >
                        保存
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
});

export default ComparisonForm;
