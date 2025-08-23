import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    IconButton,
    Grid,
    Chip,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    People as PeopleIcon,
} from '@mui/icons-material';
import type { Position } from '../../types/teamCost';

interface PositionManagerProps {
    positions: Position[];
    onChange: (positions: Position[]) => void;
}

export const PositionManager: React.FC<PositionManagerProps> = ({
    positions,
    onChange,
}) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState<Position | null>(
        null
    );
    const [formData, setFormData] = useState({ name: '', count: 1 });

    const handleAdd = () => {
        setEditingPosition(null);
        setFormData({ name: '', count: 1 });
        setDialogOpen(true);
    };

    const handleEdit = (position: Position) => {
        setEditingPosition(position);
        setFormData({ name: position.name, count: position.count });
        setDialogOpen(true);
    };

    const handleSave = () => {
        if (!formData.name.trim()) return;

        const newPosition: Position = {
            id: editingPosition?.id || `pos_${Date.now()}`,
            name: formData.name.trim(),
            count: Math.max(1, formData.count),
        };

        if (editingPosition) {
            // 編集
            onChange(
                positions.map((p) =>
                    p.id === editingPosition.id ? newPosition : p
                )
            );
        } else {
            // 新規追加
            onChange([...positions, newPosition]);
        }

        setDialogOpen(false);
    };

    const handleDelete = (positionId: string) => {
        onChange(positions.filter((p) => p.id !== positionId));
    };

    const handleCountChange = (positionId: string, count: number) => {
        onChange(
            positions.map((p) =>
                p.id === positionId ? { ...p, count: Math.max(0, count) } : p
            )
        );
    };

    const totalMembers = positions.reduce((sum, pos) => sum + pos.count, 0);

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        <PeopleIcon sx={{ mr: 1 }} />
                        メンバー構成
                    </Typography>
                    <Chip
                        label={`総計: ${totalMembers}名`}
                        color="primary"
                        variant="outlined"
                    />
                </Box>

                {positions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            gutterBottom
                        >
                            役職とメンバー数を設定してください
                        </Typography>
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAdd}
                        >
                            役職を追加
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <Grid container spacing={2}>
                            {positions.map((position) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    key={position.id}
                                >
                                    <Box
                                        sx={{
                                            p: 2,
                                            border: 1,
                                            borderColor: 'divider',
                                            borderRadius: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ flex: 1 }}>
                                            <Typography
                                                variant="subtitle2"
                                                gutterBottom
                                            >
                                                {position.name}
                                            </Typography>
                                            <TextField
                                                type="number"
                                                value={position.count}
                                                onChange={(e) =>
                                                    handleCountChange(
                                                        position.id,
                                                        parseInt(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                size="small"
                                                inputProps={{ min: 0, max: 99 }}
                                                sx={{ width: 80 }}
                                            />
                                            <Typography
                                                variant="caption"
                                                sx={{ ml: 1 }}
                                            >
                                                名
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleEdit(position)
                                                }
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                onClick={() =>
                                                    handleDelete(position.id)
                                                }
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAdd}
                            >
                                役職を追加
                            </Button>
                        </Box>
                    </Box>
                )}
            </CardContent>

            {/* Add/Edit Dialog */}
            <Dialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingPosition ? '役職編集' : '役職追加'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="役職名"
                        fullWidth
                        variant="outlined"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="例: リーダー, サブリーダー, ミドル, ジュニア"
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="人数"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={formData.count}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                count: parseInt(e.target.value) || 1,
                            })
                        }
                        inputProps={{ min: 1, max: 99 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>
                        キャンセル
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={!formData.name.trim()}
                    >
                        {editingPosition ? '更新' : '追加'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
};
