type ModelInput = {
  kind: "input";
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  kind: "output";
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

type ModelOther = {
  kind: "other";
  name: string;      // any string is allowed here
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.kind) {
    case "input":
      // `model` is narrowed to `ModelInput`
      return model.inputTokenLimit;
    case "output":
      // `model` is narrowed to `ModelOutput`
      return model.outputTokenLimit;
    case "other":
      // `model` is `ModelOther`
      return undefined; // or whatever you need for the generic case
  }
}