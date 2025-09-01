import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { ScreenReaderOnly } from '../ScreenReaderOnly';

describe('ScreenReaderOnly', () => {
  test('コンポーネントが正常にレンダリングされる', () => {
    render(<ScreenReaderOnly>スクリーンリーダー用テキスト</ScreenReaderOnly>);
    
    // テキストが存在することを確認
    expect(screen.getByText('スクリーンリーダー用テキスト')).toBeInTheDocument();
  });

  test('視覚的に隠されているがスクリーンリーダーからアクセス可能', () => {
    render(<ScreenReaderOnly>隠しテキスト</ScreenReaderOnly>);
    
    const element = screen.getByText('隠しテキスト');
    
    // 要素が存在するが、視覚的に隠されている
    expect(element).toBeInTheDocument();
    
    // CSSクラスまたはスタイルで隠されていることを確認
    const computedStyle = window.getComputedStyle(element);
    const isVisuallyHidden = 
      computedStyle.position === 'absolute' ||
      computedStyle.clip === 'rect(0, 0, 0, 0)' ||
      computedStyle.width === '1px' ||
      element.className.includes('sr-only') ||
      element.className.includes('visually-hidden');
      
    expect(isVisuallyHidden).toBe(true);
  });

  test('複数の子要素を含むことができる', () => {
    render(
      <ScreenReaderOnly>
        <span>最初のテキスト</span>
        <span>2番目のテキスト</span>
      </ScreenReaderOnly>
    );
    
    expect(screen.getByText('最初のテキスト')).toBeInTheDocument();
    expect(screen.getByText('2番目のテキスト')).toBeInTheDocument();
  });

  test('空のコンテンツでもエラーにならない', () => {
    render(<ScreenReaderOnly>{null}</ScreenReaderOnly>);
    
    // エラーが発生しないことを確認
    expect(document.body).toBeInTheDocument();
  });
});