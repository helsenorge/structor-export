import React, { useContext } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import {
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

interface ValidationTypeProp {
  item: QuestionnaireItem;
}

const ValidationAnswerTypeNumber = ({
  item,
}: ValidationTypeProp): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const validationText =
    item?.extension?.find((x) => x.url === IExtensionType.validationtext)
      ?.valueString || "";
  const minValue = item?.extension?.find(
    (x) => x.url === IExtensionType.minValue,
  )?.valueInteger;
  const maxValue = item?.extension?.find(
    (x) => x.url === IExtensionType.maxValue,
  )?.valueInteger;
  const maxDecimalPlaces = item?.extension?.find(
    (x) => x.url === IExtensionType.maxDecimalPlaces,
  )?.valueInteger;
  const isDecimal =
    item?.type === IQuestionnaireItemType.decimal ||
    item?.type === IQuestionnaireItemType.quantity;

  const dispatchUpdateItemType = (
    value: IQuestionnaireItemType.decimal | IQuestionnaireItemType.integer,
  ): void => {
    dispatch(updateItemAction(item.linkId, IItemProperty.type, value));
  };

  const changeItemType = (): void => {
    const newItemType =
      item?.type === IQuestionnaireItemType.decimal
        ? IQuestionnaireItemType.integer
        : IQuestionnaireItemType.decimal;

    dispatchUpdateItemType(newItemType);
    if (newItemType === IQuestionnaireItemType.integer) {
      removeItemExtension(item, IExtensionType.maxDecimalPlaces, dispatch);
    }
  };

  return (
    <>
      <div className="horizontal equal">
        {item?.type !== IQuestionnaireItemType.quantity && (
          <FormField>
            <SwitchBtn
              label={t("Allow decimals")}
              value={isDecimal}
              onChange={changeItemType}
            />
          </FormField>
        )}
        {isDecimal && (
          <FormField>
            <label className="#">{t("Max number of decimals")}</label>
            <input
              type="number"
              defaultValue={maxDecimalPlaces}
              onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (!event.target.value) {
                  removeItemExtension(
                    item,
                    IExtensionType.maxDecimalPlaces,
                    dispatch,
                  );
                } else {
                  const extension = {
                    url: IExtensionType.maxDecimalPlaces,
                    valueInteger: parseInt(event.target.value),
                  };
                  setItemExtension(item, extension, dispatch);
                }
              }}
            />
          </FormField>
        )}
      </div>

      <div className="horizontal equal">
        <FormField label={t("Min value")}>
          <input
            type="number"
            defaultValue={minValue}
            onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (!event.target.value) {
                removeItemExtension(item, IExtensionType.minValue, dispatch);
              } else {
                const extension = {
                  url: IExtensionType.minValue,
                  valueInteger: parseInt(event.target.value),
                };
                setItemExtension(item, extension, dispatch);
              }
            }}
          ></input>
        </FormField>
        <FormField label={t("Max value")}>
          <input
            type="number"
            defaultValue={maxValue}
            onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (!event.target.value) {
                removeItemExtension(item, IExtensionType.maxValue, dispatch);
              } else {
                const extension = {
                  url: IExtensionType.maxValue,
                  valueInteger: parseInt(event.target.value),
                };
                setItemExtension(item, extension, dispatch);
              }
            }}
          ></input>
        </FormField>
      </div>

      <FormField label={t("Enter custom error message")}>
        <InputField
          defaultValue={validationText}
          placeholder={t("error message")}
          onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (!event.target.value) {
              removeItemExtension(
                item,
                IExtensionType.validationtext,
                dispatch,
              );
            } else {
              const extension = {
                url: IExtensionType.validationtext,
                valueString: event.target.value,
              };
              setItemExtension(item, extension, dispatch);
            }
          }}
        />
      </FormField>
    </>
  );
};

export default ValidationAnswerTypeNumber;
