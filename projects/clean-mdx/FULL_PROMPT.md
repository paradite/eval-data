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

sample-input.mdx

```mdx
---
layout: post
title: 'Test Post'
date: 2025-01-01
---

import { CustomComponent } from '@/components/CustomComponent';
import { NestedComponent } from '@/components/NestedComponent';
import {
  ExportedImage,
  CaptionedImage,
  CaptionedImageWithBorder,
} from '@/components/MdxImage';

# AI and RL Timeline (2015-2024)

This is a paragraph with a [regular link](https://example.com) in it.

| Col1 | Col2 |
| ---- | ---- |
| A    | B    |

<CaptionedImage
  src={kimiK2EvalSummary}
  caption={
    <>
      Kimi K2 Evaluation Summary on{' '}
      <a href="https://eval.16x.engineer/" target="_blank">
        16x Eval
      </a>{' '}
      across 6 tasks on coding and writing.
    </>
  }
/>

## 2015

DQN (Deep Q-Network) - Google DeepMind published the seminal paper introducing Deep Q-Networks, which successfully combined deep learning with reinforcement learning to achieve human-level performance on Atari games, marking a breakthrough in deep reinforcement learning.

ResNet - Microsoft Research introduced Residual Networks (ResNet), solving the vanishing gradient problem in very deep neural networks through skip connections, enabling training of networks with hundreds of layers and achieving breakthrough performance on ImageNet.

<CustomComponent prop="value">
  <NestedComponent />
</CustomComponent>

```javascript
const example = 'code';
console.log(example);
```

## 2016

AlphaGo - Google DeepMind created AlphaGo, the first computer program to defeat a professional human Go player (Lee Sedol), combining Monte Carlo tree search with deep neural networks trained by supervised and reinforcement learning.

OpenAI Formation - OpenAI was founded as a non-profit AI research company by Elon Musk, Sam Altman, and others, with the stated mission to ensure artificial general intelligence benefits all of humanity.

---

<CaptionedImageWithBorder
  src={kimiK2VizOutput}
  caption={<>Kimi K2 Benchmark Visualization Output</>}
/>

```
Some code without language
```

```

expected-output.md

```md
AI and RL Timeline (2015-2024)

This is a paragraph with a regular link in it.

2015

DQN (Deep Q-Network) - Google DeepMind published the seminal paper introducing Deep Q-Networks, which successfully combined deep learning with reinforcement learning to achieve human-level performance on Atari games, marking a breakthrough in deep reinforcement learning.

ResNet - Microsoft Research introduced Residual Networks (ResNet), solving the vanishing gradient problem in very deep neural networks through skip connections, enabling training of networks with hundreds of layers and achieving breakthrough performance on ImageNet.

const example = 'code';
console.log(example);

2016

AlphaGo - Google DeepMind created AlphaGo, the first computer program to defeat a professional human Go player (Lee Sedol), combining Monte Carlo tree search with deep neural networks trained by supervised and reinforcement learning.

OpenAI Formation - OpenAI was founded as a non-profit AI research company by Elon Musk, Sam Altman, and others, with the stated mission to ensure artificial general intelligence benefits all of humanity.

Some code without language

```

test.ts

```ts
import { cleanMDX } from './cleanMDX.ts';
import { readFileSync } from 'fs';

const inputText = readFileSync('./sample-input.mdx', 'utf-8');
const expectedOutputText = readFileSync('./expected-output.md', 'utf-8');

const cleanedText = cleanMDX(inputText);

const isSame = cleanedText.trim() === expectedOutputText.trim();

console.log('isSame', isSame);
```