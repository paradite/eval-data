export function cleanMarkdown(text: string): string {
  let cleaned = text;

  // Remove frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?---\n?/, '');

  // Remove import statements
  cleaned = cleaned.replace(/^\s*import\s+.*?\s+from\s+['"`].*['"`]\s*;?\s*[\r\n]/gm, '');

  // Remove react components
  cleaned = cleaned.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '');
  cleaned = cleaned.replace(/<[^\/][^>]*\/>/g, '');

  // Remove tables
  cleaned = cleaned.replace(/^\|.*?\|.*?\|[\r\n](?:\|.*?\|.*?\|[\r\n]?)*|^\|.*?\|[\r\n](?:\|.*?\|[\r\n]?)*|^\|.*?\|[ ]*\|[ ]*[\r\n](?:\|.*?\|[ ]*\|[ ]*[\r\n]?)*|^\|.*?\|[\r\n]+(?:\|(?:(?: ?\-+ ?)+(?=\|))(?:\|[ ]*\-*[ ]*)+[\r\n])(?:\|.*?\|[ ]*\|[ ]*[\r\n]?)*|^\|.*?\|[\r\n]+(?:\|(?:(?: ?\-+ ?)+(?=\|))(?:\|[ ]*\-*[ ]*)+[\r\n])(?:\|.*?\|[ \r\n]?)*|^\|.*?\|.*?\|[\r\n]+\|(?:(?: ?\-+ ?)+(?=\|))(?:\|[ ]*\-*[ ]*)+\|[\r\n](?:\|.*?\|.*?\|[ \r\n]?)*|^\|.*?\|[\r\n]+\|(?:(?: ?\-+ ?)+(?=\|))(?:\|[ ]*\-*[ ]*)+\|[\r\n](?:\|.*?\|[ \r\n]?)*|^\|.*?\|[\r\n]+(?:(?:\|?(:?---+)---+\|[\r\n])+)(?:\|.*?[ \r\n]?)*|^\|.*?\|[\r\n]+(?:(?:\|[ ]*\:?[ ]*\-+[ ]*\:?[ ]*(?=\|)[\r\n])+)(?:\|.*?\|[ ]*\|[ ]*[\r\n]?)*|^\|.*?\|[\r\n]+(?:\|[ ]*\:?[ ]*\-+[ ]*\:?[ ]*[\r\n])+[\r\n](?:\|.*?\|[ ]*\|[ ]*[\r\n]?)*|^\|.*?\|[\r\n]+(?:\|[ ]*\:?[ ]*\-+[ ]*\:?[ ]*[\r\n])+[\r\n](?:\|.*?\|[ \r\n]?)*|^\|.*?\|[\r\n]+\|(?:[\r\n]|(?:\|.*?\|[ ]*\|[ ]*[\r\n]?)*|(?:\|.*?\|[ \r\n]?)*)|^\|.*?\|[\r\n]+\|[\r\n](?:\|.*?\|[ ]*\|[ ]*[\r\n]?)*|^\|(?:(?:.*?\|){2,}[\r\n])(?:\|.*?\|[\r\n]?)*|^\|.*?\|[\r\n](?:\|.*?\|[\r\n]?)*|^\|.*?\|[ ]*\|[ ]*[\r\n]+(?:\|.*?\|[ ]*\|[ ]*[\r\n]?)*|^\|.*?\|[ ]*\|[ ]*[\r\n]+\|.*?\|[ ]*\|[ ]*[\r\n]?|^\|.*?\|[ ]*\|[ ]*[\r\n]+(.*?\|[ ]*\|[ ]*[\r\n]?)*|^\|.*?\|[ ]*\|[ ]*[\r\n](?:\|.*?\|[ \r\n]?)+/gm, '');

  // Unwrap code blocks
  cleaned = cleaned.replace(/```[\s\S]*?\n([\s\S]*?)\n```/g, '$1');
  cleaned = cleaned.replace(/```(.*?)```/gs, '$1');

  // Remove headings marks (#, ##, ###, etc.)
  cleaned = cleaned.replace(/^\s*#{1,6}\s*(.*)$/gm, '$1');

  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Clean up extra blank lines (keep only one)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim leading/trailing whitespace
  cleaned = cleaned.trim();

  return cleaned;
}