function evaluateResponse(response, toolCalls) {
  let score = 0;

  let hasTimeStamp = false;
  let hasCreatedAt = false;
  let hasToLocaleTimeString = false;
  let hasToISOString = false;

  if (response.includes('timestamp')) {
    hasTimeStamp = true;
  }

  if (response.includes('created_at') || response.includes('createdAt')) {
    hasCreatedAt = true;
  }

  if (
    response.includes('toLocaleTimeString') ||
    response.includes('toLocaleString') ||
    response.includes('toLocaleDateString')
  ) {
    hasToLocaleTimeString = true;
  }

  if (response.includes('toISOString')) {
    hasToISOString = true;
  }

  if (hasTimeStamp && hasCreatedAt && hasToLocaleTimeString) {
    score += 9;
  } else if (hasTimeStamp && hasCreatedAt && hasToISOString) {
    score += 8.75;
  }

  if (response.length <= 1200) {
    score += 0.5;
  } else if (response.length <= 1300) {
    score += 0.25;
  } else if (response.length >= 1500) {
    score -= 0.5;
  }

  if (response.length >= 2000) {
    // more than 2000 characters is too verbose
    score = 7.5;
  } else if (response.length >= 1650) {
    // more than 1650 is likely outputting full code
    score = 8;
  }

  // if code includes + and -, it is likely a diff format (7.5)
  if (response.includes('+ ') && response.includes('- ')) {
    score = 7.5;
  }

  return score;
}
