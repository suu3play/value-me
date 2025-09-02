import DOMPurify from 'dompurify';

/**
 * HTMLコンテンツをサニタイズします
 * XSS攻撃から保護するためにHTMLを安全にクリーンアップします
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
    ALLOWED_ATTR: ['class'],
  });
}

/**
 * ユーザー入力をエスケープします
 * HTMLエンティティにエンコードして安全な文字列に変換します
 */
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * URLの安全性をチェックします
 * 危険なプロトコルを含むURLを検出します
 */
export function isSafeUrl(url: string): boolean {
  const allowedProtocols = ['http:', 'https:', 'mailto:'];
  try {
    const parsedUrl = new URL(url);
    return allowedProtocols.includes(parsedUrl.protocol);
  } catch {
    return false;
  }
}

/**
 * 文字列から潜在的に危険な文字を削除します
 */
export function sanitizeInput(input: string): string {
  // eslint-disable-next-line security/detect-unsafe-regex
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '');
}