import { cleanMarkdown } from './cleanMarkdown.ts';
import { cleanMarkdown as cleanMarkdownGpt41 } from './model-responses/gpt-4.1.ts';
import { cleanMarkdown as cleanMarkdownSonnet4 } from './model-responses/sonnet-4.ts';
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
  const diff = diffChars(expectedOutputText, cleanedTextGpt41).filter(
    (d) => d.added || d.removed
  );
  console.log('number of diff', diff.length);
  for (const d of diff) {
    console.log(d);
  }
}

// Sonnet-4
const cleanedTextSonnet4 = cleanMarkdownSonnet4(inputText);
writeFileSync('./model-responses/sonnet-4.md', cleanedTextSonnet4);
const isSameSonnet4 = cleanedTextSonnet4.trim() === expectedOutputText.trim();

console.log('Sonnet-4', isSameSonnet4);
if (!isSameSonnet4) {
  const diff = diffChars(expectedOutputText, cleanedTextSonnet4).filter(
    (d) => d.added || d.removed
  );
  console.log('number of diff', diff.length);
  for (const d of diff) {
    console.log(d);
  }
}