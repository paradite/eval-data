export function cleanMarkdown(input: string): string {
  let text = input;

  // Remove frontmatter blocks delimited by --- at the start of the document
  text = text.replace(/^\s*---[\s\S]*?---\s*\n?/, '');

  // Remove import statements (JS/TS style)
  text = text.replace(/^[ \t]*import[^\n]*\n/gm, '');

  // Remove tables: any lines that look like table rows or table separators
  // Matches lines starting with optional spaces followed by a pipe or separator pattern
  text = text
    .split('\n')
    .filter((line) => {
      const isTableRow =
        /^\s*\|.*\|\s*$/.test(line) || // row with pipes
        /^\s*[:\-| ]+$/.test(line); // separator line like |---|:--:|
      return !isTableRow;
    })
    .join('\n');

  // Remove React components (simple approach)
  // 1) Remove self-closing components: <Comp ... />
  text = text.replace(/<([A-Z][A-Za-z0-9]*)(\s[^<>]*?)?\/>/g, '');
  // 2) Remove paired components and their contents: <Comp ...> ... </Comp>
  // Use a loop to handle nested or repeated components
  const pairedComponentRegex = /<([A-Z][A-Za-z0-9]*)(\s[^<>]*?)?>[\s\S]*?<\/\1>/g;
  let prev;
  do {
    prev = text;
    text = text.replace(pairedComponentRegex, '');
  } while (text !== prev);

  // Unwrap fenced code blocks: ```lang\n...code...\n```
  // Replace the entire block with just the code content (no fences)
  text = text.replace(/```[^\n]*\n([\s\S]*?)```/g, (_, code) => {
    // Trim trailing newlines inside code but keep internal formatting
    return code.replace(/^\n+|\n+$/g, '');
  });

  // Replace headings with plain text: strip leading #+ and whitespace
  text = text.replace(/^\s{0,3}#{1,6}\s*(.*)$/gm, (_, content) => content.trim());

  // Unwrap markdown links: [text](url) -> text
  // Do not use global to handle nested correctly by re-running until stable
  const linkRegex = /\[([^\]]+)\]\((?:[^)]+)\)/g;
  while (linkRegex.test(text)) {
    text = text.replace(linkRegex, '$1');
  }

  // Clean up excessive blank lines: allow at most one blank line
  text = text
    .replace(/\r/g, '')
    .split('\n')
    .reduce<string[]>((acc, line) => {
      const trimmed = line.replace(/[ \t]+$/g, '');
      if (trimmed === '') {
        if (acc.length === 0 || acc[acc.length - 1] !== '') {
          acc.push('');
        }
      } else {
        acc.push(trimmed);
      }
      return acc;
    }, [])
    .join('\n')
    .trim();

  return text;
}