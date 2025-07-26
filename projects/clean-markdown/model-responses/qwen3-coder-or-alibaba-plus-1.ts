export function cleanMarkdown(markdown: string): string {
    let result = markdown;
  
    // Remove frontmatter (--- ... ---)
    result = result.replace(/^---[\s\S]*?---\s*/, '');
  
    // Remove import statements
    result = result.replace(/^import\s+.*?;\s*$/gm, '');
  
    // Remove React components (custom tags)
    result = result.replace(/<\/?[\w]+[^>]*>\s*$/gm, '');
    result = result.replace(/<[\w]+[^>]*>[\s\S]*?<\/[\w]+>/g, '');
    result = result.replace(/<[\w]+[^>]*\/>/g, '');
  
    // Remove tables
    result = result.replace(/^\|.*\|.*$/gm, '');
    result = result.replace(/^[\s\S]*?\|\s*[-\s\|]+\s*\|[\s\S]*?$/gm, '');
  
    // Replace headings with plain text (remove # symbols)
    result = result.replace(/^#+\s*(.*)$/gm, '$1');
  
    // Unwrap markdown links [text](url) -> text
    result = result.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  
    // Unwrap code blocks ```language ... ``` -> ...
    result = result.replace(/```[\w]*\n([\s\S]*?)\n```/g, '$1');
  
    // Trim leading/trailing whitespace
    result = result.trim();
  
    return result;
  }