export function cleanMDX(mdxText: string): string {
  let cleaned = mdxText;
  
  // Remove frontmatter
  cleaned = cleaned.replace(/^---\n[\s\S]*?\n---\n/m, '');
  
  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*?;?\s*$/gm, '');
  cleaned = cleaned.replace(/^import\s*\{[\s\S]*?\}\s*from\s*['"].*?['"];?\s*$/gm, '');
  
  // Remove React components (including self-closing and with children)
  cleaned = cleaned.replace(/<[A-Z][A-Za-z0-9]*[^>]*\/>/g, '');
  cleaned = cleaned.replace(/<[A-Z][A-Za-z0-9]*[^>]*>[\s\S]*?<\/[A-Z][A-Za-z0-9]*>/g, '');
  
  // Remove tables
  cleaned = cleaned.replace(/\|.*\|.*\n(\|[-\s:]*\|[-\s:]*\n)?(\|.*\|.*\n)*/g, '');
  
  // Replace headings with plain text
  cleaned = cleaned.replace(/^#{1,6}\s+(.*)$/gm, '$1');
  
  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Unwrap code blocks
  cleaned = cleaned.replace(/```[a-zA-Z]*\n([\s\S]*?)```/g, '$1');
  
  // Remove horizontal rule separators
  cleaned = cleaned.replace(/^---+\s*$/gm, '');
  
  // Clean up excessive blank lines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  // Trim leading and trailing whitespace
  cleaned = cleaned.trim();
  
  return cleaned;
}