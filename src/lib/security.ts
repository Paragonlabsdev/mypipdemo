/**
 * Security utilities for input validation and HTML sanitization
 */

export function validateInput(input: string, maxLength: number = 500): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input: must be a non-empty string');
  }
  
  if (input.length > maxLength) {
    throw new Error(`Input too long: maximum ${maxLength} characters allowed`);
  }
  
  // Remove potentially dangerous patterns
  const dangerous = [
    /<script/i, /<\/script/i, /javascript:/i, /vbscript:/i, /on\w+=/i,
    /data:text\/html/i, /eval\(/i, /Function\(/i, /window\./i, /document\./i
  ];
  
  for (const pattern of dangerous) {
    if (pattern.test(input)) {
      throw new Error('Input contains potentially unsafe content');
    }
  }
  
  return input.trim();
}

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Remove dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, 'data:text/plain')
    .replace(/style\s*=\s*["'][^"']*expression\([^)]*\)[^"']*["']/gi, '');
}

export function createSecureIframeProps(content: string) {
  return {
    srcDoc: sanitizeHtml(content),
    sandbox: "allow-same-origin allow-scripts",
    className: "w-full h-full border-0",
    title: "App Preview",
    style: { background: 'white' }
  };
}