type ModelInput = {
  inputTokenLimit: number;
  name: 'gpt-4';
};

type ModelOutput = {
  outputTokenLimit: number;
  name: 'gpt-3.5-turbo';
};

type ModelOther = {
  name: string;
};

type Model = ModelInput | ModelOutput | ModelOther;

function hasInputTokenLimit(model: Model): model is ModelInput {
  return 'inputTokenLimit' in model;
}

function hasOutputTokenLimit(model: Model): model is ModelOutput {
  return 'outputTokenLimit' in model;
}

function getModelInfo(model: Model) {
  switch (model.name) {
    case 'gpt-4':
      if (hasInputTokenLimit(model)) {
        return model.inputTokenLimit; // ✅ Works
      }
      break;
    case 'gpt-3.5-turbo':
      if (hasOutputTokenLimit(model)) {
        return model.outputTokenLimit; // ✅ Works
      }
      break;
  }
}
