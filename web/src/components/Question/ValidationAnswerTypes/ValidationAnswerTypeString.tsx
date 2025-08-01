import React, { useContext } from "react";

import { Extension, QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  IItemProperty,
  IExtensionType,
} from "../../../types/IQuestionnareItemType";

import {
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";
import Select from "../../Select/Select";

const CUSTOM_REGEX_OPTION = "CUSTOM";

type Props = {
  item: QuestionnaireItem;
};

const ValidationAnswerTypeString = ({ item }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const regexOptions = [
    {
      display: t("Email"),
      code: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
    },
    {
      display: t("URL"),
      code: "^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?",
    },
    {
      display: t("National identity number"),
      code: "^((((0[1-9]|[12]\\d|3[01])([04][13578]|[15][02]))|((0[1-9]|[12]\\d|30)([04][469]|[15]1))|((0[1-9]|[12]\\d)([04]2)))|((([0-7][1-9]|[12]\\d|3[01])(0[13578]|1[02]))|(([0-7][1-9]|[12]\\d|30)(0[469]|11))|(([0-7][1-9]|[12]\\d)(02))))\\d{7}$",
    },
    {
      display: t("Telefonnummer"),
      code: "^((\\+|00)(\\d{1,3}))?\\d{5,12}$",
    },
    {
      display: t(
        "Characters approved in the norwegian national register (used for names)",
      ),
      code: "^[a-zA-Z-æøåÆØÅÁÀÄÉÈÊÎÏÑÓÒÔÖÙÜáàäçéèêîïñóòôöùüÇČĐŊŠŦŽčđŋšŧž'’* ]*$",
    },
    {
      display: t(
        "Characters approved in the norwegian national register includes numbers (used for address)",
      ),
      code: "^[a-zA-Z-æøåÆØÅÁÀÄÉÈÊÎÏÑÓÒÔÖÙÜáàäçéèêîïñóòôöùüÇČĐŊŠŦŽčđŋšŧž'’*0-9 ]*$",
    },
    {
      display: t("Only norwegian characters"),
      code: "^[æøåÆØÅa-zA-Z ]*$",
    },
    {
      display: t("Only norwegian characters + hyphen and space"),
      code: "^[æøåÆØÅa-zA-Z\\- ]*$",
    },
    {
      display: t("Only norwegian characters with line breaks"),
      code: "^(?:[æøåÆØÅa-zA-Z0-9,.!?@()+\\-\\/*]|[ \r\n\t])*$",
    },
    {
      display: t("Zip code"),
      code: "^(?!0000|9999)[0-9]{4}$",
    },
  ];

  const updateMaxLength = (number: number): void => {
    dispatch(updateItemAction(item.linkId, IItemProperty.maxLength, number));
  };

  const setRegexExtension = (regexValue: string): void => {
    const newExtention: Extension = {
      url: IExtensionType.regEx,
      valueString: regexValue,
    };
    setItemExtension(item, newExtention, dispatch);
  };

  const validationText =
    item?.extension?.find((x) => x.url === IExtensionType.validationtext)
      ?.valueString || "";
  const selectedRegEx =
    item?.extension?.find((x) => x.url === IExtensionType.regEx)?.valueString ||
    "";
  const minLength = item?.extension?.find(
    (x) => x.url === IExtensionType.minLength,
  )?.valueInteger;
  const isSelectedRegexCustomRegex = selectedRegEx
    ? !regexOptions.find((x) => x.code === selectedRegEx)
    : false;

  const [isCustomRegex, setIsCustomRegex] = React.useState<boolean>(
    isSelectedRegexCustomRegex,
  );

  return (
    <>
      <FormField label={t("Answer should be:")}>
        <Select
          value={isCustomRegex ? CUSTOM_REGEX_OPTION : selectedRegEx}
          options={[
            { display: t("No character validation"), code: "" },
            ...regexOptions,
            {
              display: t("Custom regular expression"),
              code: CUSTOM_REGEX_OPTION,
            },
          ]}
          onChange={(event) => {
            if (!event.target.value) {
              removeItemExtension(item, IExtensionType.regEx, dispatch);
              setIsCustomRegex(false);
            } else if (event.target.value === CUSTOM_REGEX_OPTION) {
              setIsCustomRegex(true);
              removeItemExtension(item, IExtensionType.regEx, dispatch);
            } else {
              setIsCustomRegex(false);
              setRegexExtension(event.target.value);
            }
          }}
        />
        {isCustomRegex && (
          <textarea
            defaultValue={selectedRegEx}
            placeholder={t("Enter custom regular expression")}
            onBlur={(event) => {
              if (!event.target.value) {
                removeItemExtension(item, IExtensionType.regEx, dispatch);
              } else {
                setRegexExtension(event.target.value);
              }
            }}
          />
        )}
      </FormField>
      <FormField label={t("Enter custom error message")}>
        <InputField
          defaultValue={validationText}
          onChange={(event) => {
            if (!event.target.value) {
              removeItemExtension(
                item,
                IExtensionType.validationtext,
                dispatch,
              );
            } else {
              const newExtention: Extension = {
                url: IExtensionType.validationtext,
                valueString: event.target.value,
              };
              setItemExtension(item, newExtention, dispatch);
            }
          }}
        />
      </FormField>
      <div className="horizontal equal">
        <FormField label={t("Minimum characters")}>
          <input
            defaultValue={minLength}
            type="number"
            aria-label="minimum sign"
            onBlur={(e) => {
              const newValue = parseInt(e.target.value);
              if (!newValue) {
                removeItemExtension(item, IExtensionType.minLength, dispatch);
              } else {
                const extension = {
                  url: IExtensionType.minLength,
                  valueInteger: newValue,
                };
                setItemExtension(item, extension, dispatch);
              }
            }}
          />
        </FormField>
        <FormField label={t("Maksimum antall tegn")}>
          <input
            defaultValue={item.maxLength || ""}
            type="number"
            aria-label="maximum sign"
            onBlur={(e) => updateMaxLength(parseInt(e.target.value.toString()))}
          />
        </FormField>
      </div>
    </>
  );
};

export default ValidationAnswerTypeString;
