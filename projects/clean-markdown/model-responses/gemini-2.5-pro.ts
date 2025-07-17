export const cleanMarkdown = (markdown: string): string => {
  let cleanedText = markdown;

  const codeBlocks = new Map<string, string>();
  let blockIndex = 0;

  // 1. Isolate and store code blocks, replacing them with a placeholder.
  // This prevents other rules from affecting the content within code blocks.
  cleanedText = cleanedText.replace(
    /```(?:\w*)\n([\s\S]*?)\n```/g,
    (match, codeContent) => {
      const placeholder = `___CODE_BLOCK_PLACEHOLDER_${blockIndex++}___`;
      codeBlocks.set(placeholder, codeContent);
      return placeholder;
    }
  );

  // 2. Remove YAML frontmatter (the --- block at the beginning).
  cleanedText = cleanedText.replace(/^---\s*[\s\S]*?^---\s*\n?/m, '');

  // 3. Remove import statements (often found in MDX).
  cleanedText = cleanedText.replace(/^import\s+.*from\s+['"].*['"];?\n?/gm, '');

  // 4. Remove React/JSX components.
  // This is a best-effort approach for simple cases like <Component>...</Component>
  // and self-closing <Component />.
  cleanedText = cleanedText.replace(/<[A-Z][\s\S]*?<\/[A-Z][^>]*>/g, '');
  cleanedText = cleanedText.replace(/<\s*[A-Z][^>]*\/>/g, '');

  // 5. Remove markdown tables.
  cleanedText = cleanedText.replace(
    /^\|[^\n]+\|\n\|\s*[-:]+\s*\|[^\n]*\n(?:\|[^\n]+\|\n?)*/gm,
    ''
  );

  // 6. Replace headings with plain text (e.g., "# Heading" becomes "Heading").
  cleanedText = cleanedText.replace(/^#+\s+(.*)/gm, '$1');

  // 7. Unwrap markdown links (e.g., "[link text](url)" becomes "link text").
  cleanedText = cleanedText.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1');

  // 8. Restore the unwrapped code blocks.
  for (const [placeholder, codeContent] of codeBlocks.entries()) {
    cleanedText = cleanedText.replace(placeholder, codeContent);
  }

  // 9. Final cleanup: collapse extra newlines and trim whitespace.
  cleanedText = cleanedText.replace(/\n{3,}/g, '\n\n').trim();

  return cleanedText;
};