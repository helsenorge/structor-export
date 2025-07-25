import React, { useState } from "react";

import { QuestionnaireItemInitial } from "fhir/r4";
import { useTranslation } from "react-i18next";

import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";

type InitialInputTypeStringProps = {
  initial?: QuestionnaireItemInitial;
  dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeString = (
  props: InitialInputTypeStringProps,
): React.JSX.Element => {
  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState(getValue(props.initial));

  function getValue(initial: QuestionnaireItemInitial | undefined): string {
    if (!initial) {
      return "";
    }
    return initial.valueString || "";
  }

  return (
    <FormField label={t("Initial value")}>
      <InputField
        value={initialValue}
        onChange={(event) => setInitialValue(event.target.value)}
        onBlur={() => {
          const newInitial: QuestionnaireItemInitial | undefined = initialValue
            ? { valueString: initialValue }
            : undefined;
          props.dispatchAction(newInitial);
        }}
      />
    </FormField>
  );
};

export default InitialInputTypeString;
