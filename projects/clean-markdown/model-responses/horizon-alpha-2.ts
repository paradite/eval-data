export function cleanMarkdown(input: string): string {
  let text = input;

  // 1) Remove frontmatter (YAML between --- at the start)
  text = text.replace(/^(?:\uFEFF)?---[\s\S]*?---\s*\n?/, '');

  // 2) Remove import statements (JS/TS style)
  text = text.replace(/^\s*import\s+.*?;?\s*$/gm, '');

  // 3) Remove tables (lines containing '|' or only table separators)
  // Remove table separator lines like |---|---|
  text = text.replace(/^\s*\|?(?:\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?\s*$/gm, '');
  // Remove any line that looks like a table row (contains at least one pipe with non-code)
  text = text.replace(/^(?=.*\|)(?!.*`)(?!\s*<!--).*$/gm, (line) => {
    // If line has at least one pipe and isn't empty after trim, drop it
    return '';
  });

  // 4) Remove React components (tags like <Component ...>...</Component> and self-closing)
  // Remove self-closing tags first
  text = text.replace(/<\s*[A-Z][A-Za-z0-9]*(?:\s+[^<>]*?)?\/\s*>/g, '');
  // Remove component blocks. This is a non-greedy match but may not handle deep nesting perfectly; adequate for typical docs.
  text = text.replace(/<\s*([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\s*\1\s*>/g, '');

  // 5) Unwrap code blocks: replace fenced code blocks with their content
  // ```lang\n...code...\n```
  text = text.replace(/```[a-zA-Z0-9_-]*\s*\n([\s\S]*?)\n```/g, (_m, code) => code);
  // Handle single-line empty code blocks or edge cases
  text = text.replace(/```[a-zA-Z0-9_-]*\s*\n?```/g, '');

  // 6) Replace headings with plain text (remove leading # and trailing spaces)
  text = text.replace(/^(#{1,6})\s*(.*)$/gm, (_m, _h, content) => content.trim());

  // 7) Unwrap markdown links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1');

  // 8) Clean up extra blank lines caused by removals
  // Remove leftover HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');
  // Replace multiple blank lines with a maximum of one blank line
  text = text.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  return text.trim() + '\n';
}