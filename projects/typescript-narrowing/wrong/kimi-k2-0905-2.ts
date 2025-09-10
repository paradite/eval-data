type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

type ModelOther = {
  name: string & ("gpt-4" | "gpt-3.5-turbo" extends never ? never : string);
  // or more simply:
  // name: Exclude<string, "gpt-4" | "gpt-3.5-turbo">;
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.name) {
    case "gpt-4":
      return model.inputTokenLimit; // ✅ Now correctly narrowed to ModelInput
    case "gpt-3.5-turbo":
      return model.outputTokenLimit; // ✅ Now correctly narrowed to ModelOutput
    default:
      // model is narrowed to ModelOther here
      return null; // or handle ModelOther as needed
  }
}