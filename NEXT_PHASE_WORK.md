# Issue 38 - Phase 2 実装作業手順

## 🎯 現在の状況

**✅ Phase 1 完了 (2025-09-17)**
- 基本資格計算機能実装済み
- 独立コンポーネントとして動作可能
- コミット済み: `feat: 資格取得投資効果計算機能を追加 #38`

## 🚀 Phase 2: App.tsx統合作業

### 作業1: App.tsx統合

#### 1.1 必要なimport追加
```typescript
// D:/自己開発/value-me/src/App.tsx の変更

// アイコン追加
import {
  History as HistoryIcon,
  Calculate as CalculateIcon,
  Compare as CompareIcon,
  Group as GroupIcon,
  School as SchoolIcon,  // 追加
} from '@mui/icons-material';

// コンポーネント追加
import { QualificationCalculator } from './components/qualification/QualificationCalculator';

// 型定義追加
import type { QualificationResult } from './types/qualification';
```

#### 1.2 状態管理追加
```typescript
// 資格計算の状態
const [qualificationResult, setQualificationResult] = useState<QualificationResult | null>(null);

// モード型を拡張
const [currentMode, setCurrentMode] = useState<'hourly-calculation' | 'hourly-comparison' | 'team-cost' | 'qualification'>('hourly-calculation');
```

#### 1.3 モード切り替え処理更新
```typescript
// handleModeChange関数の型更新
const handleModeChange = useCallback((_: React.MouseEvent<HTMLElement>, newMode: 'hourly-calculation' | 'hourly-comparison' | 'team-cost' | 'qualification' | null) => {

// modeNames追加
const modeNames = {
  'hourly-calculation': '時給計算',
  'hourly-comparison': '時給比較',
  'team-cost': 'チームコスト計算',
  'qualification': '資格投資計算'  // 追加
};
```

#### 1.4 キーボードショートカット追加
```typescript
// Alt+4 で資格計算モードに切り替え
case '4':
  event.preventDefault();
  setCurrentMode('qualification');
  break;
```

#### 1.5 サブタイトル更新
```typescript
{currentMode === 'hourly-calculation' ? 'あなたの時給を正確に計算しましょう' :
 currentMode === 'hourly-comparison' ? '複数の条件で時給を比較できます' :
 currentMode === 'team-cost' ? 'チームの作業コストを自動計算' :
 '資格取得の投資効果を分析できます'}  // 追加
```

#### 1.6 タブボタン追加
```typescript
<ToggleButton
  value="qualification"
  aria-label="資格投資モード Alt+4で切り替え"
>
  <SchoolIcon sx={{ mr: 1 }} aria-hidden="true" />
  資格投資
</ToggleButton>
```

### 作業2: 資格結果表示セクション追加

#### 2.1 結果表示追加
```typescript
{/* 資格計算結果表示 */}
{currentMode === 'qualification' && qualificationResult && (
  <Box
    component="section"
    aria-label="資格投資計算結果"
    role="region"
    sx={{
      bgcolor: 'primary.main',
      color: 'primary.contrastText',
      borderRadius: 2,
      p: { xs: 1, sm: 2 },
      mb: { xs: 1, sm: 2 },
    }}
  >
    {/* ROI指標表示 */}
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 3,
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          投資収益率 (ROI)
        </Typography>
        <Typography variant="h3" fontWeight="bold">
          {qualificationResult.roi.toFixed(1)}%
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          回収期間
        </Typography>
        <Typography variant="h5">
          {isFinite(qualificationResult.paybackPeriod) ?
            `${qualificationResult.paybackPeriod.toFixed(1)}年` : '計算不可'}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          総投資額: {formatCurrency(qualificationResult.totalInvestment)}
        </Typography>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          年間効果
        </Typography>
        <Typography variant="h5">
          {formatCurrency(qualificationResult.totalAnnualBenefit)}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          NPV: {formatCurrency(qualificationResult.npv)}
        </Typography>
      </Box>
    </Box>
  </Box>
)}
```

### 作業3: メインコンテンツ切り替え追加

#### 3.1 条件分岐に資格計算追加
```typescript
{currentMode === 'hourly-calculation' ? (
  <SalaryCalculator
    data={calculationData}
    onChange={handleDataChange}
    onResultChange={handleResultChange}
    layout="horizontal"
  />
) : currentMode === 'hourly-comparison' ? (
  <ComparisonForm
    items={comparison.state.items}
    activeItemId={comparison.state.activeItemId}
    onAddItem={comparison.addItem}
    onRemoveItem={comparison.removeItem}
    onUpdateItem={comparison.updateItem}
    onUpdateLabel={comparison.updateLabel}
    onSetActiveItem={comparison.setActiveItem}
    maxItems={2}
  />
) : currentMode === 'team-cost' ? (
  <TeamCostCalculatorV2
    onResultChange={setTeamCostResult}
    onErrorsChange={setTeamCostErrors}
  />
) : (
  // 資格計算モード追加
  <QualificationCalculator
    currentHourlyWage={calculationResult?.hourlyWage || 0}
    onResultChange={setQualificationResult}
  />
)}
```

### 作業4: アクセシビリティ更新

#### 4.1 aria-label更新
```typescript
aria-label="機能を選択してください (Alt+1: 時給計算, Alt+2: 時給比較, Alt+3: チームコスト, Alt+4: 資格投資)"
```

#### 4.2 ScreenReaderOnly更新
```typescript
<ScreenReaderOnly>
  キーボードショートカットを使用できます。Alt+1で時給計算、Alt+2で時給比較、Alt+3でチームコスト、Alt+4で資格投資、Alt+Hで履歴を開けます。
</ScreenReaderOnly>
```

## 🔧 実装手順

### Step 1: 作業ブランチ確認
```bash
cd "D:/自己開発/value-me"
git status  # feature/issue-38 ブランチであることを確認
```

### Step 2: App.tsx編集実行
上記の各作業を順番に実施

### Step 3: 品質チェック
```bash
npm run build  # TypeScript型チェック
npm run lint   # ESLintチェック
npm run dev    # 開発サーバー起動確認
```

### Step 4: テスト確認項目
- [ ] Alt+4で資格投資モードに切り替わる
- [ ] 時給計算結果が資格計算に連携される
- [ ] 資格計算結果がヘッダーに表示される
- [ ] 各モード間の切り替えが正常
- [ ] レスポンシブレイアウト動作

### Step 5: コミット作成
```bash
git add src/App.tsx
git commit -m "$(cat <<'EOF'
feat: 資格投資計算のApp.tsx統合を完了 #38

- 4番目のタブとして資格投資計算を追加
- Alt+4キーボードショートカット対応
- 時給計算結果との連携実装
- 資格計算結果表示セクション追加
- アクセシビリティ対応完了

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

## 📝 注意事項

1. **Material-UI v7対応**: Grid ではなく Stack/Box を使用
2. **型安全性**: 全ての新規状態に適切な型定義
3. **既存機能**: 時給計算、比較、チームコストに影響しないこと
4. **アクセシビリティ**: スクリーンリーダー対応とキーボードナビゲーション
5. **レスポンシブ**: モバイル・デスクトップ両対応

## 🎯 完了後の状態

- 4つの機能が統合されたシングルページアプリケーション
- 既存時給計算結果を活用した資格投資効果分析
- 一貫したMaterial-UIデザインシステム
- 完全なTypeScript型安全性
- アクセシビリティ準拠

---

**作成日**: 2025-09-17
**対象Issue**: #38
**Phase**: 2
**前提**: Phase 1 (基本計算機能) 完了済み