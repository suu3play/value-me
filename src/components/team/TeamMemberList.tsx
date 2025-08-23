import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  IconButton,
  Switch,
  FormControlLabel,
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
} from '@mui/material';
import {
  Add as AddIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonOff as PersonOffIcon,
  Person as PersonIcon,
  Work as WorkIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useTeamManagement } from '../../hooks/useTeamManagement';
import { useTeamAnalysis } from '../../hooks/useTeamAnalysis';
import type { TeamMember } from '../../types';
import { TeamMemberForm } from './TeamMemberForm';

interface TeamMemberListProps {
  teamId: string;
}

export const TeamMemberList: React.FC<TeamMemberListProps> = ({ teamId }) => {
  const {
    getTeamById,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
    toggleMemberActive,
  } = useTeamManagement();

  const { calculateMemberCost } = useTeamAnalysis();

  const [showInactive, setShowInactive] = useState(false);
  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const team = getTeamById(teamId);

  if (!team) {
    return (
      <Alert severity="error">
        チームが見つかりません
      </Alert>
    );
  }

  const filteredMembers = team.members.filter(member => 
    showInactive ? true : member.isActive
  );

  const handleAddMember = (memberData: {
    name: string;
    role: string;
    salaryData: any;
    notes?: string;
  }) => {
    addTeamMember(
      teamId,
      memberData.name,
      memberData.role,
      memberData.salaryData,
      memberData.notes
    );
  };

  const handleEditMember = (memberData: {
    name: string;
    role: string;
    salaryData: any;
    notes?: string;
  }) => {
    if (editingMember) {
      updateTeamMember(teamId, editingMember.id, {
        name: memberData.name,
        role: memberData.role,
        salaryData: memberData.salaryData,
        notes: memberData.notes,
      });
      setEditingMember(null);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, member: TeamMember) => {
    setMenuAnchor(event.currentTarget);
    setSelectedMember(member);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedMember(null);
  };

  const openEditDialog = () => {
    if (selectedMember) {
      setEditingMember(selectedMember);
      setMemberFormOpen(true);
    }
    handleMenuClose();
  };

  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteMember = () => {
    if (selectedMember) {
      removeTeamMember(teamId, selectedMember.id);
      setDeleteDialogOpen(false);
      setSelectedMember(null);
    }
  };

  const handleToggleActive = () => {
    if (selectedMember) {
      toggleMemberActive(teamId, selectedMember.id);
    }
    handleMenuClose();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getMemberCost = (member: TeamMember) => {
    try {
      return calculateMemberCost(member);
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
            {team.name} - メンバー一覧
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {team.members.length} 名のメンバー（アクティブ: {team.members.filter(m => m.isActive).length} 名）
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setMemberFormOpen(true)}
          size="large"
        >
          メンバー追加
        </Button>
      </Box>

      {/* Controls */}
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showInactive}
              onChange={(e) => setShowInactive(e.target.checked)}
            />
          }
          label="非アクティブメンバーも表示"
        />
      </Box>

      {/* Members List */}
      {filteredMembers.length === 0 ? (
        <Alert severity="info">
          {showInactive 
            ? 'メンバーが登録されていません' 
            : 'アクティブなメンバーがいません'
          }
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {filteredMembers.map((member) => {
            const memberCost = getMemberCost(member);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={member.id}>
                <Card
                  sx={{
                    opacity: member.isActive ? 1 : 0.6,
                    border: !member.isActive ? '1px dashed' : '1px solid',
                    borderColor: !member.isActive ? 'grey.400' : 'divider',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Avatar sx={{ mr: 2, bgcolor: member.isActive ? 'primary.main' : 'grey.400' }}>
                          {getInitials(member.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3">
                            {member.name}
                            {!member.isActive && (
                              <Chip
                                label="非アクティブ"
                                size="small"
                                color="default"
                                sx={{ ml: 1 }}
                              />
                            )}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {member.role}
                          </Typography>
                        </Box>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, member)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </Box>

                    {member.notes && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {member.notes}
                      </Typography>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Cost Information */}
                    {memberCost && (
                      <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyIcon sx={{ mr: 0.5, fontSize: 16 }} />
                          コスト情報
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              時間単価
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              ¥{memberCost.hourlyWage.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              年収
                            </Typography>
                            <Typography variant="body1" fontWeight="medium">
                              ¥{memberCost.actualAnnualIncome.toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        参加日: {new Date(member.joinDate).toLocaleDateString('ja-JP')}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
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
            {selectedMember?.isActive ? (
              <PersonOffIcon fontSize="small" />
            ) : (
              <PersonIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {selectedMember?.isActive ? '非アクティブにする' : 'アクティブにする'}
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

      {/* Member Form Dialog */}
      <TeamMemberForm
        open={memberFormOpen}
        onClose={() => {
          setMemberFormOpen(false);
          setEditingMember(null);
        }}
        onSubmit={editingMember ? handleEditMember : handleAddMember}
        editingMember={editingMember || undefined}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>メンバー削除の確認</DialogTitle>
        <DialogContent>
          <Typography>
            <strong>{selectedMember?.name}</strong> を削除しますか？
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            この操作は取り消せません。削除されたメンバーのデータは完全に失われます。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            キャンセル
          </Button>
          <Button onClick={handleDeleteMember} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};