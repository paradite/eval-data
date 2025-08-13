type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

type ReservedNames = ModelInput["name"] | ModelOutput["name"];

type ModelOther = {
  name: Exclude<string, ReservedNames>;
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.name) {
    case "gpt-4":
      return model.inputTokenLimit;
    case "gpt-3.5-turbo":
      return model.outputTokenLimit;
    default:
      return;
  }
}