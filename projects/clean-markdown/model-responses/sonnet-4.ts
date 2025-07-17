export function cleanMarkdown(markdown: string): string {
  let text = markdown;

  // Remove frontmatter
  text = text.replace(/^---\n[\s\S]*?\n---\n/m, '');

  // Remove import statements
  text = text.replace(/^import\s+.*$/gm, '');

  // Remove React components
  text = text.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, '');
  text = text.replace(/<[A-Z][^>]*\/>/g, '');

  // Remove tables
  text = text.replace(/^\|.*\|$/gm, '');
  text = text.replace(/^\|[-:\s|]*\|$/gm, '');

  // Replace headings with plain text
  text = text.replace(/^#+\s+(.*)$/gm, '$1');

  // Unwrap markdown links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Unwrap code blocks
  text = text.replace(/^```[^\n]*\n([\s\S]*?)\n```$/gm, '$1');

  // Clean up extra whitespace and empty lines
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  text = text.replace(/^\s*\n/gm, '');

  return text;
}