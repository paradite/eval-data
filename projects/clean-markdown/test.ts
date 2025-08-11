import { cleanMarkdown } from './cleanMarkdown.ts';
import { readFileSync } from 'fs';
import * as assert from 'assert';

const inputText = readFileSync('./sample-input.md', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

const cleanedText = cleanMarkdown(inputText);

const isSame = cleanedText.trim() === expectedOutputText.trim();

assert.ok(isSame, 'cleanedText is not the same as expectedOutputText');