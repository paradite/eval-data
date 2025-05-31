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

function getModelInfo(model: Model) {
  if ('inputTokenLimit' in model) {
    return model.inputTokenLimit;
  }
  if ('outputTokenLimit' in model) {
    return model.outputTokenLimit;
  }
}
