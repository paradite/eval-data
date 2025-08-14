export function cleanMDX(mdx: string): string {
  let cleaned = mdx;

  // Remove frontmatter (--- ... ---)
  cleaned = cleaned.replace(/^---[\s\S]*?---\n*/gm, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*?from\s+['"][^'"]*['"];?\s*$/gm, '');

  // Remove horizontal rules (---)
  cleaned = cleaned.replace(/^---+$/gm, '');

  // Remove tables
  cleaned = cleaned.replace(/^\|.*\|.*\n(?:\|.*\|.*\n)*(?:\|.*\|.*)?$/gm, '');

  // Remove React components (self-closing and with children)
  cleaned = cleaned.replace(/<[^>\s]+[^>]*\/>/g, '');
  cleaned = cleaned.replace(/<[^>\s]+[^>]*>[\s\S]*?<\/[^>]+>/g, '');

  // Replace headings with plain text
  cleaned = cleaned.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1');

  // Clean up extra newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.trim();

  return cleaned;
}