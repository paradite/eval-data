export function cleanMDX(mdxContent: string): string {
  let cleaned = mdxContent;

  // Remove frontmatter
  cleaned = cleaned.replace(/^---\n[\s\S]*?\n---\n/m, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+[\s\S]*?from\s+['"].*?['"];?\s*$/gm, '');
  cleaned = cleaned.replace(/^import\s+\{[\s\S]*?\}\s+from\s+['"].*?['"];?\s*$/gm, '');

  // Remove React components (including self-closing and with children)
  cleaned = cleaned.replace(/<[A-Z][A-Za-z0-9]*(?:\s+[^>]*)?\/>/g, '');
  cleaned = cleaned.replace(/<[A-Z][A-Za-z0-9]*(?:\s+[^>]*)?>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, '');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, '$1');

  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Replace headings with plain text
  cleaned = cleaned.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  // Remove tables
  cleaned = cleaned.replace(/\|.*\|[\s\S]*?\n(?:\|.*\|\n)*/g, '');

  // Remove horizontal rule separators
  cleaned = cleaned.replace(/^---+$/gm, '');

  // Clean up multiple consecutive empty lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}