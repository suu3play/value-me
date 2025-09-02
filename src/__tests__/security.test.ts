import { describe, it, expect } from 'vitest';
import { sanitizeHtml, escapeHtml, isSafeUrl, sanitizeInput } from '../utils/security';

describe('Security Utils', () => {
  describe('sanitizeHtml', () => {
    it('should allow safe HTML tags', () => {
      const input = '<b>Bold</b> and <em>emphasis</em>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<b>Bold</b> and <em>emphasis</em>');
    });

    it('should remove script tags', () => {
      const input = '<script>alert("XSS")</script><b>Safe content</b>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<b>Safe content</b>');
    });

    it('should remove dangerous attributes', () => {
      const input = '<span onclick="alert()">Click me</span>';
      const result = sanitizeHtml(input);
      expect(result).toBe('<span>Click me</span>');
    });

    it('should handle empty string', () => {
      const result = sanitizeHtml('');
      expect(result).toBe('');
    });
  });

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      const result = escapeHtml(input);
      expect(result).toBe(expected);
    });

    it('should escape single quotes', () => {
      const input = "It's a test";
      const expected = 'It&#39;s a test';
      const result = escapeHtml(input);
      expect(result).toBe(expected);
    });

    it('should escape ampersands', () => {
      const input = 'Tom & Jerry';
      const expected = 'Tom &amp; Jerry';
      const result = escapeHtml(input);
      expect(result).toBe(expected);
    });

    it('should handle empty string', () => {
      const result = escapeHtml('');
      expect(result).toBe('');
    });
  });

  describe('isSafeUrl', () => {
    it('should allow https URLs', () => {
      const result = isSafeUrl('https://example.com');
      expect(result).toBe(true);
    });

    it('should allow http URLs', () => {
      const result = isSafeUrl('http://example.com');
      expect(result).toBe(true);
    });

    it('should allow mailto URLs', () => {
      const result = isSafeUrl('mailto:test@example.com');
      expect(result).toBe(true);
    });

    it('should reject javascript URLs', () => {
      const result = isSafeUrl('javascript:alert("XSS")');
      expect(result).toBe(false);
    });

    it('should reject data URLs', () => {
      const result = isSafeUrl('data:text/html,<script>alert("XSS")</script>');
      expect(result).toBe(false);
    });

    it('should reject file URLs', () => {
      const result = isSafeUrl('file:///etc/passwd');
      expect(result).toBe(false);
    });

    it('should handle malformed URLs', () => {
      const result = isSafeUrl('not-a-url');
      expect(result).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should remove script tags', () => {
      const input = 'Hello <script>alert("XSS")</script> World';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello  World');
    });

    it('should remove javascript: protocol', () => {
      const input = '<a href="javascript:alert()">Click</a>';
      const result = sanitizeInput(input);
      expect(result).toBe('<a href="alert()">Click</a>');
    });

    it('should remove event handlers', () => {
      const input = '<div onclick="alert()">Click me</div>';
      const result = sanitizeInput(input);
      expect(result).toBe('<div >Click me</div>');
    });

    it('should handle multiple threats', () => {
      const input = '<script>alert()</script><div onclick="malicious()">javascript:void(0)</div>';
      const result = sanitizeInput(input);
      expect(result).toBe('<div >void(0)</div>');
    });

    it('should handle empty string', () => {
      const result = sanitizeInput('');
      expect(result).toBe('');
    });
  });
});