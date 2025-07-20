export function cleanMarkdown(markdown: string): string {
  let cleaned = markdown;
  
  // Remove frontmatter
  cleaned = cleaned.replace(/^---[\s\S]*?^---\s*/m, '');
  
  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*?;?\s*$/gm, '');
  
  // Remove react components
  cleaned = cleaned.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '');
  cleaned = cleaned.replace(/<[^/]+\/>/g, '');
  cleaned = cleaned.replace(/<[^>]+>/g, '');
  
  // Remove tables
  cleaned = cleaned.replace(/^\|.*\|.*\n(?:^\|.*\|.*\n)*(?:^\|.*\|.*(?:\n|$))*/gm, '');
  
  // Unwrap markdown links
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Replace headings with plain text
  cleaned = cleaned.replace(/^#{1,6}\s+(.*$)/gm, '$1');
  
  // Unwrap code blocks
  cleaned = cleaned.replace(/```[\s\S]*?\n([\s\S]*?)\n```/g, (match, g1) => g1.trim());
  cleaned = cleaned.replace(/```[\s\S]*?\n?([\s\S]*?)\n?```/g, (match, g1) => g1.trim());
  
  // Clean up multiple newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  
  return cleaned.trim();
}