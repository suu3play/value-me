import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Stack,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useTeamManagement } from '../../hooks/useTeamManagement';
import type { Team } from '../../types';

interface TeamManagementProps {
  onTeamSelect?: (team: Team) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ onTeamSelect }) => {
  const {
    teams,
    currentTeam,
    setCurrentTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    getTeamStats,
  } = useTeamManagement();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleCreateTeam = () => {
    if (formData.name.trim()) {
      const newTeam = createTeam(formData.name.trim(), formData.description.trim() || undefined);
      setFormData({ name: '', description: '' });
      setIsCreateDialogOpen(false);
      
      if (onTeamSelect) {
        onTeamSelect(newTeam);
      }
    }
  };

  const handleEditTeam = () => {
    if (editingTeam && formData.name.trim()) {
      updateTeam(editingTeam.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
      });
      setFormData({ name: '', description: '' });
      setEditingTeam(null);
      setIsEditDialogOpen(false);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    if (window.confirm('本当にこのチームを削除しますか？\nメンバー情報と関連する作業データもすべて削除されます。')) {
      deleteTeam(teamId);
    }
  };

  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setFormData({
      name: team.name,
      description: team.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleTeamClick = (team: Team) => {
    setCurrentTeam(team);
    if (onTeamSelect) {
      onTeamSelect(team);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          チーム管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
          size="large"
        >
          新規チーム作成
        </Button>
      </Box>

      {/* Teams List */}
      {teams.length === 0 ? (
        <Alert severity="info">
          チームが作成されていません。「新規チーム作成」ボタンからチームを作成してください。
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {teams.map((team) => {
            const stats = getTeamStats(team.id);
            const isCurrentTeam = currentTeam?.id === team.id;
            
            return (
              <Grid item xs={12} md={6} lg={4} key={team.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    border: isCurrentTeam ? 2 : 1,
                    borderColor: isCurrentTeam ? 'primary.main' : 'divider',
                    '&:hover': {
                      boxShadow: 2,
                    },
                  }}
                  onClick={() => handleTeamClick(team)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" component="h3">
                        {team.name}
                        {isCurrentTeam && (
                          <Chip
                            label="選択中"
                            size="small"
                            color="primary"
                            sx={{ ml: 1 }}
                          />
                        )}
                      </Typography>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(team);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTeam(team.id);
                          }}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

                    {team.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {team.description}
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Team Stats */}
                    {stats && (
                      <Box>
                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              総メンバー数
                            </Typography>
                            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                              <PeopleIcon sx={{ mr: 0.5, fontSize: 20 }} />
                              {stats.totalMembers}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              アクティブ
                            </Typography>
                            <Typography variant="h6" color="primary">
                              {stats.activeMemberCount}
                            </Typography>
                          </Grid>
                        </Grid>

                        {stats.roles.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              役割
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap">
                              {stats.roles.slice(0, 3).map((role) => (
                                <Chip
                                  key={role}
                                  label={role}
                                  size="small"
                                  variant="outlined"
                                />
                              ))}
                              {stats.roles.length > 3 && (
                                <Chip
                                  label={`+${stats.roles.length - 3}`}
                                  size="small"
                                  variant="outlined"
                                />
                              )}
                            </Stack>
                          </Box>
                        )}
                      </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        作成日: {new Date(team.createdAt).toLocaleDateString('ja-JP')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Team Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>新規チーム作成</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="チーム名"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="説明（任意）"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleCreateTeam}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            作成
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>チーム編集</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="チーム名"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="説明（任意）"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>
            キャンセル
          </Button>
          <Button
            onClick={handleEditTeam}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            更新
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};