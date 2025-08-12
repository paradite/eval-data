// cleanMDX.ts

export function cleanMDX(input: string): string {
  let text = input;

  // Remove frontmatter (--- ... ---)
  text = text.replace(/^---[\s\S]*?---\s*\n?/m, '');

  // Remove all import statements
  text = text.replace(/^\s*import\s.+;?\s*\n?/gm, '');

  // Remove all tables (Markdown tables start with pipe '|' or header lines)
  // Remove from any line that starts with '|' or '| ----'
  text = text.replace(/(\n)?^ *\|.*\|\s*\n(?:(?:^ *\|.*\|\s*\n*)|(?:^ *\|[\s:|\-]+\|\s*\n*))+?/gm, '');

  // Remove remaining standalone table header/sep lines, just in case
  text = text.replace(/^\s*\|[\s:|\-\u2014]+\|\s*$/gm, '');

  // Remove horizontal rules (--- or *** or ___) on their own line
  text = text.replace(/^\s*(---|\*\*\*|___)\s*$/gm, '');

  // Remove react components: block components (<Component ...>...</Component>) and self-closing (<Component ... />)
  // Remove multiline component blocks
  text = text.replace(/^\s*<([A-Z][A-Za-z0-9]*)\b[^>]*>([\s\S]*?)<\/\1>\s*$/gm, '');
  // Remove self-closing components, either on one line or spanning multiple lines
  text = text.replace(/^\s*<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?\/>\s*$/gm, '');

  // Remove indented react fragments <></> that may contain arbitrary jsx, by removing lines between <Component ...> and </Component>
  // Already handled above, but to be extra robust for nested/indented components, replace any remaining <Component ...>\n...?\n</Component>
  text = text.replace(/^[\t ]*<([A-Z][A-Za-z0-9]*)(?:\s[^>]*)?>[\s\S]*?^[\t ]*<\/\1>\s*$/gm, '');

  // Unwrap code blocks: convert ```
  // We'll remove the opening/closing fence lines and keep code content.
  // Remove ```<lang> and ```
  text = text.replace(/```[a-zA-Z]*\s*\n([\s\S]*?)```/g, (_, code) => code.replace(/^\n+|\n+$/g, ''));

  // Remove blank lines left by code fence removal
  // (handled by trim at end)

  // Unwrap markdown links [text](url) => text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove markdown headings (#, ##, ###...), replacing with just the text.
  // ^#{1,6} +(.+)$
  text = text.replace(/^#{1,6}\s+(.*)$/gm, '$1');

  // Remove extra leading/trailing whitespace/blank lines
  text = text.replace(/^\s+|\s+$/g, '');

  // Replace 2+ blank lines with just two (to unify paragraph spacing)
  text = text.replace(/\n{3,}/g, '\n\n');

  return text;
}