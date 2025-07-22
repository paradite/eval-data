type ModelInput = {
  inputTokenLimit: number;
  name: 'gpt-4';
};

type ModelOutput = {
  outputTokenLimit: number;
  name: 'gpt-3.5-turbo';
};

// By excluding the specific model names from the 'string' type,
// we create a true discriminated union. Now, TypeScript knows that if
// `model.name` is "gpt-4", the type MUST be `ModelInput`.
type ModelOther = {
  name: Exclude<string, 'gpt-4' | 'gpt-3.5-turbo'>;
  someOtherProp?: unknown; // Other types can have other properties
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.name) {
    case 'gpt-4':
      // No error: `model` is correctly narrowed to `ModelInput`
      return model.inputTokenLimit;

    case 'gpt-3.5-turbo':
      // No error: `model` is correctly narrowed to `ModelOutput`
      return model.outputTokenLimit;

    default:
      // In the default case, `model` is narrowed to `ModelOther`
      // It's good practice to handle all cases.
      return null;
  }
}
