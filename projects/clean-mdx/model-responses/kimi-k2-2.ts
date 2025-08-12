export function cleanMDX(mdx: string): string {
  return mdx
    // Remove frontmatter (---...--- at start)
    .replace(/^---[\s\S]*?---\n*/gm, '')
    // Remove import statements
    .replace(/import\s+.*?from\s+['"][^'"]*['"];?\n*/g, '')
    // Remove react components (<Component...>)
    .replace(/<[^>\s]+\b[^>]*>([\s\S]*?)?<\/[^>\s]+>/g, '')
    .replace(/<[^>\s]+\b[^>]*\/>/g, '')
    .replace(/<[^>\s]+\b[^>]*>\s*<\/[^>\s]+>/g, '')
    // Remove tables
    .replace(/^\|.*\|.*\n(?:^\|.*\|.*\n)*/gm, '')
    // Remove horizontal rules (---)
    .replace(/^---+$/gm, '')
    // Unwrap code blocks (triple backticks)
    .replace(/```(?:\w+)?\n([\s\S]*?)```/g, '$1')
    // Unwrap inline code
    .replace(/`([^`]+)`/g, '$1')
    // Unwrap markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove heading markers (# ## ### etc)
    .replace(/^[ \t]*#{1,6}[ \t]+(.+)$/gm, '$1')
    // Clean up multiple newlines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}