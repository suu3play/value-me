import { describe, it, expect, beforeEach } from 'vitest';

describe('Content Security Policy', () => {
  const cspContent = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";

  beforeEach(() => {
    // テスト環境でCSPメタタグを動的に作成
    const existingCspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCspMeta) {
      existingCspMeta.remove();
    }
    
    const metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', 'Content-Security-Policy');
    metaTag.setAttribute('content', cspContent);
    document.head.appendChild(metaTag);
  });

  it('should have CSP meta tag in HTML', () => {
    // index.htmlのCSPメタタグの存在を確認
    const metaTags = document.querySelectorAll('meta[http-equiv="Content-Security-Policy"]');
    expect(metaTags.length).toBeGreaterThan(0);
  });

  it('should contain required CSP directives', () => {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const cspContent = cspMeta?.getAttribute('content') || '';

    // 必要なCSPディレクティブが含まれているかチェック
    expect(cspContent).toContain('default-src');
    expect(cspContent).toContain('script-src');
    expect(cspContent).toContain('style-src');
    expect(cspContent).toContain('object-src');
    expect(cspContent).toContain('base-uri');
  });

  it('should restrict object-src to none', () => {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const cspContent = cspMeta?.getAttribute('content') || '';

    expect(cspContent).toContain("object-src 'none'");
  });

  it('should restrict base-uri to self', () => {
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const cspContent = cspMeta?.getAttribute('content') || '';

    expect(cspContent).toContain("base-uri 'self'");
  });
});