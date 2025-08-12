export function cleanMDX(text: string): string {
  let result = text;

  // Remove frontmatter
  result = result.replace(/^---\n[\s\S]*?\n---\n?/m, '');

  // Remove import statements
  result = result.replace(/^import\s+[\s\S]*?from\s+['"].*?['"];?\n?/gm, '');

  // Remove React components (single line and multi-line)
  result = result.replace(/<[A-Z][^>]*\/>/g, '');
  result = result.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '');

  // Remove tables
  result = result.replace(/^\|.*\|.*\n(^\|.*\|.*\n)*/gm, '');

  // Remove horizontal rule separators
  result = result.replace(/^---+\s*$/gm, '');

  // Unwrap code blocks
  result = result.replace(/```[\w]*\n([\s\S]*?)\n```/g, '$1');

  // Unwrap markdown links
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Replace headings with plain text
  result = result.replace(/^#{1,6}\s+(.+)$/gm, '$1');

  // Clean up extra whitespace and newlines
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
  result = result.trim();

  return result;
}