import React, { useContext } from "react";

import { useTranslation } from "react-i18next";

import PlusIcon from "../../images/icons/add-circle-outline.svg";
import { TreeContext } from "../../store/treeStore/treeStore";
import "./Languages.css";

type LanguagesProps = {
  showTranslationEditor: () => void;
};

const Languages = (props: LanguagesProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state } = useContext(TreeContext);

  const {
    qMetadata: { language },
    qAdditionalLanguages,
  } = state;

  function getTranslations(): React.JSX.Element {
    return (
      <div className="additional-languages">
        {qAdditionalLanguages &&
          Object.keys(qAdditionalLanguages).map((lang) => (
            <div key={lang}>{lang}</div>
          ))}
        <button
          className="language-button"
          onClick={() => props.showTranslationEditor()}
        >
          <img alt="Add language" src={PlusIcon} height="25" width="25" />
        </button>
      </div>
    );
  }

  return (
    <div className="language-bar">
      <div className="main-language">{`${t("Hovedspråk")}: ${language}`}</div>
      {getTranslations()}
    </div>
  );
};

export default Languages;
