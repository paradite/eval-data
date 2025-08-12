export function cleanMDX(mdxText: string): string {
  let cleaned = mdxText;

  // Remove frontmatter (--- ... ---)
  cleaned = cleaned.replace(/^---[\s\S]*?---\n?/, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*?from\s+['"][^'"]*['"];?\s*$/gm, '');

  // Remove react components (<Component ... /> or <Component ...>...</Component>)
  cleaned = cleaned.replace(/<([A-Z][^\s>\/]*)(?:\s[^>]*?)?(?:\/>|>[\s\S]*?<\/\1>)/g, '');

  // Remove tables
  cleaned = cleaned.replace(/^\|.*\|.*\|?[\s\S]*?^\|.*\|[\s\S]*?/gm, '');

  // Replace headings (# ## ### #### ##### ######) with plain text
  cleaned = cleaned.replace(/^(#{1,6})\s*(.+)$/gm, '$2');

  // Remove horizontal rules (---, ***, ___ with optional spaces)
  cleaned = cleaned.replace(/^(---|\*\*\*|___)\s*$/gm, '');

  // Unwrap markdown links [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Unwrap code blocks (```lang\n...code...``` or ```\n...code...```)
  cleaned = cleaned.replace(/```(?:\w+)?\n?([\s\S]*?)```/g, '$1');

  // Clean up extra newlines (reduce multiple newlines to at most 2)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  cleaned = cleaned.trim();

  return cleaned;
}