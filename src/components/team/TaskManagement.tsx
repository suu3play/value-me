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
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  Timer as TimerIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material';
import { useTaskManagement } from '../../hooks/useTaskManagement';
import type { TaskDefinition, TaskFrequency } from '../../types';
import { TaskForm } from './TaskForm';

interface TaskManagementProps {
  teamId: string;
  teamName: string;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({ teamId, teamName }) => {
  const {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    getTasksByTeam,
  } = useTaskManagement();

  const [showInactive, setShowInactive] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDefinition | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskDefinition | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const teamTasks = getTasksByTeam(teamId);
  
  const filteredTasks = teamTasks.filter(task => {
    const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesActive = showInactive ? true : task.isActive;
    
    return matchesSearch && matchesActive;
  });

  const handleAddTask = (taskData: {
    name: string;
    description?: string;
    estimatedMinutes: number;
    frequency: TaskFrequency;
    tags?: string[];
  }) => {
    createTask(
      taskData.name,
      teamId,
      taskData.estimatedMinutes,
      taskData.frequency,
      taskData.description,
      taskData.tags
    );
  };

  const handleEditTask = (taskData: {
    name: string;
    description?: string;
    estimatedMinutes: number;
    frequency: TaskFrequency;
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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, task: TaskDefinition) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTask(task);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedTask(null);
  };

  const openEditDialog = () => {
    if (selectedTask) {
      setEditingTask(selectedTask);
      setTaskFormOpen(true);
    }
    handleMenuClose();
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteTask = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setDeleteDialogOpen(false);
      setSelectedTask(null);
    }
  };

  const handleToggleActive = () => {
    if (selectedTask) {
      updateTask(selectedTask.id, { isActive: !selectedTask.isActive });
    }
    handleMenuClose();
  };

  const formatFrequency = (frequency: TaskFrequency): string => {
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

  const formatEstimatedTime = (minutes: number): string => {
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

  const getFrequencyColor = (frequency: TaskFrequency) => {
    switch (frequency.type) {
      case 'daily': return 'error';
      case 'weekly': return 'warning';
      case 'monthly': return 'info';
      case 'yearly': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            {teamName} - 作業管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {teamTasks.length} 件の作業（アクティブ: {teamTasks.filter(t => t.isActive).length} 件）
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setTaskFormOpen(true)}
          size="large"
        >
          作業追加
        </Button>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
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
          sx={{ minWidth: 250 }}
        />
        
        <FormControlLabel
          control={
            <Switch
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
          }
          label="非アクティブも表示"
        />
      </Box>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Alert severity="info">
          {searchTerm 
            ? '検索条件に一致する作業が見つかりません'
            : teamTasks.length === 0
              ? '作業が登録されていません。「作業追加」ボタンから作業を追加してください。'
              : 'アクティブな作業がありません'
          }
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredTasks.map((task) => (
            <Grid item xs={12} md={6} lg={4} key={task.id}>
              <Card
                sx={{
                  opacity: task.isActive ? 1 : 0.6,
                  border: !task.isActive ? '1px dashed' : '1px solid',
                  borderColor: !task.isActive ? 'grey.400' : 'divider',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {task.name}
                        {!task.isActive && (
                          <Chip
                            label="非アクティブ"
                            size="small"
                            color="default"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      
                      {task.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {task.description}
                        </Typography>
                      )}
                    </Box>
                    
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, task)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Task Details */}
                  <Box sx={{ mb: 2 }}>
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TimerIcon sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          見積時間: {formatEstimatedTime(task.estimatedMinutes)}
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

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap">
                        {task.tags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            size="small"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      作成日: {new Date(task.createdAt).toLocaleDateString('ja-JP')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={openEditDialog}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>編集</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={handleToggleActive}>
          <ListItemIcon>
            <AssignmentIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            {selectedTask?.isActive ? '非アクティブにする' : 'アクティブにする'}
          </ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={openDeleteDialog} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>削除</ListItemText>
        </MenuItem>
      </Menu>

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
            この操作は取り消せません。削除された作業のデータは完全に失われます。
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