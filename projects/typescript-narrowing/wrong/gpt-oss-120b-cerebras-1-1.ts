type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

/**
 * `ModelOther` can have any string *except* the two literals that are already used
 * by `ModelInput` and `ModelOutput`.  This makes the union discriminated on `name`.
 */
type ModelOther = {
  name: Exclude<string, "gpt-4" | "gpt-3.5-turbo">;
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.name) {
    case "gpt-4":
      // `model` is narrowed to `ModelInput`
      return model.inputTokenLimit;
    case "gpt-3.5-turbo":
      // `model` is narrowed to `ModelOutput`
      return model.outputTokenLimit;
    default:
      // Here `model` is `ModelOther`
      return undefined; // or whatever you want to do with the “other” case
  }
}