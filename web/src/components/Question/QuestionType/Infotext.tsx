import React, { useContext } from "react";

import { Extension, QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  IExtensionType,
  IItemProperty,
  IQuestionnaireItemType,
} from "../../../types/IQuestionnareItemType";

import {
  createMarkdownExtension,
  removeItemExtension,
  setItemExtension,
  getHyperlinkTargetvalue,
  createHyperlinkTargetExtension,
} from "../../../helpers/extensionHelper";
import {
  createItemControlExtension,
  isItemControlHighlight,
  isItemControlInline,
  ItemControlType,
} from "../../../helpers/itemControl";
import { createInlineItem } from "../../../helpers/questionTypeFeatures";
import { findElementInTreeArray } from "../../../helpers/treeHelper";
import {
  deleteItemAction,
  newItemAction,
  updateItemAction,
} from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import MarkdownEditor from "../../MarkdownEditor/MarkdownEditor";
import RadioBtn from "../../RadioBtn/RadioBtn";

type InfotextProps = {
  item: QuestionnaireItem;
  parentArray: Array<string>;
};

const HIGHLIGHT_OPTION = "highlight";
const INLINE_OPTION = "inline";

const radioOptions = [
  { code: "", display: "Display" },
  { code: HIGHLIGHT_OPTION, display: "Highlight" },
  { code: INLINE_OPTION, display: "Expanded text" },
];

const Infotext = ({ item, parentArray }: InfotextProps): React.JSX.Element => {
  const { t } = useTranslation();
  const {
    state: { qItems, qOrder },
    dispatch,
  } = useContext(TreeContext);

  const dispatchUpdateMarkdown = (markdown: string): void => {
    const markdownValue = createMarkdownExtension(markdown);
    dispatch(
      updateItemAction(childItemLinkId, IItemProperty._text, markdownValue),
    );
    dispatch(updateItemAction(childItemLinkId, IItemProperty.text, markdown));
  };

  const searchPath = [...parentArray, item.linkId];
  const children = findElementInTreeArray(searchPath, qOrder);
  // Inline elements should always have only one child item and it must contain markdown
  const childItemLinkId = children.length > 0 ? children[0].linkId : "";
  const childItem = childItemLinkId ? qItems[childItemLinkId] : undefined;
  const markdownText = childItem?._text?.extension
    ? childItem._text?.extension[0].valueMarkdown || ""
    : "";

  const getCheckedOption = (): string => {
    if (isItemControlInline(item)) {
      return INLINE_OPTION;
    } else if (isItemControlHighlight(item)) {
      return HIGHLIGHT_OPTION;
    }
    return "";
  };

  const changeItemToTypeDisplay = (extension?: Extension): void => {
    if (extension) {
      setItemExtension(item, extension, dispatch);
    } else {
      removeItemExtension(item, IExtensionType.itemControl, dispatch);
    }
    dispatch(
      updateItemAction(
        item.linkId,
        IItemProperty.type,
        IQuestionnaireItemType.display,
      ),
    );
    if (childItemLinkId) {
      dispatch(
        deleteItemAction(childItemLinkId, [...parentArray, item.linkId]),
      );
    }
  };

  return (
    <>
      <FormField label={t("Display type")}>
        <RadioBtn
          onChange={(newValue: string) => {
            if (newValue === INLINE_OPTION) {
              const newExtension = createItemControlExtension(
                ItemControlType.inline,
              );
              const newInlineItem = createInlineItem();
              setItemExtension(item, newExtension, dispatch);
              dispatch(
                updateItemAction(
                  item.linkId,
                  IItemProperty.type,
                  IQuestionnaireItemType.text,
                ),
              );
              dispatch(
                newItemAction(newInlineItem, [...parentArray, item.linkId], 0),
              );

              if (item.extension && getHyperlinkTargetvalue(item.extension)) {
                setItemExtension(
                  newInlineItem,
                  createHyperlinkTargetExtension(
                    getHyperlinkTargetvalue(item.extension),
                  ),
                  dispatch,
                );
              }
            } else if (newValue === HIGHLIGHT_OPTION) {
              const newExtension = createItemControlExtension(
                ItemControlType.highlight,
              );
              changeItemToTypeDisplay(newExtension);
            } else {
              changeItemToTypeDisplay();
            }
          }}
          checked={getCheckedOption()}
          options={radioOptions}
          name={"infotext-radio"}
        />
      </FormField>
      {getCheckedOption() === INLINE_OPTION && (
        <FormField label={t("Expanded text")}>
          <MarkdownEditor data={markdownText} onBlur={dispatchUpdateMarkdown} />
        </FormField>
      )}
    </>
  );
};

export default Infotext;
