import { cleanMDX } from './cleanMDX.ts';
import { readFileSync } from 'fs';
import * as assert from 'assert';

const inputText = readFileSync('./sample-input.mdx', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

const cleanedText = cleanMDX(inputText);

const isSame = cleanedText.trim() === expectedOutputText.trim();

console.log(cleanedText.length);
console.log(expectedOutputText.length);

assert.ok(isSame, 'cleanedText is not the same as expectedOutputText');