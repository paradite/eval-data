export function cleanMarkdown(markdown: string): string {
    return markdown
        // Remove frontmatter
        .replace(/^---[\s\S]*?---\s*\n?/g, '')
        // Remove tables
        .replace(/^\s*\|.*\|\s*$\n?(\s*\|.*\|\s*$\n?)+/gm, '')
        // Remove react components
        .replace(/<[^>\n]*>([\s\S]*?)<\/[^>\n]*>/g, '')
        .replace(/<[^>\n]+\/>/g, '')
        // Remove import statements
        .replace(/^import\s+.*$/gm, '')
        // Replace headings with plain text
        .replace(/^(#{1,6})\s*(.*)$/gm, '$2')
        // Unwrap markdown links
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        // Unwrap code blocks
        .replace(/```[\s\S]*?\n|```/g, '')
        // Clean up extra newlines
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}