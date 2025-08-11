Implement `cleanMDX` function that cleans MDX format text, with the following rules:

- Unwrap code blocks
- Unwrap markdown links
- Replace headings with plain text
- Remove tables
- Remove react components
- Remove import statements
- Remove frontmatter
- Remove horizontal rule separators (---)

The code would be placed inside `cleanMDX.ts`, and it would be tested by `test.ts`.

Output the full content of `cleanMDX.ts` wrapped in markdown code block, no other text or explanation needed.