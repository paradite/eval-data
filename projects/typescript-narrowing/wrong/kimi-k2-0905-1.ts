type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

// give ModelOther literal names that are *different* from the handled ones
type ModelOther = {
  name: "babbage" | "curie" | "davinci" | (string & {}); // (string & {}) keeps it open for other strings
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.name) {
    case "gpt-4":
      // now TS knows model must be ModelInput
      return model.inputTokenLimit;
    case "gpt-3.5-turbo":
      // now TS knows model must be ModelOutput
      return model.outputTokenLimit;
    default:
      // ModelOther
      return undefined; // or whatever fallback you need
  }
}