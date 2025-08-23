# Issue #25 次回作業計画

## 前回作業完了状況

### ✅ 完了済み機能（Phase 1-5）

- **Phase 1**: チームメンバー管理機能の基盤実装
- **Phase 2**: チーム全体コスト算出機能（3つの計算方式）
- **Phase 3**: 作業登録・管理機能（頻度パターン対応）
- **Phase 4**: 作業コスト分析・効率分析機能
- **Phase 5**: メインナビゲーションへのチームタブ統合

### 📁 実装済みファイル

```
src/
├── types/index.ts (拡張)
├── hooks/
│   ├── useTeamManagement.ts (新規)
│   ├── useTaskManagement.ts (新規)
│   └── useTeamAnalysis.ts (新規)
├── utils/
│   ├── teamCalculations.ts (新規)
│   └── taskCalculations.ts (新規)
└── App.tsx (UI統合)
```

### 🔄 現在の状態

- **ブランチ**: `feature/issue-25`
- **最新コミット**: `de5e08a` - feat: チームコスト分析機能（value-team）を実装 #25
- **ワーキングツリー**: Phase 6完了（UIコンポーネント実装済み）

### ✅ Phase 6完了状況（2024年度実装済み）

**Phase 6.1: チーム管理UIコンポーネント** ✅
- TeamDashboard.tsx - チーム概要ダッシュボード
- TeamManagement.tsx - チーム一覧・作成・編集機能
- TeamMemberForm.tsx - メンバー追加・編集ウィザード（SalaryCalculator連携）
- TeamMemberList.tsx - メンバー一覧・管理機能

**Phase 6.2: 作業管理UIコンポーネント** ✅
- TaskManagement.tsx - 作業一覧・管理機能
- TaskForm.tsx - 作業登録・編集ウィザード（複雑な頻度パターン対応）

**Phase 6.3: 分析・レポートUIコンポーネント** ✅
- TeamAnalysis.tsx - チームコスト分析（3つの計算方法比較）
- TaskCostAnalysis.tsx - 作業別コスト分析・効率分析

**Phase 6.4: チャート・可視化コンポーネント** ✅
- CostComparisonChart.tsx - コスト比較チャート（基本構造）
- TaskEfficiencyChart.tsx - 作業効率分析チャート（基本構造）

**Phase 7: App.tsx統合** ✅
- チームタブ内コンテンツの完全実装
- ナビゲーション機能統合
- レスポンシブデザイン対応

---

## 🚀 次回作業内容

### Phase 6: UIコンポーネント実装

#### 6.1 チーム管理UIコンポーネント

**作成ファイル**: `src/components/team/TeamManagement.tsx`
```typescript
// 実装内容:
// - チーム一覧表示
// - 新規チーム作成フォーム
// - チーム編集・削除機能
// - チーム選択機能
```

**作成ファイル**: `src/components/team/TeamMemberForm.tsx`
```typescript
// 実装内容:
// - メンバー追加フォーム
// - メンバー編集フォーム
// - 給与データ入力（SalaryCalculator連携）
// - 役割選択・管理
```

**作成ファイル**: `src/components/team/TeamMemberList.tsx`
```typescript
// 実装内容:
// - メンバー一覧表示
// - アクティブ/非アクティブ切り替え
// - メンバー詳細表示
// - 削除確認ダイアログ
```

#### 6.2 作業管理UIコンポーネント

**作成ファイル**: `src/components/team/TaskManagement.tsx`
```typescript
// 実装内容:
// - 作業一覧表示
// - 新規作業登録フォーム
// - 頻度設定UI（日次・週次・月次・年次）
// - 作業編集・削除機能
```

**作成ファイル**: `src/components/team/TaskForm.tsx`
```typescript
// 実装内容:
// - 作業詳細入力フォーム
// - 複雑な頻度パターン設定UI
// - 見積時間入力
// - タグ管理
```

#### 6.3 分析・レポートUIコンポーネント

**作成ファイル**: `src/components/team/TeamAnalysis.tsx`
```typescript
// 実装内容:
// - チームコスト分析結果表示
// - 3つの計算方法比較表示
// - 役割別統計チャート
// - コスト最適化提案表示
```

**作成ファイル**: `src/components/team/TaskCostAnalysis.tsx`
```typescript
// 実装内容:
// - 作業別コスト分析
// - 年間コスト・実行回数表示
// - 効率分析レポート
// - ROI分析（将来的な拡張）
```

**作成ファイル**: `src/components/team/TeamDashboard.tsx`
```typescript
// 実装内容:
// - チーム概要ダッシュボード
// - 主要メトリクス表示
// - クイックアクション
// - アラート・通知表示
```

#### 6.4 チャート・可視化コンポーネント

**作成ファイル**: `src/components/team/charts/CostComparisonChart.tsx`
```typescript
// 実装内容:
// - 計算方法別コスト比較チャート
// - チーム間比較チャート
// - 円グラフ・棒グラフ表示
```

**作成ファイル**: `src/components/team/charts/TaskEfficiencyChart.tsx`
```typescript
// 実装内容:
// - 作業効率分析チャート
// - 時系列コスト推移
// - 散布図・ヒートマップ
```

### Phase 7: メインUI統合

#### 7.1 App.tsx拡張

**修正ファイル**: `src/App.tsx`
```typescript
// 実装内容:
// - チームタブ内コンテンツの実装
// - プレースホルダーをTeamDashboard等に置き換え
// - ルーティング機能（必要に応じて）
```

#### 7.2 レスポンシブデザイン対応

```typescript
// 実装内容:
// - モバイル対応レイアウト
// - タブレット最適化
// - Material-UIテーマ統合
```

---

## 🔧 技術的考慮事項

### 必要なMaterial-UIコンポーネント

```typescript
// 追加インポートが必要になる可能性:
import {
  DataGrid,           // 作業・メンバー一覧表示
  Chart,              // 分析チャート（または react-chartjs-2）
  Stepper,            // 作業登録ウィザード
  Accordion,          // 分析結果折りたたみ表示
  Chip,               // タグ表示
  Avatar,             // メンバーアイコン
  Timeline,           // 作業頻度可視化
} from '@mui/material';
```

###状態管理パターン

```typescript
// 各コンポーネントで既存hooksを活用:
// - useTeamManagement
// - useTaskManagement  
// - useTeamAnalysis
// 
// 必要に応じてContext API導入を検討
```

### バリデーション・エラーハンドリング

```typescript
// 実装予定:
// - フォームバリデーション（react-hook-form等）
// - エラー状態表示
// - ローディング状態管理
// - 楽観的UI更新
```

---

## 📋 作業手順

### 1. 作業開始時

```bash
# ブランチ確認・継続
cd D:\自己開発\value-me
git status
git checkout feature/issue-25  # 既に該当ブランチにいる場合は不要
```

### 2. コンポーネント実装順序

1. **TeamDashboard.tsx** - 基本レイアウト確認
2. **TeamManagement.tsx** - チーム基本機能
3. **TeamMemberForm.tsx** - メンバー管理
4. **TaskManagement.tsx** - 作業管理
5. **TeamAnalysis.tsx** - 分析表示
6. **チャートコンポーネント** - 可視化
7. **App.tsx統合** - 最終統合

### 3. 各実装後の確認事項

- [ ] TypeScript型チェック通過
- [ ] 既存機能への影響なし
- [ ] レスポンシブデザイン対応
- [ ] アクセシビリティ考慮
- [ ] Material-UIテーマ統合

### 4. Phase 6完了後の最終作業

- [ ] コード品質チェック実行
- [ ] 全機能の動作確認
- [ ] コミット・プッシュ
- [ ] プルリクエスト作成

---

## 🎯 完成予想図

```
チームタブ構成:
├── TeamDashboard (概要)
│   ├── チーム選択
│   ├── 主要メトリクス
│   └── クイックアクション
│
├── チーム管理
│   ├── チーム一覧・作成
│   └── メンバー管理
│
├── 作業管理  
│   ├── 作業登録・編集
│   └── 頻度・時間設定
│
└── 分析・レポート
    ├── コスト分析
    ├── 効率分析
    └── 最適化提案
```

---

## 💡 今後の拡張予定

- **データエクスポート機能** (CSV, PDF)
- **チーム間比較レポート**
- **予算管理機能**
- **時系列分析** 
- **外部API連携** (将来的)

---

**⚠️ 重要**: 実装時は必ず既存の`useTeamManagement`, `useTaskManagement`, `useTeamAnalysis`フックを活用し、一貫性のあるデータフローを維持すること。