export function cleanMarkdown(input: string): string {
  let text = input;

  // 1) Remove frontmatter (YAML) at the very top
  text = text.replace(/^\s*---[\s\S]*?---\s*\n?/, '');

  // 2) Remove import statements (JS/TS style)
  text = text.replace(/^\s*import\s+.*?;?\s*$/gm, '');

  // 3) Remove Markdown tables (lines that look like table rows or separator lines)
  // This removes alignment/separator lines and any lines that contain table pipes in a table-like format.
  text = text.replace(/^[ \t]*\|.*\|\s*$/gm, '');
  text = text.replace(/^[ \t]*:-{3,}.*$/gm, '');
  text = text.replace(/^[ \t]*-+\s*\|\s*-+.*$/gm, '');

  // 4) Remove React components and JSX/HTML-like tags (including block components)
  // Remove blocks like <Tag ...> ... </Tag>
  // Greedy match to remove entire component blocks possibly spanning multiple lines
  text = text.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*>[\s\S]*?<\/\1\s*>/g, '');
  // Remove self-closing components, e.g. <Component ... />
  text = text.replace(/<([A-Z][A-Za-z0-9]*)\b[^>]*\/\s*>/g, '');
  // Also remove any leftover generic HTML tags to be safe
  text = text.replace(/<[^>]+>/g, '');

  // 5) Unwrap fenced code blocks: replace ```lang? ... ``` with its inner content
  text = text.replace(/```[\w-]*\s*([\s\S]*?)```/g, (_m, code) => code.trimEnd());

  // 6) Replace headings with plain text (strip leading # and surrounding spaces)
  text = text.replace(/^\s{0,3}#{1,6}\s*(.+?)\s*$/gm, (_m, title) => title);

  // 7) Unwrap markdown links: [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

  // Cleanup: collapse excessive blank lines (keep at most one blank line)
  text = text
    .replace(/[ \t]+\n/g, '\n') // strip trailing whitespace
    .replace(/\n{3,}/g, '\n\n') // collapse multiple blank lines
    .trim();

  return text;
}