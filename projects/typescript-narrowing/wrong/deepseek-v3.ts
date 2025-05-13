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
      // Now properly narrowed to ModelInput
      return model.inputTokenLimit;
    case "gpt-3.5-turbo":
      // Now properly narrowed to ModelOutput
      return model.outputTokenLimit;
    default:
      // Handle ModelOther case
      return undefined;
  }
}