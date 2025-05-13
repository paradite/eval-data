// Define the specific names used by ModelInput and ModelOutput
type SpecificModelNames = "gpt-4" | "gpt-3.5-turbo";

type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

// Refine ModelOther so its 'name' cannot be one of the SpecificModelNames
type ModelOther = {
  name: Exclude<string, SpecificModelNames>;
  // If ModelOther could have other properties, they would be listed here, e.g.:
  // someOtherProperty?: boolean;
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model): number | undefined { // Added explicit return type for clarity
  switch (model.name) {
    case "gpt-4":
      // After refining ModelOther, if model.name is "gpt-4",
      // TypeScript knows 'model' must be ModelInput.
      // ModelOther is excluded because ModelOther['name'] cannot be "gpt-4".
      // ModelOutput is excluded because ModelOutput['name'] is "gpt-3.5-turbo".
      return model.inputTokenLimit; // No error
    case "gpt-3.5-turbo":
      // Similarly, if model.name is "gpt-3.5-turbo",
      // TypeScript knows 'model' must be ModelOutput.
      return model.outputTokenLimit; // No error
    // No default case is strictly necessary to fix the errors,
    // the function will implicitly return undefined if 'model.name'
    // doesn't match any case (i.e., if 'model' is ModelOther).
    // A default case could be added for more explicit handling:
    // default:
    //   // Here, 'model' is narrowed to ModelOther
    //   // const otherModel: ModelOther = model;
    //   // console.log(`Unknown model name: ${otherModel.name}`);
    //   return undefined; // Or throw an error
  }
  // Implicit return undefined if no case matches
  return undefined;
}

// Example Usage:
const gpt4Model: Model = { name: "gpt-4", inputTokenLimit: 8000 };
const gpt3Model: Model = { name: "gpt-3.5-turbo", outputTokenLimit: 4000 };
const otherModel: Model = { name: "some-other-model" };
// const invalidOtherModel: Model = { name: "gpt-4" }; // This would now be a type error for ModelOther

console.log(getModelInfo(gpt4Model)); // Expected: 8000
console.log(getModelInfo(gpt3Model)); // Expected: 4000
console.log(getModelInfo(otherModel)); // Expected: undefined