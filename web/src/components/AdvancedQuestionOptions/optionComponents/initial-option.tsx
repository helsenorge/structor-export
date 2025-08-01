import React, { useContext } from "react";

import { QuestionnaireItem, QuestionnaireItemInitial } from "fhir/r4";

import {
  IItemProperty,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import InitialInputTypeBoolean from "../InitialInputTypes/InitialInputTypeBoolean";
import InitialInputTypeChoice from "../InitialInputTypes/InitialInputTypeChoice";
import InitialInputTypeDecimal from "../InitialInputTypes/InitialInputTypeDecimal";
import InitialInputTypeInteger from "../InitialInputTypes/InitialInputTypeInteger";
import InitialInputTypeQuantity from "../InitialInputTypes/InitialInputTypeQuantity";
import InitialInputTypeString from "../InitialInputTypes/InitialInputTypeString";

type InitialOptionProps = {
  item: QuestionnaireItem;
};

const InitialOption = (props: InitialOptionProps): React.JSX.Element => {
  const { dispatch } = useContext(TreeContext);

  const dispatchUpdateItem = (
    value: QuestionnaireItemInitial | undefined,
  ): void => {
    // TODO Support multiple QuestionnaireItemInitial
    const newInitial: QuestionnaireItemInitial[] | undefined = value
      ? [value]
      : undefined;
    dispatch(
      updateItemAction(props.item.linkId, IItemProperty.initial, newInitial),
    );
  };

  function getInitialInput(): JSX.Element | undefined {
    // TODO Support multiple QuestionnaireItemInitial
    const initial: QuestionnaireItemInitial | undefined = props.item.initial
      ? props.item.initial[0]
      : undefined;

    switch (props.item.type) {
      case IQuestionnaireItemType.string:
      case IQuestionnaireItemType.text:
        return (
          <InitialInputTypeString
            initial={initial}
            dispatchAction={dispatchUpdateItem}
          />
        );
      case IQuestionnaireItemType.integer:
        return (
          <InitialInputTypeInteger
            initial={initial}
            dispatchAction={dispatchUpdateItem}
          />
        );
      case IQuestionnaireItemType.quantity:
        return (
          <InitialInputTypeQuantity
            item={props.item}
            initial={initial}
            dispatchAction={dispatchUpdateItem}
          />
        );
      case IQuestionnaireItemType.decimal:
        return (
          <InitialInputTypeDecimal
            initial={initial}
            dispatchAction={dispatchUpdateItem}
          />
        );
      case IQuestionnaireItemType.boolean:
        return (
          <InitialInputTypeBoolean
            initial={initial}
            dispatchAction={dispatchUpdateItem}
          />
        );
      case IQuestionnaireItemType.choice:
      case IQuestionnaireItemType.openChoice:
        return (
          <InitialInputTypeChoice
            item={props.item}
            dispatchAction={dispatchUpdateItem}
          />
        );
    }
  }

  return <div className="horizontal full">{getInitialInput()}</div>;
};

export default InitialOption;
