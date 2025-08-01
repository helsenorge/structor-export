import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import FormField from "../../FormField/FormField";
import GuidanceAction from "../Guidance/GuidanceAction";
import GuidanceParam from "../Guidance/GuidanceParam";

type AfterCompleteFormOptionProps = {
  item: QuestionnaireItem;
};

export const AfterCompleteFormOption = ({
  item,
}: AfterCompleteFormOptionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div className="horizontal full">
        <FormField
          label={t("After completing the form")}
          sublabel={t(
            "Choose what should happen after the user has completed the form",
          )}
        ></FormField>
      </div>

      <GuidanceAction item={item} />
      <GuidanceParam item={item} />
    </>
  );
};
