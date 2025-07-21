export function cleanMarkdown(input: string): string {
  let text = input;

  // Remove frontmatter
  text = text.replace(/^---[\s\S]*?---\n?/m, '');

  // Remove import statements
  text = text.replace(/^import\s+.*;?\n?/gm, '');

  // Unwrap code blocks and extract content
  text = text.replace(/```[\s\S]*?\n([\s\S]*?)\n```\n?/g, '$1');

  // Remove single backticks (inline code)
  text = text.replace(/`([^`]+)`/g, '$1');

  // Unwrap markdown links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Replace headings with plain text
  text = text.replace(/^\s*#{1,6}\s*(.*?)\s*#*\s*$/gm, '$1');

  // Remove tables
  text = text.replace(/^\|.*\|[\r\n]*((\|.*\|[\r\n]*)*)/gm, '');

  // Remove react components
  text = text.replace(/<(\/?[\w-]+)(?:\s[^>]*?)?\s*\/?>/g, '');
  text = text.replace(/<[\w-]+.*>[\s\S]*?<\/[\w-]+>/g, '');

  return text.trim();
}