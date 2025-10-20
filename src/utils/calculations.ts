import type { SalaryCalculationData, CalculationResult } from '../types';

export const calculateHourlyWage = (
    data: SalaryCalculationData
): CalculationResult => {
    // 入力値のvalidation
    const salaryAmount =
        isNaN(data.salaryAmount) || data.salaryAmount < 0
            ? 0
            : data.salaryAmount;
    const annualHolidays =
        isNaN(data.annualHolidays) || data.annualHolidays < 0
            ? 0
            : data.annualHolidays;
    const dailyWorkingHours =
        isNaN(data.dailyWorkingHours) || data.dailyWorkingHours < 0
            ? 0
            : data.dailyWorkingHours;

    // 年収の計算
    let annualIncome = salaryAmount;
    if (data.salaryType === 'monthly') {
        annualIncome = salaryAmount * 12;
    }

    // 実質年収の計算（オプション機能が有効な場合）
    let actualAnnualIncome = annualIncome;

    // 福利厚生の計算
    if (data.welfareInputMethod === 'total') {
        // 全体額で入力された場合
        const welfareAmount =
            isNaN(data.welfareAmount) || data.welfareAmount < 0
                ? 0
                : data.welfareAmount;
        let welfareAnnual = welfareAmount;
        if (data.welfareType === 'monthly') {
            welfareAnnual = welfareAmount * 12;
        }
        actualAnnualIncome += welfareAnnual;
    } else if (data.welfareInputMethod === 'individual') {
        // 各種手当の合算の場合
        const housingAllowance =
            isNaN(data.housingAllowance) || data.housingAllowance < 0
                ? 0
                : data.housingAllowance;
        const regionalAllowance =
            isNaN(data.regionalAllowance) || data.regionalAllowance < 0
                ? 0
                : data.regionalAllowance;
        const familyAllowance =
            isNaN(data.familyAllowance) || data.familyAllowance < 0
                ? 0
                : data.familyAllowance;
        const qualificationAllowance =
            isNaN(data.qualificationAllowance) ||
            data.qualificationAllowance < 0
                ? 0
                : data.qualificationAllowance;
        const otherAllowance =
            isNaN(data.otherAllowance) || data.otherAllowance < 0
                ? 0
                : data.otherAllowance;

        let allowancesAnnual =
            housingAllowance +
            regionalAllowance +
            familyAllowance +
            qualificationAllowance +
            otherAllowance;

        // 月額か年額かに応じて年額に変換
        if (data.welfareType === 'monthly') {
            allowancesAnnual = allowancesAnnual * 12;
        }

        actualAnnualIncome += allowancesAnnual;
    }

    // ボーナス
    const summerBonus =
        isNaN(data.summerBonus) || data.summerBonus < 0 ? 0 : data.summerBonus;
    const winterBonus =
        isNaN(data.winterBonus) || data.winterBonus < 0 ? 0 : data.winterBonus;
    const settlementBonus =
        isNaN(data.settlementBonus) || data.settlementBonus < 0
            ? 0
            : data.settlementBonus;
    const otherBonus =
        isNaN(data.otherBonus) || data.otherBonus < 0 ? 0 : data.otherBonus;

    const bonuses = summerBonus + winterBonus + settlementBonus + otherBonus;
    actualAnnualIncome += bonuses;

    // 年間休日の計算
    let totalAnnualHolidays = annualHolidays;

    // カスタム休日の追加（土日祝との重複を考慮）
    if (data.goldenWeekHolidays) {
        // GW休み: 年間休日の種類によって追加日数を調整
        let gwDays = 10;
        if (annualHolidays === 120 || annualHolidays === 124) {
            // 完全週休二日制の場合、土日分を除外
            gwDays = 6; // 平日のみ
        }
        if (annualHolidays === 124) {
            // 土日祝の場合、祝日分も除外（みどりの日、こどもの日等）
            gwDays = 4; // 平日のみで祝日除外
        }
        totalAnnualHolidays += gwDays;
    }

    if (data.obon) {
        // お盆休み: 通常平日のため、そのまま追加
        totalAnnualHolidays += 5;
    }

    if (data.yearEndNewYear) {
        // 年末年始休み: 年間休日の種類によって追加日数を調整
        let yearEndDays = 6;
        if (annualHolidays === 120 || annualHolidays === 124) {
            // 完全週休二日制の場合、土日分を除外
            yearEndDays = 4; // 平日のみ
        }
        if (annualHolidays === 124) {
            // 土日祝の場合、元日分も除外
            yearEndDays = 3; // 平日のみで祝日除外
        }
        totalAnnualHolidays += yearEndDays;
    }

    const customHolidays =
        isNaN(data.customHolidays) || data.customHolidays < 0
            ? 0
            : data.customHolidays;
    totalAnnualHolidays += customHolidays;

    // 年間総労働時間の計算
    const workingDays = 365 - totalAnnualHolidays;

    // 労働時間の単位に応じて1日あたりの労働時間を計算
    let actualDailyWorkingHours = dailyWorkingHours;
    switch (data.workingHoursType) {
        case 'weekly':
            actualDailyWorkingHours = dailyWorkingHours / 5; // 週5日勤務と仮定
            break;
        case 'monthly':
            actualDailyWorkingHours = dailyWorkingHours / 22; // 月22日勤務と仮定
            break;
        default:
            actualDailyWorkingHours = dailyWorkingHours;
    }

    const totalWorkingHours = workingDays * actualDailyWorkingHours;

    // 残業代の計算
    const overtimeHours = isNaN(data.overtimeHours || 0) || (data.overtimeHours || 0) < 0 ? 0 : (data.overtimeHours || 0);
    const nightOvertimeHours = isNaN(data.nightOvertimeHours || 0) || (data.nightOvertimeHours || 0) < 0 ? 0 : (data.nightOvertimeHours || 0);
    const totalOvertimeHours = overtimeHours + nightOvertimeHours;

    // 基本時給の計算（残業代を除く月給ベース）
    // 月平均勤務日数を21.7日として計算
    const monthlyBaseSalary = data.salaryType === 'monthly' ? salaryAmount : salaryAmount / 12;
    const monthlyBaseWorkingHours = actualDailyWorkingHours * 21.7;
    const baseHourlyWage = monthlyBaseWorkingHours > 0 ? monthlyBaseSalary / monthlyBaseWorkingHours : 0;

    // 残業代の計算（割増率適用）
    const normalOvertimePay = baseHourlyWage * 1.25 * overtimeHours;  // 通常残業：1.25倍
    const nightOvertimePay = baseHourlyWage * 1.5 * nightOvertimeHours;  // 深夜残業：1.5倍
    const monthlyOvertimePay = normalOvertimePay + nightOvertimePay;

    // 残業代を年収に加算
    const annualOvertimePay = monthlyOvertimePay * 12;
    actualAnnualIncome += annualOvertimePay;

    // 残業時間を年間労働時間に加算
    const annualOvertimeHours = totalOvertimeHours * 12;
    const totalWorkingHoursWithOvertime = totalWorkingHours + annualOvertimeHours;

    // 時給の計算（残業代・残業時間を含む）
    const hourlyWage =
        totalWorkingHoursWithOvertime > 0 ? actualAnnualIncome / totalWorkingHoursWithOvertime : 0;


    return {
        hourlyWage: isNaN(hourlyWage) ? 0 : Math.round(hourlyWage),
        actualAnnualIncome: isNaN(actualAnnualIncome)
            ? 0
            : Math.round(actualAnnualIncome),
        actualMonthlyIncome: isNaN(actualAnnualIncome)
            ? 0
            : Math.round(actualAnnualIncome / 12),
        totalWorkingHours: isNaN(totalWorkingHoursWithOvertime)
            ? 0
            : Math.round(totalWorkingHoursWithOvertime),
        totalAnnualHolidays: isNaN(totalAnnualHolidays)
            ? 0
            : totalAnnualHolidays,
        baseHourlyWage: totalOvertimeHours > 0 ? Math.round(baseHourlyWage) : undefined,
        overtimePay: totalOvertimeHours > 0 ? Math.round(monthlyOvertimePay) : undefined,
        totalOvertimeHours: totalOvertimeHours > 0 ? totalOvertimeHours : undefined,
    };
};

export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ja-JP', {
        style: 'currency',
        currency: 'JPY',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

export const formatNumber = (number: number): string => {
    return new Intl.NumberFormat('ja-JP').format(number);
};
