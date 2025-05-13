type ModelInput = {
  inputTokenLimit: number;
  name: "gpt-4";
};

type ModelOutput = {
  outputTokenLimit: number;
  name: "gpt-3.5-turbo";
};

/*  Any string that is NOT one of the recognised literal names  */
type OtherModelName = Exclude<string, "gpt-4" | "gpt-3.5-turbo">;

type ModelOther = {
  name: OtherModelName;
};

type Model = ModelInput | ModelOutput | ModelOther;

function getModelInfo(model: Model) {
  switch (model.name) {
    case "gpt-4":
      return model.inputTokenLimit;       // OK
    case "gpt-3.5-turbo":
      return model.outputTokenLimit;      // OK
    default:
      return undefined;                   // covers ModelOther
  }
}

/* inferred return type: number | undefined */