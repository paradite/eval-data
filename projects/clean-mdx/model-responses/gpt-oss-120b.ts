// cleanMDX.ts
export function cleanMDX(input: string): string {
  let output = input;

  // 1. Remove frontmatter (--- block at the start)
  output = output.replace(/^---\n[\s\S]*?\n---\n?/gm, '');

  // 2. Remove import statements
  output = output.replace(/^\s*import\s.+?;?\s*$/gm, '');

  // 3. Remove horizontal rules (lines that are only --- or *** etc.)
  output = output.replace(/^\s*[-*_]{3,}\s*$/gm, '');

  // 4. Remove JSX/TSX components
  //   a) Block components: <Component ...> ... </Component>
  output = output.replace(
    /<([A-Z][A-Za-z0-9]*)\b[^>]*?>[\s\S]*?<\/\1>/gs,
    ''
  );
  //   b) Self‑closing components: <Component ... />
  output = output.replace(
    /<([A-Z][A-Za-z0-9]*)\b[^>]*?\/>/gs,
    ''
  );

  // 5. Unwrap fenced code blocks (keep inner code)
  output = output.replace(
    /```[^\n]*\n([\s\S]*?)```/g,
    (_, code) => code.trimEnd()
  );

  // 6. Remove markdown tables (any line that looks like a table row)
  output = output.replace(/^\s*\|.*\|?\s*$/gm, '');

  // 7. Replace markdown headings with plain text
  output = output.replace(/^#{1,6}\s*(.*)$/gm, '$1');

  // 8. Replace markdown links with just the link text
  output = output.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  // 9. Collapse multiple consecutive blank lines to a maximum of two
  output = output.replace(/\n{3,}/g, '\n\n');

  // 10. Trim leading/trailing whitespace
  return output.trim();
}