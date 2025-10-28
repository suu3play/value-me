# Issue 73 実装開始クイックガイド

## 次回作業開始時の手順

### 1. 準備

```bash
cd "D:\自己開発\value-me"
git checkout main
git pull
git checkout -b feature/issue-73
```

### 2. 計画確認

詳細な実装計画は以下を参照:
```bash
cat .claude/plans/issue-73-implementation-plan.md
```

### 3. 実装順序（Phase順）

#### Phase 1: 型定義と基盤整備 (2-3時間)
1. `src/types/index.ts` を編集
   - `SalaryCalculationData`の変更
   - `CalculationResult`の変更
2. `src/App.tsx` の`initialData`を更新

#### Phase 2: 計算ロジック (3-4時間)
1. `src/utils/calculations.ts`
   - `migrateLegacyData`関数追加
   - `calculateOvertimeHoursFromPay`関数追加
   - `calculateHourlyWage`関数の書き換え
2. `src/utils/dynamicHolidayCalculations.ts`
   - 同様の変更を適用

#### Phase 3: UI変更 (4-5時間)
1. `src/components/BasicInputForm.tsx`
   - 給与種別トグルを削除
   - 基本給入力に変更
   - 残業入力セクション追加
2. `src/components/ResultDisplay.tsx`
   - 逆算残業時間表示追加

#### Phase 4: データマイグレーション (1-2時間)
1. `src/hooks/useCalculationHistory.ts`
   - マイグレーション処理追加

#### Phase 5: 比較機能 (2-3時間)
1. `src/components/ComparisonForm.tsx`
   - BasicInputFormと同様の変更

### 4. テスト・品質チェック (4-6時間)

```bash
# 型チェック
npx tsc --noEmit

# Lint
npm run lint

# ビルド
npm run build
```

### 5. コミット

```bash
git add .
git commit -m "feat: 計算方法を月収ベースに変更し固定残業代入力に対応 #73"
git push -u origin feature/issue-73
```

### 6. PR作成

```bash
gh pr create --title "feat: 計算方法を月収ベースに変更し固定残業代入力に対応 #73"
```

---

## 重要な変更ポイント

### 型定義の変更
- `salaryType`と`salaryAmount`を`baseSalary`に統合
- `overtimeInputMode`を追加（'hours' | 'fixed'）
- `fixedOvertimePay`を追加
- `calculatedOvertimeHours`を追加（結果）

### 計算ロジックの変更
- 年収計算を`baseSalary * 12`に簡略化
- 残業代計算を入力方式で分岐
- 固定残業代からの逆算ロジック追加

### UI変更
- 給与種別トグルボタンを削除
- 残業入力方式の切り替えトグルを追加
- 固定残業代入力時に逆算残業時間を表示

---

## トラブルシューティング

### 型エラーが大量に出る場合
1. まず`src/types/index.ts`の変更を完了させる
2. 後方互換性フィールド（`salaryType?`, `salaryAmount?`）を残す
3. マイグレーション関数を先に実装

### ビルドエラーが出る場合
1. 型定義を先に完全に修正
2. 各ファイルを段階的に修正
3. `migrateLegacyData`を各所で適用

### 計算結果がおかしい場合
1. テストケースで検証（詳細は実装計画参照）
2. console.logで中間値を確認
3. 基本時給の計算を確認

---

## 完了条件

- [ ] TypeScript型チェック成功
- [ ] ESLint成功（新規警告なし）
- [ ] ビルド成功
- [ ] 手動テストで正常動作確認
- [ ] 旧データのマイグレーション動作確認
- [ ] テストケース1（残業時間入力）検証
- [ ] テストケース2（固定残業代入力）検証
- [ ] コミット・プッシュ完了
- [ ] PR作成完了

---

**見積もり総工数**: 16-23時間
**推奨作業期間**: 2-3日（集中して作業）

**最終更新**: 2025-10-21
