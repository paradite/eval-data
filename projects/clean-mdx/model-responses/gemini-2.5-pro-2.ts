export function cleanMDX(mdxText: string): string {
  let cleanedText = mdxText;

  // 1. Remove frontmatter
  cleanedText = cleanedText.replace(/^---[\s\S]*?---\s*/, '');

  // 2. Remove import statements
  cleanedText = cleanedText.replace(/^import[\s\S]*?from\s*['"].*['"];?\s*$/gm, '');

  // 3. Remove React components (iteratively to handle nesting)
  let previousText = '';
  while (cleanedText !== previousText) {
    previousText = cleanedText;
    // Remove self-closing components, e.g., <Component />, <Component ... />
    cleanedText = cleanedText.replace(/<[A-Z][\s\S]*?\/>/gs, '');
    // Remove components with children, e.g., <Component>...</Component>
    // The iterative approach allows this simple regex to handle nested components
    // by removing them from the inside out.
    cleanedText = cleanedText.replace(/<[A-Z][\s\S]*?>[\s\S]*?<\/[A-Z][\s\S]*?>/gs, '');
  }

  // 4. Remove tables
  cleanedText = cleanedText.replace(/^\|.*\|/gm, '');

  // 5. Unwrap code blocks
  cleanedText = cleanedText.replace(/```(?:[a-zA-Z]+)?\n([\s\S]*?)\n```/g, '$1');

  // 6. Unwrap markdown links
  cleanedText = cleanedText.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // 7. Replace headings with plain text
  cleanedText = cleanedText.replace(/^#+\s+(.*)/gm, '$1');

  // 8. Remove horizontal rule separators (---)
  cleanedText = cleanedText.replace(/^\s*---\s*$/gm, '');

  // Final cleanup: remove excessive newlines and trim whitespace
  cleanedText = cleanedText.replace(/(\r\n|\n){3,}/g, '\n\n');
  cleanedText = cleanedText.trim();

  return cleanedText;
}