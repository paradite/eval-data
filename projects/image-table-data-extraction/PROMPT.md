Extract the Fiction.LiveBench performance data from the table in the image and return it in a structured format.

Extract the data from following 4 models for 8k, 32k and 192k:
- gpt-5
- deepseek-chat-v3.1 [reasoning: high] [deepseek]
- claude-sonnet-4:thinking
- claude-sonnet-4

Sample response format:

```
- gpt-oss-120b-high [chutes]: 47.2, 44.4, -
- gpt-4.1: 55.6, 58.3, 56.3
```

Additional instructions for variance:
- If a model did not achieve the 9.5 score in the first try, it is given a second try.
