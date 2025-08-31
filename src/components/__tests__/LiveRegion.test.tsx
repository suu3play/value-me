import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { LiveRegion } from '../LiveRegion';

describe('LiveRegion', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  test('メッセージが正常に表示される', () => {
    render(<LiveRegion message="テストメッセージ" />);
    
    expect(screen.getByText('テストメッセージ')).toBeInTheDocument();
  });

  test('aria-live属性が正しく設定される', () => {
    render(<LiveRegion message="テストメッセージ" priority="assertive" />);
    
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });

  test('デフォルトのpriorityがpoliteに設定される', () => {
    render(<LiveRegion message="テストメッセージ" />);
    
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  test('空のメッセージの場合は何も表示されない', () => {
    render(<LiveRegion message="" />);
    
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('空白のみのメッセージの場合は何も表示されない', () => {
    render(<LiveRegion message="   " />);
    
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  test('視覚的に隠されているがアクセシブル', () => {
    render(<LiveRegion message="隠しメッセージ" />);
    
    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    
    // 視覚的に隠されているスタイルが適用されていることを確認
    const computedStyle = window.getComputedStyle(liveRegion);
    expect(computedStyle.position).toBe('absolute');
    expect(computedStyle.width).toBe('1px');
    expect(computedStyle.height).toBe('1px');
  });

  test('メッセージ変更時に新しいメッセージが表示される', () => {
    const { rerender } = render(<LiveRegion message="最初のメッセージ" />);
    
    expect(screen.getByText('最初のメッセージ')).toBeInTheDocument();
    
    rerender(<LiveRegion message="新しいメッセージ" />);
    
    expect(screen.getByText('新しいメッセージ')).toBeInTheDocument();
    expect(screen.queryByText('最初のメッセージ')).not.toBeInTheDocument();
  });

  test('clearDelayを0に設定するとタイマーが設定されない', async () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    
    render(<LiveRegion message="テストメッセージ" clearDelay={0} />);
    
    // clearDelay=0の場合、setTimeoutが呼ばれない
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
    setTimeoutSpy.mockRestore();
  });

  test('コンポーネントがアンマウントされるとタイマーがクリアされる', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { unmount } = render(<LiveRegion message="テストメッセージ" clearDelay={2000} />);
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });

  test('同じメッセージが連続で設定された場合、重複処理されない', () => {
    const setTimeoutSpy = vi.spyOn(global, 'setTimeout');
    
    const { rerender } = render(<LiveRegion message="同じメッセージ" />);
    
    const initialCallCount = setTimeoutSpy.mock.calls.length;
    
    // 同じメッセージで再レンダリング
    rerender(<LiveRegion message="同じメッセージ" />);
    
    // setTimeoutの呼び出し回数が増えていないことを確認
    expect(setTimeoutSpy.mock.calls.length).toBe(initialCallCount);
    
    setTimeoutSpy.mockRestore();
  });

  test('role属性がstatusに設定される', () => {
    render(<LiveRegion message="ステータスメッセージ" />);
    
    const element = screen.getByRole('status');
    expect(element).toBeInTheDocument();
  });

  test('複数のLiveRegionが独立して動作する', () => {
    render(
      <>
        <LiveRegion message="最初のリージョン" priority="polite" />
        <LiveRegion message="2番目のリージョン" priority="assertive" />
      </>
    );
    
    const regions = screen.getAllByRole('status');
    expect(regions).toHaveLength(2);
    
    expect(regions[0]).toHaveAttribute('aria-live', 'polite');
    expect(regions[1]).toHaveAttribute('aria-live', 'assertive');
  });
});