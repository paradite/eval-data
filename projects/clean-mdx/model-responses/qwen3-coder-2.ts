export function cleanMDX(mdx: string): string {
  let result = mdx;

  // Remove frontmatter (--- ... ---)
  result = result.replace(/^---[\s\S]*?---\s*/gm, '');

  // Remove import statements
  result = result.replace(/import\s+{[^}]*}\s+from\s+['"][^'"]*['"];?\s*/g, '');
  result = result.replace(/import\s+[^'"]*\s+from\s+['"][^'"]*['"];?\s*/g, '');

  // Remove React components (opening and closing tags)
  result = result.replace(/<[A-Z][^>]*\/>/g, ''); // Self-closing components
  result = result.replace(/<\/?[A-Z][^>]*>/g, ''); // Opening and closing tags

  // Remove tables
  result = result.replace(/^\|.*\|.*\n\|.*\|.*\n(?:\|.*\|.*\n)*/gm, '');

  // Replace headings with plain text (e.g., ## Heading -> Heading)
  result = result.replace(/^(#{1,6})\s+(.*)$/gm, '$2');

  // Unwrap markdown links [text](url) -> text
  result = result.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Remove horizontal rule separators (---)
  result = result.replace(/^\s*---+\s*$/gm, '');

  // Unwrap code blocks
  result = result.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1');

  // Trim leading/trailing whitespace
  result = result.trim();

  return result;
}