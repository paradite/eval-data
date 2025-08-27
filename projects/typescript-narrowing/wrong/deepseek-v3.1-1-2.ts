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
  switch (model.name) {
    case "gpt-4":
      return getInputTokenLimit(model);
    case "gpt-3.5-turbo":
      return getOutputTokenLimit(model);
  }
}

function getInputTokenLimit(model: Model): number | undefined {
  if (model.name === "gpt-4") {
    return model.inputTokenLimit;
  }
}

function getOutputTokenLimit(model: Model): number | undefined {
  if (model.name === "gpt-3.5-turbo") {
    return model.outputTokenLimit;
  }
}