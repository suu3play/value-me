import type { Team, TeamMember, CostCalculationMethod, TeamCostCalculation, CalculationResult } from '../types';
import { calculateHourlyWage } from './calculations';

/**
 * チームメンバー個別のコスト計算
 */
export const calculateMemberCost = (member: TeamMember): CalculationResult => {
  return calculateHourlyWage(member.salaryData);
};

/**
 * チーム全体のコスト計算
 */
export const calculateTeamCost = (
  team: Team,
  method: CostCalculationMethod = 'individual'
): TeamCostCalculation => {
  const activeMembers = team.members.filter(member => member.isActive);
  
  if (activeMembers.length === 0) {
    return {
      method,
      teamId: team.id,
      totalHourlyCost: 0,
      totalMonthlyCost: 0,
      totalAnnualCost: 0,
      memberBreakdown: [],
    };
  }

  // 各メンバーの計算結果を取得
  const memberResults = activeMembers.map(member => {
    const result = calculateMemberCost(member);
    return {
      member,
      result,
    };
  });

  let totalHourlyCost = 0;
  let totalMonthlyCost = 0;
  let totalAnnualCost = 0;

  switch (method) {
    case 'individual':
      // 個別計算: 各メンバーの実際のコストを合計
      totalHourlyCost = memberResults.reduce((sum, item) => sum + item.result.hourlyWage, 0);
      totalMonthlyCost = memberResults.reduce((sum, item) => sum + item.result.actualMonthlyIncome, 0);
      totalAnnualCost = memberResults.reduce((sum, item) => sum + item.result.actualAnnualIncome, 0);
      break;

    case 'average':
      // 平均計算: 平均単価 × 人数
      const avgHourlyWage = memberResults.reduce((sum, item) => sum + item.result.hourlyWage, 0) / memberResults.length;
      const avgMonthlyIncome = memberResults.reduce((sum, item) => sum + item.result.actualMonthlyIncome, 0) / memberResults.length;
      const avgAnnualIncome = memberResults.reduce((sum, item) => sum + item.result.actualAnnualIncome, 0) / memberResults.length;
      
      totalHourlyCost = avgHourlyWage * activeMembers.length;
      totalMonthlyCost = avgMonthlyIncome * activeMembers.length;
      totalAnnualCost = avgAnnualIncome * activeMembers.length;
      break;

    case 'byRole':
      // 役割別計算: 役割ごとの平均単価 × 人数
      const roleGroups = activeMembers.reduce((groups, member) => {
        if (!groups[member.role]) {
          groups[member.role] = [];
        }
        groups[member.role].push(member);
        return groups;
      }, {} as Record<string, TeamMember[]>);

      Object.entries(roleGroups).forEach(([, members]) => {
        const roleResults = members.map(member => calculateMemberCost(member));
        const roleAvgHourlyWage = roleResults.reduce((sum, result) => sum + result.hourlyWage, 0) / roleResults.length;
        const roleAvgMonthlyIncome = roleResults.reduce((sum, result) => sum + result.actualMonthlyIncome, 0) / roleResults.length;
        const roleAvgAnnualIncome = roleResults.reduce((sum, result) => sum + result.actualAnnualIncome, 0) / roleResults.length;
        
        totalHourlyCost += roleAvgHourlyWage * members.length;
        totalMonthlyCost += roleAvgMonthlyIncome * members.length;
        totalAnnualCost += roleAvgAnnualIncome * members.length;
      });
      break;
  }

  // メンバー別の詳細情報
  const memberBreakdown = memberResults.map(({ member, result }) => ({
    memberId: member.id,
    name: member.name,
    role: member.role,
    hourlyWage: result.hourlyWage,
    monthlyIncome: result.actualMonthlyIncome,
    annualIncome: result.actualAnnualIncome,
  }));

  return {
    method,
    teamId: team.id,
    totalHourlyCost,
    totalMonthlyCost,
    totalAnnualCost,
    memberBreakdown,
  };
};

/**
 * 複数のコスト計算方法での比較結果を取得
 */
export const compareCalculationMethods = (team: Team) => {
  const methods: CostCalculationMethod[] = ['individual', 'average', 'byRole'];
  
  return methods.map(method => ({
    method,
    result: calculateTeamCost(team, method),
    methodName: getMethodDisplayName(method),
  }));
};

/**
 * コスト計算方法の表示名を取得
 */
export const getMethodDisplayName = (method: CostCalculationMethod): string => {
  switch (method) {
    case 'individual':
      return '個別の単価';
    case 'average':
      return '平均単価';
    case 'byRole':
      return '役割毎の単価';
    default:
      return method;
  }
};

/**
 * チームの役割別統計を取得
 */
export const getTeamRoleStatistics = (team: Team) => {
  const activeMembers = team.members.filter(member => member.isActive);
  
  const roleGroups = activeMembers.reduce((groups, member) => {
    if (!groups[member.role]) {
      groups[member.role] = [];
    }
    groups[member.role].push(member);
    return groups;
  }, {} as Record<string, TeamMember[]>);

  return Object.entries(roleGroups).map(([role, members]) => {
    const memberResults = members.map(member => calculateMemberCost(member));
    
    const totalHourlyWage = memberResults.reduce((sum, result) => sum + result.hourlyWage, 0);
    const totalMonthlyIncome = memberResults.reduce((sum, result) => sum + result.actualMonthlyIncome, 0);
    const totalAnnualIncome = memberResults.reduce((sum, result) => sum + result.actualAnnualIncome, 0);
    
    const avgHourlyWage = totalHourlyWage / members.length;
    const avgMonthlyIncome = totalMonthlyIncome / members.length;
    const avgAnnualIncome = totalAnnualIncome / members.length;

    return {
      role,
      memberCount: members.length,
      totalHourlyWage,
      totalMonthlyIncome,
      totalAnnualIncome,
      avgHourlyWage,
      avgMonthlyIncome,
      avgAnnualIncome,
      members: memberResults.map((result, index) => ({
        ...members[index],
        calculationResult: result,
      })),
    };
  });
};

/**
 * チームコスト計算結果のサマリー統計を取得
 */
export const getTeamCostSummary = (teamCostCalculation: TeamCostCalculation) => {
  const { memberBreakdown } = teamCostCalculation;
  
  if (memberBreakdown.length === 0) {
    return {
      averageHourlyWage: 0,
      averageMonthlyIncome: 0,
      averageAnnualIncome: 0,
      highestPaidMember: null,
      lowestPaidMember: null,
      salaryRange: {
        hourly: { min: 0, max: 0, difference: 0 },
        monthly: { min: 0, max: 0, difference: 0 },
        annual: { min: 0, max: 0, difference: 0 },
      },
    };
  }

  const averageHourlyWage = memberBreakdown.reduce((sum, member) => sum + member.hourlyWage, 0) / memberBreakdown.length;
  const averageMonthlyIncome = memberBreakdown.reduce((sum, member) => sum + member.monthlyIncome, 0) / memberBreakdown.length;
  const averageAnnualIncome = memberBreakdown.reduce((sum, member) => sum + member.annualIncome, 0) / memberBreakdown.length;

  // 時給基準での最高・最低
  const highestPaidMember = memberBreakdown.reduce((highest, current) => 
    current.hourlyWage > highest.hourlyWage ? current : highest
  );
  const lowestPaidMember = memberBreakdown.reduce((lowest, current) => 
    current.hourlyWage < lowest.hourlyWage ? current : lowest
  );

  // 給与範囲
  const hourlyWages = memberBreakdown.map(m => m.hourlyWage);
  const monthlyIncomes = memberBreakdown.map(m => m.monthlyIncome);
  const annualIncomes = memberBreakdown.map(m => m.annualIncome);

  const salaryRange = {
    hourly: {
      min: Math.min(...hourlyWages),
      max: Math.max(...hourlyWages),
      difference: Math.max(...hourlyWages) - Math.min(...hourlyWages),
    },
    monthly: {
      min: Math.min(...monthlyIncomes),
      max: Math.max(...monthlyIncomes),
      difference: Math.max(...monthlyIncomes) - Math.min(...monthlyIncomes),
    },
    annual: {
      min: Math.min(...annualIncomes),
      max: Math.max(...annualIncomes),
      difference: Math.max(...annualIncomes) - Math.min(...annualIncomes),
    },
  };

  return {
    averageHourlyWage,
    averageMonthlyIncome,
    averageAnnualIncome,
    highestPaidMember,
    lowestPaidMember,
    salaryRange,
  };
};