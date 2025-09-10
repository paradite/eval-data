export function cleanMDX(mdxText: string): string {
  let text = mdxText;

  // Remove frontmatter (--- ... ---)
  text = text.replace(/^---[\s\S]*?---\n*/gm, '');

  // Remove import statements
  text = text.replace(/^import\s+.*$/gm, '');

  // Remove horizontal rules (---)
  text = text.replace(/^---+$/gm, '');

  // Remove tables
  text = text.replace(/^\|.*\|.*$/gm, '');

  // Remove react components (self-closing and with children)
  text = text.replace(/<[^>\s]+\s*[^>]*\/>/g, '');
  text = text.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '');

  // Replace headings with plain text
  text = text.replace(/^#+\s*(.*)$/gm, '$1');

  // Unwrap markdown links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Unwrap code blocks
  text = text.replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1');

  // Clean up multiple blank lines
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  text = text.trim();

  return text;
}