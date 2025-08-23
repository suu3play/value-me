import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Timer as TimerIcon,
  Schedule as ScheduleIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useTeamManagement } from '../../hooks/useTeamManagement';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import { useTeamAnalysis } from '../../hooks/useTeamAnalysis';
import { TaskForm } from './TaskForm';
import type { TaskDefinition } from '../../types';

export const SimpleTaskManager: React.FC = () => {
  const { teams } = useTeamManagement();
  const {
    createTask,
    updateTask,
    deleteTask,
    getTasksByTeam,
  } = useTaskManagement();
  const { calculateTaskCost } = useTeamAnalysis();

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDefinition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskDefinition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const currentTeam = teams.length > 0 ? teams[0] : null;
  const allTasks = currentTeam ? getTasksByTeam(currentTeam.id) : [];
  const tasks = allTasks
    .filter(task => task.isActive)
    .filter(task => 
      task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  const handleAddTask = (taskData: {
    name: string;
    description?: string;
    estimatedMinutes: number;
    frequency: any;
    tags?: string[];
  }) => {
    if (currentTeam) {
      createTask(
        taskData.name,
        currentTeam.id,
        taskData.estimatedMinutes,
        taskData.frequency,
        taskData.description,
        taskData.tags
      );
    }
  };

  const handleEditTask = (taskData: {
    name: string;
    description?: string;
    estimatedMinutes: number;
    frequency: any;
    tags?: string[];
  }) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        name: taskData.name,
        description: taskData.description,
        estimatedMinutes: taskData.estimatedMinutes,
        frequency: taskData.frequency,
        tags: taskData.tags,
      });
      setEditingTask(null);
    }
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setDeleteDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const openEditDialog = (task: TaskDefinition) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const openDeleteDialog = (task: TaskDefinition) => {
    setSelectedTask(task);
    setDeleteDialogOpen(true);
  };

  const formatFrequency = (frequency: any): string => {
    switch (frequency.type) {
      case 'once':
        return '一回のみ';
      case 'daily':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}日ごと` 
          : '毎日';
      case 'weekly':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}週間ごと` 
          : '毎週';
      case 'monthly':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}ヶ月ごと` 
          : '毎月';
      case 'yearly':
        return frequency.interval && frequency.interval > 1 
          ? `${frequency.interval}年ごと` 
          : '毎年';
      default:
        return '不明';
    }
  };

  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}分`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes === 0 
        ? `${hours}時間` 
        : `${hours}時間${remainingMinutes}分`;
    }
  };

  const getFrequencyColor = (frequency: any) => {
    switch (frequency.type) {
      case 'daily': return 'error';
      case 'weekly': return 'warning';
      case 'monthly': return 'info';
      case 'yearly': return 'success';
      default: return 'default';
    }
  };

  const getTaskCost = (task: TaskDefinition) => {
    if (!currentTeam) return null;
    try {
      return calculateTaskCost(task.id, 'average');
    } catch (error) {
      return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            作業管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            作業内容と時間を登録してコストを計算します
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTaskFormOpen(true)}
          size="large"
          disabled={!currentTeam}
        >
          作業追加
        </Button>
      </Box>

      {!currentTeam && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          作業を登録するには、まずメンバーを追加してください。
        </Alert>
      )}

      {/* Search */}
      {tasks.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <TextField
            placeholder="作業を検索..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
        </Box>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <Alert severity="info">
          {searchTerm 
            ? '検索条件に一致する作業が見つかりません'
            : allTasks.length === 0
              ? '作業がまだ登録されていません。「作業追加」ボタンから作業を追加してください。'
              : 'アクティブな作業がありません'
          }
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => {
            const taskCost = getTaskCost(task);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={task.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {task.name}
                        </Typography>
                        
                        {task.description && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {task.description}
                          </Typography>
                        )}
                      </Box>
                      
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(task)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => openDeleteDialog(task)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Task Details */}
                    <Box sx={{ mb: 2 }}>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <TimerIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {formatTime(task.estimatedMinutes)}
                          </Typography>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                          <Chip
                            label={formatFrequency(task.frequency)}
                            size="small"
                            color={getFrequencyColor(task.frequency) as any}
                            variant="outlined"
                          />
                        </Box>
                      </Stack>
                    </Box>

                    {/* Cost Information */}
                    {taskCost && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          コスト情報
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              1回実行
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              ¥{Math.round(taskCost.singleExecutionCost).toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              年間コスト
                            </Typography>
                            <Typography variant="body1" fontWeight="medium" color="primary">
                              ¥{Math.round(taskCost.annualTotalCost).toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {/* Tags */}
                    {task.tags && task.tags.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                          {task.tags.slice(0, 3).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {task.tags.length > 3 && (
                            <Chip
                              label={`+${task.tags.length - 3}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Task Form Dialog */}
      <TaskForm
        open={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={editingTask ? handleEditTask : handleAddTask}
        editingTask={editingTask || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>作業削除の確認</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedTask?.name}</strong> を削除しますか？
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            この操作は取り消せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleDeleteTask} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};