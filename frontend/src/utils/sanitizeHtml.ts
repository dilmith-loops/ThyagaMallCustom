import DOMPurify from 'dompurify';

// Product copy comes from the admin panel / catalog imports as HTML.
// Strip scripts, event handlers and other active content before rendering it.
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return '';
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'iframe'],
    FORBID_ATTR: ['style'],
  });
}
