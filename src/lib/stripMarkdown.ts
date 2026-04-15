/**
 * Strip markdown heading syntax (##, ###, etc.), HTML tags, and extra whitespace.
 * Used to clean CMS fields that may contain markdown or HTML.
 */
export function stripMarkdown(text: unknown): string {
  return String(text ?? '')
    .replace(/^#+\s*/, '')   // strip leading # heading markers
    .replace(/<[^>]*>/g, '') // strip HTML tags
    .trim();
}
