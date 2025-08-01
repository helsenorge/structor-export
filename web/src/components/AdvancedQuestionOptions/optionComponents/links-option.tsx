import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import FormField from "../../FormField/FormField";
import HyperlinkTargetElementToggle from "../HyperlinkTargetElementToggle";

type LinksOptionProps = {
  item: QuestionnaireItem;
};

export const LinksOption = ({ item }: LinksOptionProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div className="horizontal full">
        <FormField
          label={t("Links")}
          sublabel={t(
            "Choose whether the links in the components should be opened in an external window",
          )}
        ></FormField>
      </div>
      <HyperlinkTargetElementToggle item={item} />
    </>
  );
};
