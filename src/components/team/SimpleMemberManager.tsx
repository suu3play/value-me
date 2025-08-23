import React, { useState, useEffect } from 'react';
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
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { useTeamManagement } from '../../hooks/useTeamManagement';
import { useTeamAnalysis } from '../../hooks/useTeamAnalysis';
import { TeamMemberForm } from './TeamMemberForm';
import type { TeamMember } from '../../types';

export const SimpleMemberManager: React.FC = () => {
  const {
    teams,
    createTeam,
    addTeamMember,
    updateTeamMember,
    removeTeamMember,
  } = useTeamManagement();

  const { calculateMemberCost } = useTeamAnalysis();

  const [memberFormOpen, setMemberFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  // デフォルトチームを自動作成
  const workTeam = teams.length > 0 ? teams[0] : null;
  
  useEffect(() => {
    if (!workTeam) {
      createTeam('作業チーム', 'コスト計算用のデフォルトチーム');
    }
  }, [workTeam, createTeam]);

  const currentTeam = teams.length > 0 ? teams[0] : null;
  const members = currentTeam?.members || [];

  const handleAddMember = (memberData: {
    name: string;
    role: string;
    salaryData: any;
    notes?: string;
  }) => {
    if (currentTeam) {
      addTeamMember(
        currentTeam.id,
        memberData.name,
        memberData.role,
        memberData.salaryData,
        memberData.notes
      );
    }
  };

  const handleEditMember = (memberData: {
    name: string;
    role: string;
    salaryData: any;
    notes?: string;
  }) => {
    if (editingMember && currentTeam) {
      updateTeamMember(currentTeam.id, editingMember.id, {
        name: memberData.name,
        role: memberData.role,
        salaryData: memberData.salaryData,
        notes: memberData.notes,
      });
      setEditingMember(null);
    }
  };

  const handleDeleteMember = () => {
    if (selectedMember && currentTeam) {
      removeTeamMember(currentTeam.id, selectedMember.id);
      setDeleteDialogOpen(false);
      setSelectedMember(null);
    }
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setMemberFormOpen(true);
  };

  const openDeleteDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setDeleteDialogOpen(true);
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
            メンバー管理
          </Typography>
          <Typography variant="body2" color="text.secondary">
            給与情報を登録してコスト計算の基準を設定します
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

      {/* Members List */}
      {members.length === 0 ? (
        <Alert severity="info">
          メンバーがまだ登録されていません。「メンバー追加」ボタンからメンバーを追加してください。
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {members.map((member) => {
            const memberCost = getMemberCost(member);
            
            return (
              <Grid item xs={12} md={6} lg={4} key={member.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                          {getInitials(member.name)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h3">
                            {member.name}
                          </Typography>
                          <Chip 
                            label={member.role} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => openEditDialog(member)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => openDeleteDialog(member)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>

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
                            <Typography variant="h6" color="primary">
                              ¥{memberCost.hourlyWage.toLocaleString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2" color="text.secondary">
                              年収
                            </Typography>
                            <Typography variant="body1">
                              ¥{memberCost.actualAnnualIncome.toLocaleString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    )}

                    {member.notes && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                          {member.notes}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

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
            この操作は取り消せません。
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