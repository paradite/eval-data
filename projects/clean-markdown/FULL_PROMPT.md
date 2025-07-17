Implement `cleanMarkdown` function that cleans markdown text, with the following rules:

- Unwrap code blocks
- Unwrap markdown links
- Replace headings with plain text
- Remove tables
- Remove react components
- Remove import statements
- Remove frontmatter

The code would be placed inside `cleanMarkdown.ts`, and it would be tested by `test.ts`.

Just output the content of `cleanMarkdown.ts` wrapped in markdown code block, no other text or explanation needed.

sample-input.md

```md
---
layout: post
title: 'Test Post'
date: 2025-01-01
---

# AI and RL Timeline (2015-2024)

This is a paragraph with a [regular link](https://example.com) in it.

| Col1 | Col2 |
|------|------|
| A    | B    |

<CustomComponent prop="value">
  <NestedComponent />
</CustomComponent>

```javascript
const example = "code";
console.log(example);
```

```
Some code without language
```

## 2015

DQN - DeepMind published their work on Deep Q-Networks (DQN) in Nature, demonstrating how reinforcement learning with deep neural networks could achieve human-level performance across 49 Atari games, learning directly from pixel inputs.

AlphaGo - Google DeepMind created AlphaGo, the first computer program to defeat a professional human Go player, combining Monte Carlo tree search (MCTS) with deep neural networks trained by supervised and reinforcement learning.
```

expected-output.md

```
AI and RL Timeline (2015-2024)

This is a paragraph with a regular link in it.

const example = "code";
console.log(example);

Some code without language

2015

DQN - DeepMind published their work on Deep Q-Networks (DQN) in Nature, demonstrating how reinforcement learning with deep neural networks could achieve human-level performance across 49 Atari games, learning directly from pixel inputs.

AlphaGo - Google DeepMind created AlphaGo, the first computer program to defeat a professional human Go player, combining Monte Carlo tree search (MCTS) with deep neural networks trained by supervised and reinforcement learning.
```

test.ts

```ts
import { cleanMarkdown } from './cleanMarkdown.ts';
import { readFileSync } from 'fs';
import * as assert from 'assert';

const inputText = readFileSync('./sample-input.md', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

const cleanedText = cleanMarkdown(inputText);

const isSame = cleanedText.trim() === expectedOutputText.trim();

assert.ok(isSame, 'cleanedText is not the same as expectedOutputText');
```