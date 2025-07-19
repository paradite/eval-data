export function cleanMarkdown(markdown: string): string {
  return markdown
    // Remove frontmatter
    .replace(/^---[\s\S]*?^---\s*\n?/m, "")

    // Remove import statements
    .replace(/^import\s+.*;?\s*$/gm, "")

    // Remove tables
    .replace(/^\|.*\|.*(?:\n\|.*\|.*|\n[\s\S]*?\|.*\|.*)*\n?/gm, "")

    // Remove react components (jsx like)
    .replace(/<[^>\s][^>]*(?:\s[^>]*?)?(?:\/>|>.*?<\/[^>]+>)/gs, "")

    // Unwrap code blocks (remove triple backticks + optional language)
    .replace(/```(?:\w*)?[\n\r]?([\s\S]*?)```/g, (_, code) => code.trim())

    // Unwrap markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")

    // Replace headings (#, ##, ###, etc.) with plain text (remove leading # and space)
    .replace(/^(#{1,6})\s*(.+)$/gm, "$2")
    .trim();
}