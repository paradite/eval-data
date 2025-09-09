export function cleanMDX(text: string): string {
  // Remove frontmatter
  let cleaned = text.replace(/^---[\s\S]*?---\n*/, '');

  // Remove import statements (including multi-line)
  cleaned = cleaned.replace(/^import\s+.*(?:\n\s+.*)*\n?/gm, '');

  // Remove react components (both self-closing and with children)
  cleaned = cleaned.replace(/<\/?[A-Z][a-zA-Z]*[^>]*>|<[^>]+\/>/g, '');

  // Remove tables
  cleaned = cleaned.replace(/^(\|.*\n)+/gm, '');

  // Remove horizontal rule separators
  cleaned = cleaned.replace(/^[\s]*-[\s-]*$/gm, '');

  // Extract code blocks to protect their content
  const codeBlocks: string[] = [];
  cleaned = cleaned.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, (match, content) => {
    codeBlocks.push(content);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Replace headings with plain text
  cleaned = cleaned.replace(/^#+\s*/gm, '');

  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Restore code blocks without formatting
  cleaned = cleaned.replace(/__CODE_BLOCK_(\d+)__/g, (_, index) => codeBlocks[parseInt(index)]);

  return cleaned.trim();
}