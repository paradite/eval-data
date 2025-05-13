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

function getModelInfo(model: Model): number | undefined {
  switch (model.name) {
    case "gpt-4":
      // At this point, TypeScript knows model.name is "gpt-4".
      // However, 'model' could be ModelInput or ModelOther (if ModelOther.name happens to be "gpt-4").
      // So, 'model' is currently typed as ModelInput | ModelOther.
      // We need to check for a property unique to ModelInput to fully narrow it.
      if ("inputTokenLimit" in model) {
        // Now TypeScript knows 'model' must be ModelInput,
        // because ModelInput has 'inputTokenLimit' and ModelOther does not.
        return model.inputTokenLimit;
      }
      // If it's a ModelOther with name "gpt-4", it won't have inputTokenLimit.
      // In this case, we fall through and will return undefined.
      break;
    case "gpt-3.5-turbo":
      // Similarly, 'model' is currently typed as ModelOutput | ModelOther.
      if ("outputTokenLimit" in model) {
        // Now TypeScript knows 'model' must be ModelOutput.
        return model.outputTokenLimit;
      }
      // If it's a ModelOther with name "gpt-3.5-turbo", it won't have outputTokenLimit.
      // Fall through to return undefined.
      break;
    // Optional: handle other ModelOther cases or default
    // default:
    //   // 'model' here would be ModelOther with a name not "gpt-4" or "gpt-3.5-turbo"
    //   // Or it could be one of the ModelOther instances that fell through the checks above.
    //   return undefined; // Or some other logic
  }
  // If no case returned a value (e.g., it was a ModelOther that matched a case name
  // but didn't have the specific property, or model.name didn't match any case),
  // the function will return undefined.
  return undefined;
}