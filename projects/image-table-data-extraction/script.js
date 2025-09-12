// Expected result
// - gpt-5: 100.0, 97.2, 87.5
// - deepseek-chat-v3.1 [reasoning: high] [deepseek]: 80.6, 63.9, -
// - claude-sonnet-4:thinking: 97.2, 91.7, -
// - claude-sonnet-4: 55.6, 44.4, -

function evaluateResponse(response, toolCalls) {
  let score = 0;
  let rightAnswers = 0;

  if (response.includes('- gpt-5: 100.0, 97.2, 87.5')) {
    rightAnswers++;
  }

  if (
    response.includes('- deepseek-chat-v3.1 [reasoning: high] [deepseek]: 80.6, 63.9, -')
  ) {
    rightAnswers++;
  }

  if (response.includes('- claude-sonnet-4:thinking: 97.2, 91.7, -')) {
    rightAnswers++;
  }

  if (response.includes('- claude-sonnet-4: 55.6, 44.4, -')) {
    rightAnswers++;
  }

  if (rightAnswers === 4) {
    // all 4 correct, 9.5 points
    score = 9.5;
  } else if (rightAnswers === 3) {
    // 3 correct, 8 points
    score = 8;
  } else if (rightAnswers === 2) {
    // 2 correct, 6 points
    score = 6;
  } else if (rightAnswers === 1) {
    // 1 correct, 3 points
    score = 3;
  } else {
    // 0 correct, 1 point
    score = 1;
  }

  return score;
}
