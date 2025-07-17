import { cleanMarkdown } from './cleanMarkdown.ts';
import { cleanMarkdown as cleanMarkdownGpt41 } from './model-responses/gpt-4.1.ts';
import { readFileSync, writeFileSync } from 'fs';
import { diffChars } from 'diff';

const inputText = readFileSync('./sample-input.md', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

// gold
const cleanedText = cleanMarkdown(inputText);
const isSame = cleanedText.trim() === expectedOutputText.trim();
console.log('cleanMarkdown', isSame);

// GPT-4.1
const cleanedTextGpt41 = cleanMarkdownGpt41(inputText);
writeFileSync('./model-responses/gpt-4.1.md', cleanedTextGpt41);
const isSameGpt41 = cleanedTextGpt41.trim() === expectedOutputText.trim();

console.log('GPT-4.1', isSameGpt41);
if (!isSameGpt41) {
  const diff = diffChars(expectedOutputText, cleanedTextGpt41);
  for (const d of diff) {
    if (d.added || d.removed) {
      console.log(d);
    }
  }
}
