export function cleanMarkdown(text: string): string {
  // Remove frontmatter
  text = text.replace(/^---[\s\S]*?---\n*/, '');

  // Unwrap markdown links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Replace headings with plain text
  text = text.replace(/^(#{1,6})\s*(.+)$/gm, '$2');

  // Remove tables
  text = text.replace(/^\|.*\|.*(?:\n|$)/gm, '');

  // Remove react components
  text = text.replace(/<[^>\s]+[^>]*>(?:[^<]*|(?!<\/[^>]*>)[\s\S])*<\/[^>]*>/g, '');
  text = text.replace(/<[^>\/]+[^>]*\/?>/g, '');

  // Remove import statements
  text = text.replace(/^import\s+.*$/gm, '');

  // Unwrap code blocks
  text = text.replace(/```[\s\S]*?\n([\s\S]*?)```/g, '$1');
  text = text.replace(/( *)(```)/g, '');

  // Clean up multiple newlines
  text = text.replace(/\n{2,}/g, '\n\n').trim();

  return text;
}