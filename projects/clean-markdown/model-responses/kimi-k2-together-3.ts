export function cleanMarkdown(markdown: string): string {
  let text = markdown;

  // Remove frontmatter (--- ... --- at the start)
  text = text.replace(/^---[\s\S]*?---\s*/gm, '');

  // Remove tables (| ... | with optional |--| header separators)
  // This removes the entire table lines
  text = text.replace(/^\|.*\|(?:\r?\n\|[-: |]*\|)?(?:\r?\n\|.*\|)*\s*/gm, '');

  // Remove React components (<Component ...> ... </Component>)
  text = text.replace(/<[\w-]+\b[^>]*(?:>.*?<\/[\w-]+>|<\/>)\s*/gis, '');
  text = text.replace(/<[\w-]+\s*\/>\s*/g, ''); // Handle self-closing tags on separate lines

  // Remove import statements (import ... from ...)
  text = text.replace(/^\s*import\s+.*?from\s+['"].*['"]\s*;?\s*$/gm, '');

  // Replace markdown links ([text](url)) with just text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Replace headings (### heading) with just heading (remove # and space)
  text = text.replace(/^\s*#{1,6}\s+/gm, '');

  // Unwrap code blocks (``` ... ```) - capture content without ``` and language
  text = text.replace(/```(?:\w+)?\s*\n([\s\S]*?)```/g, '$1');

  // Clean up extra newlines (more than 2 in a row)
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}