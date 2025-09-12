// Expected result
// - gpt-5: 100.0, 97.2, 87.5
// - deepseek-chat-v3.1 [reasoning: high] [deepseek]: 80.6, 63.9, -
// - claude-sonnet-4: 55.6, 44.4, -

function evaluateResponse(response, toolCalls) {
  let score = 0;
  let gpt5Correct = false;
  let deepseekCorrect = false;
  let claudeCorrect = false;

  if (response.includes('- gpt-5: 100.0, 97.2, 87.5')) {
    gpt5Correct = true;
  }

  if (
    response.includes('- deepseek-chat-v3.1 [reasoning: high] [deepseek]: 80.6, 63.9, -')
  ) {
    deepseekCorrect = true;
  }

  if (response.includes('- claude-sonnet-4: 55.6, 44.4, -')) {
    claudeCorrect = true;
  }

  if (gpt5Correct && deepseekCorrect && claudeCorrect) {
    // all correct, 9.5 points
    score += 9.5;
  } else {
    // for each right, get 3 points
    if (gpt5Correct) {
      score += 3;
    }
    if (deepseekCorrect) {
      score += 3;
    }
    if (claudeCorrect) {
      score += 3;
    }
  }

  return score;
}
