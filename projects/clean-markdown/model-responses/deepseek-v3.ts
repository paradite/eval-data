export function cleanMarkdown(markdown: string): string {
    // Remove frontmatter (between --- and ---)
    let cleaned = markdown.replace(/^---[\s\S]*?---\n*/g, '');

    // Remove import statements
    cleaned = cleaned.replace(/^import .*?;\n*/gm, '');

    // Remove react components (JSX-like tags)
    cleaned = cleaned.replace(/<[A-Za-z][^>]*>[\s\S]*?<\/[A-Za-z][^>]*>/g, '');

    // Remove tables
    cleaned = cleaned.replace(/^\|.*\|\n\|.*\|\n(\|.*\|\n)*/gm, '');

    // Replace headings with plain text (remove # symbols)
    cleaned = cleaned.replace(/^#+\s*(.*?)\s*$/gm, '$1');

    // Unwrap markdown links
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

    // Unwrap code blocks (both with and without language spec)
    cleaned = cleaned.replace(/```[a-z]*\n([\s\S]*?)\n```/g, '$1');

    // Remove any remaining empty lines
    cleaned = cleaned.replace(/^\s*[\r\n]/gm, '');

    return cleaned.trim();
}