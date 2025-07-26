export function cleanMarkdown(markdown: string): string {
  let cleaned = markdown;

  // Remove frontmatter (--- ... ---)
  cleaned = cleaned.replace(/^---[\s\S]*?---\s*/, '');

  // Remove import statements
  cleaned = cleaned.replace(/^import\s+.*?;?\s*$/gm, '');

  // Remove React components (e.g., <CustomComponent ...>...</CustomComponent>)
  cleaned = cleaned.replace(/<\w+[^>]*>[\s\S]*?<\/\w+>/g, '');
  // Also remove self-closing components
  cleaned = cleaned.replace(/<\w+[^>]*\/>/g, '');

  // Unwrap markdown links [text](url) -> text
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Replace headings with plain text (e.g., ## Heading -> Heading)
  cleaned = cleaned.replace(/^#+\s+(.*)$/gm, '$1');

  // Remove tables
  cleaned = cleaned.replace(/^\|.*\|$\s*(^\|.*\|$\s*)*/gm, '');

  // Unwrap code blocks ```lang ... ``` -> ...
  cleaned = cleaned.replace(/```[\w-]*\n([\s\S]*?)\n```/g, '$1');

  // Trim extra newlines (optional for cleaner output)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}