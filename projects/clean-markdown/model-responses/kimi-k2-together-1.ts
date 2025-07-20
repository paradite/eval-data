export function cleanMarkdown(markdown: string): string {
  return markdown

    // 1. Remove frontmatter (lines that start with --- and end with ---)
    .replace(/^---[\s\S]*?---\n?/, '')

    // 2. Remove import statements (lines starting with "import ")
    .replace(/^import\s+.*?[\r\n]+/gm, '')

    // 3. Remove react components
    //    - Matches self-closing: <X .../>
    //    - Matches paired: <X ...>...</X>
    .replace(/<\/?[A-Z][^\s>]*(?:\s[^>]*?)?(?:\/?>|>.*?<\/[A-Z][^\s>]*>)/gs, '')

    // 4. Remove tables (lines that contain | separated by just - or : and spaces)
    .replace(/^\|.*\|[\r\n]+^\|(?:\s*:?-+:?\s*\|)+[\r\n]+(?:^\|.*\|[\r\n]*)*/gm, '')

    // 5. Strip headings (#) but leave the text
    .replace(/^(#{1,6})\s+(.*)$/gm, (_, hash, text) => text)

    // 6. Unwrap markdown links: [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')

    // 7. Unwrap code blocks:
    //    - Remove ```language and closing ``` lines, keep inner content
    .replace(/```(?:\w+)?\n([\s\S]*?)```/g, (_, code) => code);

  // all rules above already trim blank lines automatically
}