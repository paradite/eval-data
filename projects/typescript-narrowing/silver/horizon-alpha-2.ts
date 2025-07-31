type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

type ModelOther = {
  name: Exclude<string, "gpt-4" | "gpt-3.5-turbo">;
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  if (model.name === "gpt-4" && "inputTokenLimit" in model) {
    return model.inputTokenLimit;
  }
  if (model.name === "gpt-3.5-turbo" && "outputTokenLimit" in model) {
    return model.outputTokenLimit;
  }
  return undefined;
}