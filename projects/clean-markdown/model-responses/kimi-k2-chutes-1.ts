export function cleanMarkdown(text: string): string {
  return text
    // Remove frontmatter
    .replace(/^---[\s\S]*?---\n*/m, '')
    
    // Remove import statements
    .replace(/^\s*import\s+(.+)\s+from\s+['"][^'"]+['"];?\s*$/gm, '')
    
    // Replace headings with plain text (remove # symbols)
    .replace(/^(#{1,6})\s*(.*?)\s*#*\s*$/gm, '$2')
    
    // Unwrap markdown links: [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    
    // Remove tables entirely
    .replace(/^\|.*\|.*$/gm, '')         // table rows
    .replace(/^\|?[ \-:]+\|[ \-:]*\|?$/gm, '') // separator rows
    
    // Remove empty lines created by table removal
    .replace(/\n{2,}/g, '\n\n')
    
    // Remove React components
    .replace(/<(\/?[A-Z]\w*|\w+\s[^>]*)(\/?>)/g, '')
    .replace(/<\w+[^>]*>[\s\S]*?<\/\w+>/g, '')
    
    // Unwrap code blocks: remove ```lang only, keep content
    .replace(/```[^\n]*\n?([\s\S]*?)```/g, '$1')
    .trim();
}