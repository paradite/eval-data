export function cleanMDX(content: string): string {
  let cleaned = content;

  // Remove frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?---\n?/m, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*?;$/gm, '');

  // Remove React components (including multiline)
  cleaned = cleaned.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '');
  cleaned = cleaned.replace(/<[A-Z][^>]*\/>/g, '');

  // Remove tables (including headers and separators)
  cleaned = cleaned.replace(/^\|.*\|$/gm, '');

  // Remove horizontal rule separators
  cleaned = cleaned.replace(/^---+$/gm, '');

  // Replace headings with plain text
  cleaned = cleaned.replace(/^#+\s*(.*)$/gm, '$1');

  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[\w]*\n?([\s\S]*?)```/g, '$1');

  // Clean up extra whitespace and newlines
  cleaned = cleaned.replace(/\n\s*\n\s*\n/g, '\n\n');
  cleaned = cleaned.replace(/^\s*\n/gm, '');
  cleaned = cleaned.trim();

  return cleaned;
}