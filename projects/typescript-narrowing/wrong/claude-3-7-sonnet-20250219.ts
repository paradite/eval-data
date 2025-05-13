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
    return model.inputTokenLimit; // TypeScript correctly narrows to ModelInput
  } else if (model.name === "gpt-3.5-turbo") {
    return model.outputTokenLimit; // TypeScript correctly narrows to ModelOutput
  }
}
