type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

type ModelOther = {
  // now *cannot* overlap "gpt-4" or "gpt-3.5-turbo"  
  name: Exclude<string, ModelInput["name"] | ModelOutput["name"]>;
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.name) {
    case "gpt-4":
      // here model is narrowed to ModelInput
      return model.inputTokenLimit;

    case "gpt-3.5-turbo":
      // here model is narrowed to ModelOutput
      return model.outputTokenLimit;

    default:
      // here model is ModelOther
      return undefined;
  }
}