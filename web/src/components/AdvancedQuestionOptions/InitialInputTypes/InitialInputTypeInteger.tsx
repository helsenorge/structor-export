import React, { useState } from "react";

import { QuestionnaireItemInitial } from "fhir/r4";
import { useTranslation } from "react-i18next";

import FormField from "../../FormField/FormField";

type InitialInputTypeIntegerProps = {
  initial?: QuestionnaireItemInitial;
  dispatchAction: (value: QuestionnaireItemInitial | undefined) => void;
};

const InitialInputTypeInteger = (
  props: InitialInputTypeIntegerProps,
): React.JSX.Element => {
  const { t } = useTranslation();
  const [initialValue, setInitialValue] = useState(getValue(props.initial));

  function getValue(initial: QuestionnaireItemInitial | undefined): string {
    if (!initial) {
      return "";
    }
    return initial.valueInteger?.toString() || "";
  }

  function isInteger(value: string): boolean {
    return /^\d+$/.test(value);
  }

  return (
    <FormField label={t("Initial value")}>
      <input
        type="number"
        value={initialValue}
        onChange={(event) => {
          if (isInteger(event.target.value) || event.target.value === "") {
            setInitialValue(event.target.value);
          }
        }}
        onBlur={() => {
          const newInitial: QuestionnaireItemInitial | undefined = isInteger(
            initialValue,
          )
            ? { valueInteger: parseInt(initialValue) }
            : undefined;
          props.dispatchAction(newInitial);
        }}
      />
    </FormField>
  );
};

export default InitialInputTypeInteger;
