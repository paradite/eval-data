import { cleanMDX } from './cleanMDX.ts';
import { readFileSync } from 'fs';

const inputText = readFileSync('./sample-input.mdx', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

const cleanedText = cleanMDX(inputText);

const isSame = cleanedText.trim() === expectedOutputText.trim();

console.log('isSame', isSame);