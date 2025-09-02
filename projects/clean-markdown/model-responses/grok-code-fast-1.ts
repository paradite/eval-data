export const cleanMarkdown = (input: string): string => {
  // Remove frontmatter
  input = input.replace(/^---[\s\S]*?---\n?/, '');

  // Unwrap code blocks
  input = input.replace(/```[^\n]*\n?([\s\S]*?)```/g, '$1');

  // Unwrap links
  input = input.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');

  // Replace headings
  input = input.replace(/^#+\s*(.*)$/gm, '$1');

  // Remove import statements
  input = input.replace(/^import.*$/gm, '');

  // Remove any remaining --- lines
  input = input.replace(/^---.*$/gm, '');

  // Remove table and component lines
  const lines = input.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|') || (trimmed.startsWith('<') && trimmed.endsWith('>'))) {
      return false;
    }
    return true;
  });
  input = filteredLines.join('\n');

  // Clean up multiple newlines
  input = input.replace(/\n{3,}/g, '\n\n');

  return input;
};