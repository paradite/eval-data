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

function getModelInfo(model: Model) {
  if (model.name === "gpt-4") {
    // Type is narrowed to ModelInput
    return model.inputTokenLimit;
  } else if (model.name === "gpt-3.5-turbo") {
    // Type is narrowed to ModelOutput
    return model.outputTokenLimit;
  }
}