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

/* ---------- type‑guard helpers ---------- */
function isModelInput(m: Model): m is ModelInput {
  return m.name === "gpt-4";
}

function isModelOutput(m: Model): m is ModelOutput {
  return m.name === "gpt-3.5-turbo";
}

/* ---------- usage ---------- */
function getModelInfo(model: Model) {
  if (isModelInput(model)) {
    // model is now known to be ModelInput
    return model.inputTokenLimit;
  }

  if (isModelOutput(model)) {
    // model is now known to be ModelOutput
    return model.outputTokenLimit;
  }

  // model is ModelOther here (or you could return undefined)
  return undefined;
}