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

function getModelInfo(model: Model) {
  if (model.name === "gpt-4") {
    return model.inputTokenLimit; // Type is now ModelInput
  } else if (model.name === "gpt-3.5-turbo") {
    return model.outputTokenLimit; // Type is now ModelOutput
  } else {
    // Handle other cases if needed
    return undefined; // or throw an error, or handle as appropriate
  }
}