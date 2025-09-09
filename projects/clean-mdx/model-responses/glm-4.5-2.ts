export function cleanMDX(text: string): string {
  // Remove frontmatter
  text = text.replace(/^---[\s\S]*?---\n?/, '');
  
  // Remove import statements
  text = text.replace(/^\s*import.*$/gm, '');
  
  // Remove horizontal rule separators
  text = text.replace(/^\s*---\s*$/gm, '');
  
  // Remove tables (any line containing pipe characters)
  text = text.replace(/^[|].*$/gm, '');
  
  // Remove self-closing React components
  text = text.replace(/<[^>]+\/>/gs, '');
  
  // Remove non-self-closing React components (with nested support)
  let prevText;
  do {
    prevText = text;
    text = text.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/gs, '');
  } while (text !== prevText);
  
  // Unwrap code blocks (remove language and backticks)
  text = text.replace(/```(?:\w*)\n([\s\S]*?)```/g, '$1');
  
  // Unwrap markdown links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Replace headings with plain text
  text = text.replace(/^#+\s+/gm, '');
  
  return text;
}