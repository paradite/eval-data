export function cleanMDX(mdx: string): string {
  // Remove frontmatter
  let cleaned = mdx.replace(/^---[\s\S]*?---\n*/g, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*$/gm, '');

  // Remove horizontal rules
  cleaned = cleaned.replace(/^---+$/gm, '');

  // Remove tables
  cleaned = cleaned.replace(/^\|.*\|.*$/gm, '');

  // Remove react components (self-closing and with children)
  cleaned = cleaned.replace(/<[^>\s]+\s*[^>]*\/>/g, '');
  cleaned = cleaned.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '');

  // Replace headings with plain text
  cleaned = cleaned.replace(/^#+\s*(.*)$/gm, '$1');

  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1');

  // Clean up multiple blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  return cleaned.trim();
}