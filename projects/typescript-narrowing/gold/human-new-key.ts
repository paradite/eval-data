type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
  type: "input";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
  type: "output";
};

type ModelOther = {
  name: string;
  type: "other";
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.type) {
    case "input":
      return model.inputTokenLimit;
    case "output":
      return model.outputTokenLimit;
    case "other":
      return undefined;
  }
}
