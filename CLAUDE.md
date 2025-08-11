# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an evaluation data repository containing test cases and benchmarks for LLMs on real-world coding and writing tasks. Built by 16x Prompt and 16x Eval. The repository contains multiple project directories under `/projects/` with different evaluation scenarios.

## Project Structure

- **projects/** - Individual evaluation projects, each testing specific coding scenarios:
  - `clean-markdown/` - TypeScript project for cleaning markdown into plain text
  - `emoji-todo/` - Next.js TODO app with emoji support and database integration
  - `typescript-narrowing/` - TypeScript type narrowing examples and solutions
  - `sql/` - SQL code evaluation scenarios
  - `python-script/` - Python scripting evaluation tasks
  - `visualization/` - Benchmark visualization coding tasks
  - `ai-timeline/`, `kanji/`, `water-bottle/` - Writing and image analysis tasks
- **model-eval-results/** - Raw evaluation results from 16x Eval

## Common Development Commands

### Clean Markdown Project
```bash
cd projects/clean-markdown
npm run test  # Runs model testing with experimental TypeScript support
```

### Emoji TODO Project (Next.js)
```bash
cd projects/emoji-todo/code
npm run dev     # Start development server
npm run build   # Build for production
npm run lint    # Run ESLint
npm run db      # Push database schema with Drizzle Kit
```

### TypeScript Narrowing Project
```bash
cd projects/typescript-narrowing
npm run compile:gold     # Test gold standard solutions
npm run compile:silver   # Test silver tier solutions
npm run compile:wrong    # Test incorrect solutions
npm run compile:all      # Test all solution tiers
npm run compile:pending  # Test pending solutions
```

## Technology Stack

- **TypeScript**: Used across multiple projects with experimental strip-types support
- **Next.js**: Web framework for the emoji-todo project
- **Drizzle ORM**: Database ORM with PostgreSQL (Neon serverless)
- **React**: Frontend framework
- **TailwindCSS**: Styling framework
- **Node.js**: Runtime environment

## Evaluation Structure

Each project contains multiple solution categories:
- `gold/` - High-quality reference solutions
- `silver/` - Acceptable alternative solutions  
- `wrong/` - Incorrect implementations for testing
- `pending/` - Solutions under evaluation
- `model-responses/` - Generated responses from various AI models

Projects include rubrics (RUBRICS.md) defining evaluation criteria and prompts used for testing different models.