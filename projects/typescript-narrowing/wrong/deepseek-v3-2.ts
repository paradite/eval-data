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
      // Now TypeScript knows model is ModelInput
      return model.inputTokenLimit;
    case "gpt-3.5-turbo":
      // Now TypeScript knows model is ModelOutput
      return model.outputTokenLimit;
    default:
      // Handle ModelOther case if needed
      return undefined;
  }
}