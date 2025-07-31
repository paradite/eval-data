export function cleanMarkdown(input: string): string {
  let text = input;

  // Remove frontmatter (YAML or similar) at the beginning of the file
  text = text.replace(/^\s*---[\s\S]*?---\s*\n?/, '');

  // Remove import/export statements (commonly in MDX)
  text = text.replace(/^\s*(import|export)\s+.*?;?\s*$/gm, '');

  // Remove tables: lines that look like markdown table rows or separator lines
  // This removes any line containing '|' plus the separator lines with dashes and pipes.
  text = text
    .split('\n')
    .filter((line) => {
      const isTableSeparator = /^\s*\|?[\s:-]+\|[\s|:-]*$/.test(line.trim());
      const isLikelyTableRow = /\|/.test(line) && !/`/.test(line); // ignore inline code edge cases
      return !(isTableSeparator || isLikelyTableRow);
    })
    .join('\n');

  // Remove React/MDX components (self-closing and block with nested content)
  // Self-closing components like <Component ... />
  text = text.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/>/g, '');
  // Block components like <Component ...> ... </Component>, non-greedy and across lines
  text = text.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>[\s\S]*?<\/\1>/g, '');

  // Unwrap code blocks: replace fenced blocks with their inner content
  // ```lang\ncontent\n```
  text = text.replace(/```[\w-]*\n([\s\S]*?)\n```/g, (_m, code) => code);
  // Also handle single-line fenced blocks without trailing newline before ```
  text = text.replace(/```[\w-]*\r?\n?([\s\S]*?)```/g, (_m, code) => code);

  // Unwrap markdown links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^()\s]+(?:\([^()]*\)[^()]*)*\)/g, '$1');

  // Replace headings with plain text: remove leading hashes and optional spaces
  text = text
    .split('\n')
    .map((line) => {
      const m = line.match(/^\s{0,3}(#{1,6})\s*(.*)$/);
      if (m) {
        return m[2].trim();
      }
      return line;
    })
    .join('\n');

  // Clean up excessive empty lines: collapse 3+ newlines into 2
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  return text.trim() + '\n';
}