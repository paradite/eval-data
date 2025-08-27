export function cleanMarkdown(text: string): string {
  // Remove frontmatter (between --- markers)
  text = text.replace(/^---\n[\s\S]*?\n---\n?/g, '');
  
  // Remove import statements
  text = text.replace(/^import\s+.*?;?\s*$/gm, '');
  
  // Remove tables
  text = text.replace(/^\|.*\|$\n(^\|.*\|$\n?)*/gm, '');
  
  // Remove react components (JSX-like tags)
  text = text.replace(/<[A-Za-z][A-Za-z0-9]*(\s+[^>]*)?>[\s\S]*?<\/[A-Za-z][A-Za-z0-9]*>/g, '');
  
  // Unwrap code blocks (both with and without language specifier)
  text = text.replace(/```[a-z]*\n([\s\S]*?)```/g, '$1');
  
  // Unwrap markdown links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Replace headings with plain text (remove # symbols)
  text = text.replace(/^#{1,6}\s+(.*)$/gm, '$1');
  
  // Clean up extra newlines and whitespace
  text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
  text = text.trim();
  
  return text;
}