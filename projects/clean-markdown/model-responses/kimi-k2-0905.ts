export function cleanMarkdown(markdown: string): string {
  let text = markdown;

  // Remove frontmatter
  text = text.replace(/^---[\s\S]*?---\n*/m, '');

  // Remove react components
  text = text.replace(/<[^>]+>/g, '');

  // Remove import statements
  text = text.replace(/^import\s+.*$/gm, '');

  // Remove tables
  text = text.replace(/^\|.*\|.*$/gm, '');
  text = text.replace(/^\|.*$/gm, '');

  // Unwrap code blocks
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    const content = match.replace(/```[\w]*\n?/, '').replace(/```$/, '');
    return content.trim();
  });

  // Replace headings with plain text
  text = text.replace(/^#+\s*(.*)$/gm, '$1');

  // Unwrap markdown links
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Clean up extra blank lines
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}