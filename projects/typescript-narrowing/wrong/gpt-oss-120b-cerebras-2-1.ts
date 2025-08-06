type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};
  
type KnownNames = "gpt-4" | "gpt-3.5-turbo";

/*  ModelOther can have any string **except** the two known literals */
type ModelOther = {
  name: Exclude<string, KnownNames>;
};

type Model = ModelInput | ModelOutput | ModelOther;

/* -------------------------------------------------- */
function getModelInfo(model: Model) {
  switch (model.name) {
    case "gpt-4":
      // ► model is now narrowed to ModelInput
      return model.inputTokenLimit;

    case "gpt-3.5-turbo":
      // ► model is now narrowed to ModelOutput
      return model.outputTokenLimit;

    // Optional: handle the “other” case explicitly
    default:
      // model is ModelOther here
      return undefined;
  }
}
