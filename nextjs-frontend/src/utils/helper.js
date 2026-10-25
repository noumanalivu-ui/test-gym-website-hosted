// utils/helper.js

export function stripHtml(html) {
  if (!html) return '';
  // Remove HTML tags while preserving spaces
  const plainText = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return plainText;
}


export function truncateText(text, maxLength = 160) {
  if (!text || text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
}

export function RichTextContent({ html, className = "" }) {
  if (!html) return null;
  return (
    <div
      className={`backend-html ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function SafeIcon({ svgString, label, className = "h-5 w-5" }) {
  if (!svgString) return null;

  let cleanSvg = svgString.replace(/class="[^"]*"/g, '');
  cleanSvg = cleanSvg.replace('<svg', `<svg class="${className}" fill="none" aria-hidden="true" focusable="false" role="img" aria-label="${label}"`);

  return <span dangerouslySetInnerHTML={{ __html: cleanSvg }} />;
}

export function generateSlug(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}