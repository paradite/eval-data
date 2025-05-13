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
  return model.name === "gpt-4";
}

function isModelOutput(model: Model): model is ModelOutput {
  return model.name === "gpt-3.5-turbo";
}

function getModelInfo(model: Model) {
  switch (model.name) {
    case "gpt-4":
      if (isModelInput(model)) {
        return model.inputTokenLimit;
      }
      break;
    case "gpt-3.5-turbo":
      if (isModelOutput(model)) {
        return model.outputTokenLimit;
      }
      break;
  }
}