export function cleanMDX(input: string): string {
  let result = input;

  // Remove frontmatter
  result = result.replace(/^---[\s\S]*?---\s*\n?/, '');

  // Remove import statements
  result = result.replace(/^import.*$/gm, '');

  // Remove horizontal rules
  result = result.replace(/^---\s*$/gm, '');

  // Remove JSX components (self-closing and paired)
  let changed = true;
  while (changed) {
    const before = result;
    result = result.replace(/<[^>]*\/>/g, '');
    result = result.replace(/<[^>]*>[\s\S]*?<\/[^>]*>/g, '');
    changed = result !== before;
  }

  // Remove table lines
  result = result.replace(/^\s*\|\s*.*\s*\|\s*$/gm, '');

  // Replace headings with plain text
  result = result.replace(/^#{1,6}\s*(.+)$/gm, '$1');

  // Unwrap markdown links
  result = result.replace(/\[(.*?)\]\(.*?\)/g, '$1');

  // Unwrap code blocks
  result = result.replace(/```[^\n]*\n([\s\S]*?)```/g, '$1');

  return result;
}