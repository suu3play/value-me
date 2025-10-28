# Issue 73: 計算方法の変更 - 詳細改修計画

**Issue番号**: #73
**タイトル**: 計算方法の変更
**作成日**: 2025-10-21
**ブランチ名**: `feature/issue-73`

---

## 概要

給与計算方法を月収ベースに統一し、残業入力方式を「残業時間入力」と「固定残業代入力」の2方式から選択できるように変更する大規模リファクタリング。

### 主要な変更内容

1. **給与種別の統一**: 月収/年収の選択を廃止し、月収（基本給）のみに統一
2. **給与の分離**: 基本給と残業代を分離して入力
3. **残業入力方式の追加**:
   - 方式A: 残業時間入力（既存）
   - 方式B: 固定残業代入力（新規）+ 逆算残業時間表示
4. **比較機能への適用**: 同様の変更を適用

---

## 影響範囲

### 変更が必要なファイル（優先順）

#### 必須（コア機能）
1. `src/types/index.ts` - 型定義の変更
2. `src/App.tsx` - 初期データ定義の変更
3. `src/utils/calculations.ts` - 計算ロジックの完全書き換え
4. `src/utils/dynamicHolidayCalculations.ts` - 動的祝日計算の対応
5. `src/components/BasicInputForm.tsx` - 給与入力UIの完全書き換え

#### 重要（関連機能）
6. `src/components/ComparisonForm.tsx` - 比較機能の対応
7. `src/hooks/useCalculationHistory.ts` - データマイグレーション
8. `src/hooks/useComparison.ts` - 比較機能のロジック更新
9. `src/components/ResultDisplay.tsx` - 結果表示の更新

#### 補助（その他）
10. `src/utils/validation.ts` - バリデーション追加
11. `src/components/OptionsForm.tsx` - 残業入力セクションの移動
12. チーム機能関連コンポーネント（影響を受ける可能性）

---

## 実装手順

### Phase 1: 型定義と基盤整備

#### 1-1. 型定義の変更 (`src/types/index.ts`)

```typescript
export interface SalaryCalculationData {
  // 給与情報（月額ベース）
  baseSalary: number;                      // 基本給（月額）
  overtimeInputMode: 'hours' | 'fixed';    // 残業入力方式

  // 残業情報（方式A: 時間入力）
  overtimeHours?: number;                  // 通常残業時間
  nightOvertimeHours?: number;             // 深夜残業時間（22時〜5時）

  // 残業情報（方式B: 固定残業代）
  fixedOvertimePay?: number;               // 固定残業代（月額）

  // 労働時間情報
  annualHolidays: number;
  dailyWorkingHours: number;
  workingHoursType: 'daily' | 'weekly' | 'monthly';

  // 祝日計算オプション
  useDynamicHolidays?: boolean;
  holidayYear?: number;
  holidayYearType?: 'calendar' | 'fiscal';

  // オプション機能
  enableBenefits: boolean;
  welfareAmount: number;
  welfareType: 'monthly' | 'annual';
  welfareInputMethod: 'total' | 'individual';

  // 手当
  housingAllowance: number;
  regionalAllowance: number;
  familyAllowance: number;
  qualificationAllowance: number;
  otherAllowance: number;

  // ボーナス
  summerBonus: number;
  winterBonus: number;
  settlementBonus: number;
  otherBonus: number;

  // カスタム休日
  goldenWeekHolidays: boolean;
  obon: boolean;
  yearEndNewYear: boolean;
  customHolidays: number;

  // 後方互換性のため残す（非推奨）
  salaryType?: 'monthly' | 'annual';
  salaryAmount?: number;
}

export interface CalculationResult {
  hourlyWage: number;
  actualAnnualIncome: number;
  actualMonthlyIncome: number;
  totalWorkingHours: number;
  totalAnnualHolidays: number;
  baseHourlyWage?: number;              // 基本時給（残業代計算用）
  overtimePay?: number;                 // 月間残業代合計
  totalOvertimeHours?: number;          // 月間残業時間合計
  calculatedOvertimeHours?: number;     // 固定残業代から逆算した残業時間（月間）
}
```

#### 1-2. App.tsx初期データの変更

```typescript
const initialData: SalaryCalculationData = {
    baseSalary: 200000,
    overtimeInputMode: 'hours',
    annualHolidays: 119,
    dailyWorkingHours: 8,
    workingHoursType: 'daily',
    useDynamicHolidays: true,
    holidayYear: (() => {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        return currentMonth >= 4 ? currentYear : currentYear - 1;
    })(),
    holidayYearType: 'fiscal',
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
    overtimeHours: 0,
    nightOvertimeHours: 0,
    fixedOvertimePay: 0,
};
```

---

### Phase 2: 計算ロジックの変更

#### 2-1. データマイグレーション関数の追加 (`src/utils/calculations.ts`)

```typescript
/**
 * 旧形式のデータを新形式に変換
 */
export function migrateLegacyData(data: any): SalaryCalculationData {
  // 新形式の場合はそのまま返す
  if (data.baseSalary !== undefined && data.overtimeInputMode !== undefined) {
    return data;
  }

  // 旧形式から変換
  const baseSalary = data.salaryType === 'monthly'
    ? data.salaryAmount
    : Math.round(data.salaryAmount / 12);

  return {
    ...data,
    baseSalary,
    overtimeInputMode: 'hours', // デフォルトは時間入力
    fixedOvertimePay: 0,
    // 旧フィールドは削除される
  };
}
```

#### 2-2. 固定残業代からの逆算関数

```typescript
/**
 * 固定残業代から残業時間を逆算
 * @param fixedOvertimePay 固定残業代（月額）
 * @param baseHourlyWage 基本時給
 * @returns 逆算された月間残業時間
 */
function calculateOvertimeHoursFromPay(
  fixedOvertimePay: number,
  baseHourlyWage: number
): number {
  if (baseHourlyWage <= 0) return 0;

  // 標準的な割増率（1.25倍）で逆算
  // ※深夜残業を考慮しない簡易計算
  const overtimeHourlyRate = baseHourlyWage * 1.25;
  return fixedOvertimePay / overtimeHourlyRate;
}
```

#### 2-3. メイン計算関数の変更 (`calculateHourlyWage`)

**主要な変更点**:

```typescript
export const calculateHourlyWage = (
    data: SalaryCalculationData
): CalculationResult => {
    // 1. データマイグレーション
    const migratedData = migrateLegacyData(data);

    // 2. 基本給のバリデーション
    const baseSalary = isNaN(migratedData.baseSalary) || migratedData.baseSalary < 0
        ? 0
        : migratedData.baseSalary;

    // 3. 年収の計算（常に月収ベース）
    let annualIncome = baseSalary * 12;

    // 4. 基本時給の計算（残業代を除く）
    const monthlyAverageWorkingDays = workingDays / 12;
    const monthlyBaseWorkingHours = actualDailyWorkingHours * monthlyAverageWorkingDays;
    const baseHourlyWage = monthlyBaseWorkingHours > 0
        ? baseSalary / monthlyBaseWorkingHours
        : 0;

    // 5. 残業代の計算（入力方式による分岐）
    let annualOvertimePay = 0;
    let annualOvertimeHours = 0;
    let calculatedOvertimeHours = undefined;

    if (migratedData.overtimeInputMode === 'hours') {
        // 方式A: 残業時間から計算（既存ロジック）
        const normalOvertimeHours = migratedData.overtimeHours || 0;
        const nightOvertimeHours = migratedData.nightOvertimeHours || 0;

        // 年間換算
        switch (migratedData.workingHoursType) {
            case 'daily':
                annualOvertimeHours = (normalOvertimeHours + nightOvertimeHours) * workingDays;
                break;
            case 'weekly':
                annualOvertimeHours = (normalOvertimeHours + nightOvertimeHours) * 52.14;
                break;
            default: // monthly
                annualOvertimeHours = (normalOvertimeHours + nightOvertimeHours) * 12;
        }

        // 残業代計算
        const normalPay = baseHourlyWage * 1.25 * (normalOvertimeHours * 12);
        const nightPay = baseHourlyWage * 1.5 * (nightOvertimeHours * 12);
        annualOvertimePay = normalPay + nightPay;

    } else {
        // 方式B: 固定残業代から逆算
        const monthlyFixedPay = migratedData.fixedOvertimePay || 0;
        annualOvertimePay = monthlyFixedPay * 12;

        // 逆算した残業時間を計算
        calculatedOvertimeHours = calculateOvertimeHoursFromPay(
            monthlyFixedPay,
            baseHourlyWage
        );

        // 年間残業時間も計算（表示用）
        annualOvertimeHours = (calculatedOvertimeHours || 0) * 12;
    }

    // 6. 残業代を年収に加算
    actualAnnualIncome += annualOvertimePay;

    // 7. 残業時間を年間労働時間に加算
    const totalWorkingHoursWithOvertime = totalWorkingHours + annualOvertimeHours;

    // 8. 時給の計算（残業代・残業時間を含む）
    const hourlyWage = totalWorkingHoursWithOvertime > 0
        ? actualAnnualIncome / totalWorkingHoursWithOvertime
        : 0;

    // 9. 結果を返す
    return {
        hourlyWage: isNaN(hourlyWage) ? 0 : Math.round(hourlyWage),
        actualAnnualIncome: isNaN(actualAnnualIncome) ? 0 : Math.round(actualAnnualIncome),
        actualMonthlyIncome: isNaN(actualAnnualIncome) ? 0 : Math.round(actualAnnualIncome / 12),
        totalWorkingHours: isNaN(totalWorkingHoursWithOvertime) ? 0 : Math.round(totalWorkingHoursWithOvertime),
        totalAnnualHolidays: isNaN(totalAnnualHolidays) ? 0 : totalAnnualHolidays,
        baseHourlyWage: annualOvertimeHours > 0 ? Math.round(baseHourlyWage) : undefined,
        overtimePay: annualOvertimeHours > 0 ? Math.round(annualOvertimePay / 12) : undefined,
        totalOvertimeHours: annualOvertimeHours > 0 ? Math.round(annualOvertimeHours / 12) : undefined,
        calculatedOvertimeHours: calculatedOvertimeHours !== undefined
            ? Math.round(calculatedOvertimeHours)
            : undefined,
    };
};
```

#### 2-4. dynamicHolidayCalculations.tsの対応

`calculateHourlyWageWithDynamicHolidays`関数に同様の変更を適用。

---

### Phase 3: UI変更

#### 3-1. BasicInputFormの給与入力セクション変更

**変更箇所**: `src/components/BasicInputForm.tsx`

**削除する要素**:
- 給与種別トグルボタン（月収/年収）
- `salaryAmount`フィールド

**追加する要素**:
```tsx
{/* 基本給入力 */}
<ValidatedInput
  id="base-salary"
  label="基本給（月額）"
  value={data.baseSalary}
  onChange={(value) => onChange({ ...data, baseSalary: value })}
  validator={validateSalary}
  type="integer"
  step={1000}
  unit="円"
  showIncrementButtons
  helperText="基本給を入力してください（残業代を除く）"
/>
```

#### 3-2. 残業入力セクションの追加

**追加位置**: BasicInputFormの労働時間セクションの直後

```tsx
{/* 残業入力方式の切り替え */}
<Box sx={{ mt: 3 }}>
  <Typography variant="subtitle2" gutterBottom>
    残業代入力
  </Typography>
  <ToggleButtonGroup
    value={data.overtimeInputMode}
    exclusive
    onChange={(_, newMode) => {
      if (newMode !== null) {
        onChange({ ...data, overtimeInputMode: newMode });
      }
    }}
    aria-label="残業入力方式"
    fullWidth
  >
    <ToggleButton value="hours" aria-label="残業時間入力">
      残業時間入力
    </ToggleButton>
    <ToggleButton value="fixed" aria-label="固定残業代入力">
      固定残業代入力
    </ToggleButton>
  </ToggleButtonGroup>
</Box>

{/* 方式A: 残業時間入力 */}
{data.overtimeInputMode === 'hours' && (
  <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
    <ValidatedInput
      id="overtime-hours"
      label="通常残業時間"
      value={data.overtimeHours || 0}
      onChange={(value) => onChange({ ...data, overtimeHours: value })}
      validator={(value) => validateWorkingHours(value, data.workingHoursType)}
      type="number"
      step={0.5}
      unit={`時間/${workingHoursTypeLabel[data.workingHoursType]}`}
      showIncrementButtons
      helperText="通常残業時間（1.25倍）"
      sx={{ flex: 1 }}
    />
    <ValidatedInput
      id="night-overtime-hours"
      label="深夜残業時間"
      value={data.nightOvertimeHours || 0}
      onChange={(value) => onChange({ ...data, nightOvertimeHours: value })}
      validator={(value) => validateWorkingHours(value, data.workingHoursType)}
      type="number"
      step={0.5}
      unit={`時間/${workingHoursTypeLabel[data.workingHoursType]}`}
      showIncrementButtons
      helperText="深夜残業時間（1.5倍、22時〜5時）"
      sx={{ flex: 1 }}
    />
  </Box>
)}

{/* 方式B: 固定残業代入力 */}
{data.overtimeInputMode === 'fixed' && (
  <Box sx={{ mt: 2 }}>
    <ValidatedInput
      id="fixed-overtime-pay"
      label="固定残業代（月額）"
      value={data.fixedOvertimePay || 0}
      onChange={(value) => onChange({ ...data, fixedOvertimePay: value })}
      validator={validateSalary}
      type="integer"
      step={1000}
      unit="円"
      showIncrementButtons
      helperText="固定残業代を入力してください"
    />

    {/* 逆算した残業時間の表示 */}
    {result?.calculatedOvertimeHours !== undefined && (
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          固定残業代から逆算した残業時間:
          <strong> 約{result.calculatedOvertimeHours.toFixed(1)}時間/月</strong>
        </Typography>
        <Typography variant="caption" color="text.secondary">
          ※通常残業（1.25倍）として計算した概算値です
        </Typography>
      </Alert>
    )}
  </Box>
)}
```

**重要**: `result`をpropsで受け取るか、計算ロジックをコンポーネント内に含める必要があります。

#### 3-3. ResultDisplayの更新

固定残業代モード時の表示を追加:

```tsx
{result.calculatedOvertimeHours !== undefined && (
  <Box>
    <Typography variant="body2" color="inherit" sx={{ opacity: 0.9 }}>
      逆算残業時間
    </Typography>
    <Typography variant="body1" fontWeight="bold">
      約{result.calculatedOvertimeHours.toFixed(1)}時間/月
    </Typography>
  </Box>
)}
```

---

### Phase 4: データマイグレーション

#### 4-1. useCalculationHistoryの更新

```typescript
// 履歴データを読み込む際にマイグレーション
const loadHistory = useCallback(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    const parsed = JSON.parse(saved);
    return parsed.map((entry: any) => ({
      ...entry,
      inputData: migrateLegacyData(entry.inputData)
    }));
  } catch (error) {
    console.error('履歴の読み込みに失敗しました:', error);
    return [];
  }
}, []);
```

#### 4-2. useComparisonの更新

比較アイテムのデータも同様にマイグレーション。

---

### Phase 5: ComparisonFormの対応

BasicInputFormと同様の変更を適用。

---

## バリデーション

### 追加が必要なバリデーション

```typescript
// src/utils/validation.ts

/**
 * 固定残業代のバリデーション
 */
export function validateFixedOvertimePay(
  value: number,
  baseSalary: number
): { isValid: boolean; errorMessage?: string } {
  if (value < 0) {
    return { isValid: false, errorMessage: '0円以上で入力してください' };
  }

  if (value > baseSalary) {
    return {
      isValid: true,
      errorMessage: '固定残業代が基本給を超えています（警告）'
    };
  }

  if (value > 100000000) {
    return { isValid: false, errorMessage: '1億円以下で入力してください' };
  }

  return { isValid: true };
}
```

---

## テスト項目

### 必須テスト

- [ ] TypeScript型チェック成功
- [ ] ESLintチェック成功
- [ ] ビルド成功
- [ ] 基本給入力が正常に動作
- [ ] 残業入力方式の切り替えが動作
- [ ] 残業時間入力モードでの計算が正確
- [ ] 固定残業代入力モードでの計算が正確
- [ ] 固定残業代からの逆算が正確
- [ ] 逆算残業時間の表示が正常
- [ ] 旧データのマイグレーションが正常に動作
- [ ] 履歴データの互換性確認
- [ ] 比較機能が正常に動作
- [ ] チーム機能への影響確認

### 計算精度の検証

**テストケース1**: 残業時間入力モード
```
基本給: 300,000円
年間休日: 120日
労働時間: 8時間/日
通常残業: 20時間/月
深夜残業: 5時間/月

期待結果:
- 基本時給: 約1,838円
- 通常残業代: 約45,950円/月
- 深夜残業代: 約13,785円/月
- 月間残業代合計: 約59,735円
- 実質月収: 約359,735円
```

**テストケース2**: 固定残業代入力モード
```
基本給: 300,000円
年間休日: 120日
労働時間: 8時間/日
固定残業代: 60,000円/月

期待結果:
- 基本時給: 約1,838円
- 逆算残業時間: 約26.1時間/月
- 実質月収: 360,000円
```

---

## 注意事項

### 破壊的変更

1. **localStorage互換性**
   - 旧データは自動的に新形式に変換される
   - マイグレーション後、旧フィールドは削除される

2. **URL共有機能への影響**
   - URLパラメータの形式が変わる可能性
   - 旧URLとの互換性は保たれない

3. **エクスポート機能**
   - エクスポートされたデータ形式が変わる

### ユーザーへの通知

大きな変更のため、リリース時に以下を通知:
- 給与入力方法の変更（年収廃止）
- 新機能（固定残業代入力）の説明
- データ移行について（自動で行われる旨）

---

## 実装の優先順位

### 高優先度（必須）
1. 型定義の変更
2. calculations.tsの書き換え
3. BasicInputFormの改修
4. データマイグレーション

### 中優先度（重要）
5. dynamicHolidayCalculations.tsの対応
6. ResultDisplayの更新
7. ComparisonFormの対応

### 低優先度（補助）
8. バリデーション強化
9. エラーハンドリング改善
10. UIの細かな調整

---

## 見積もり工数

- Phase 1（型定義・基盤）: 2-3時間
- Phase 2（計算ロジック）: 3-4時間
- Phase 3（UI変更）: 4-5時間
- Phase 4（マイグレーション）: 1-2時間
- Phase 5（比較機能）: 2-3時間
- テスト・デバッグ: 4-6時間

**合計**: 16-23時間

---

## 次回作業開始時のコマンド

```bash
# 1. mainブランチを最新化
git checkout main
git pull

# 2. 作業ブランチを作成
git checkout -b feature/issue-73

# 3. この計画ファイルを確認
cat .claude/plans/issue-73-implementation-plan.md

# 4. Phase 1から実装開始
```

---

## 実装完了後のチェックリスト

- [ ] すべてのTypeScriptエラーを解消
- [ ] ESLint警告（新規）を解消
- [ ] ビルドが成功
- [ ] すべてのテストケースをパス
- [ ] 旧データのマイグレーションを確認
- [ ] 手動テストで動作確認
- [ ] コミット・プッシュ
- [ ] プルリクエスト作成

---

**最終更新**: 2025-10-21
**計画作成者**: Claude Code
**レビュー状態**: 未レビュー
