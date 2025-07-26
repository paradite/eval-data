export function cleanMarkdown(markdown: string): string {
  let result = markdown;

  // Remove frontmatter (--- ... ---)
  result = result.replace(/^---[\s\S]*?---\s*/g, '');

  // Remove import statements
  result = result.replace(/^import\s+.*;?\s*$/gm, '');

  // Remove React components (custom tags)
  result = result.replace(/<\/?[A-Z][\w\d]*[^>]*>\s*/g, '');

  // Remove tables
  result = result.replace(/^\|.*\|\s*$/gm, '');
  result = result.replace(/^\|.*\|$\s*\|[-\s|]*\|\s*/gm, '');

  // Replace headings with plain text (remove # symbols)
  result = result.replace(/^(#+)\s*(.*)$/gm, '$2');

  // Unwrap markdown links [text](url) => text
  result = result.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');

  // Unwrap code blocks
  result = result.replace(/```[\w]*\s*([\s\S]*?)\s*```/g, '$1');

  // Trim extra newlines
  result = result.replace(/\n{3,}/g, '\n\n');

  return result.trim();
}