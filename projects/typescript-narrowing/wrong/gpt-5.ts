type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

type KnownNames = ModelInput["name"] | ModelOutput["name"];

type ModelOther = {
  // Exclude the known literal names so the union becomes properly discriminated
  name: Exclude<string, KnownNames>;
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model): number | undefined {
  switch (model.name) {
    case "gpt-4":
      return model.inputTokenLimit;
    case "gpt-3.5-turbo":
      return model.outputTokenLimit;
    default:
      return undefined;
  }
}