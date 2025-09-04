type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

type ModelOther = {
  name: string;
};

type Model = ModelInput | ModelOutput | ModelOther;

function isModelInput(model: Model): model is ModelInput {
  return model.name === "gpt-4" && "inputTokenLimit" in model;
}

function isModelOutput(model: Model): model is ModelOutput {
  return model.name === "gpt-3.5-turbo" && "outputTokenLimit" in model;
}

function getModelInfo(model: Model) {
  if (isModelInput(model)) {
    return model.inputTokenLimit;
  } else if (isModelOutput(model)) {
    return model.outputTokenLimit;
  }
}