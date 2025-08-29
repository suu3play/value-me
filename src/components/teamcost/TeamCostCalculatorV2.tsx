import React, { useState, useEffect } from 'react';
import {
  Box,
} from '@mui/material';
import { MemberSalaryManager } from './MemberSalaryManager';
import { WorkItemManager } from './WorkItemManager';
import type { TeamCostData, CostCalculationResult } from '../../types/teamCost';
import { 
  calculateTeamCost, 
  createDefaultTeamCostData, 
  validateTeamCostData 
} from '../../utils/teamCostCalculations';

interface TeamCostCalculatorV2Props {
  onResultChange?: (result: CostCalculationResult | null) => void;
  onErrorsChange?: (errors: string[]) => void;
}

export const TeamCostCalculatorV2: React.FC<TeamCostCalculatorV2Props> = ({ 
  onResultChange, 
  onErrorsChange 
}) => {
  const [teamData, setTeamData] = useState<TeamCostData>(createDefaultTeamCostData());

  useEffect(() => {
    const validationErrors = validateTeamCostData(teamData);
    onErrorsChange?.(validationErrors);

    if (validationErrors.length === 0) {
      try {
        const calculationResult = calculateTeamCost(teamData);
        onResultChange?.(calculationResult);
      } catch {
        onResultChange?.(null);
      }
    } else {
      onResultChange?.(null);
    }

    // データ保存（ローカルストレージ）
    try {
      localStorage.setItem('team-cost-data-v2', JSON.stringify(teamData));
    } catch (error) {
      console.warn('データの保存に失敗しました:', error);
    }
  }, [teamData, onResultChange, onErrorsChange]);

  // 初期データ読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem('team-cost-data-v2');
      if (saved) {
        const parsedData = JSON.parse(saved);
        setTeamData({
          ...createDefaultTeamCostData(),
          ...parsedData,
        });
      }
    } catch (error) {
      console.warn('データの読み込みに失敗しました:', error);
    }
  }, []);

  const updateTeamData = (updates: Partial<TeamCostData>) => {
    setTeamData(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* メンバー構成・給与設定 */}
      <MemberSalaryManager
        positions={teamData.positions}
        salaryData={teamData.salaryData}
        onPositionsChange={(positions) => updateTeamData({ positions })}
        onSalaryChange={(salaryData) => updateTeamData({ salaryData })}
      />

      {/* 作業項目 */}
      <WorkItemManager
        workItems={teamData.workItems}
        onChange={(workItems) => updateTeamData({ workItems })}
      />
    </Box>
  );
};