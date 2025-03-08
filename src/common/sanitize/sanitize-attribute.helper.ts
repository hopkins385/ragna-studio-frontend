// Helper function to sanitize attribute values
export function sanitizeAttributeValue(value: string | undefined): string {
  if (!value) return '';
  // Remove any characters that could be problematic in HTML attributes
  return String(value).replace(/[&<>"']/g, char => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}
