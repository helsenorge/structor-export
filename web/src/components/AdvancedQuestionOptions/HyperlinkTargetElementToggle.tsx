import React, { useState, useEffect, useLayoutEffect, useContext } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { HyperlinkTarget } from "../../types/hyperlinkTargetType";
import { IExtensionType } from "../../types/IQuestionnareItemType";

import {
  createHyperlinkTargetExtension,
  getHyperlinkTargetvalue,
  removeItemExtension,
  setItemExtension,
} from "../../helpers/extensionHelper";
import { isItemControlInline } from "../../helpers/itemControl";
import { OrderItem, TreeContext } from "../../store/treeStore/treeStore";
import FormField from "../FormField/FormField";
import SwitchBtn from "../SwitchBtn/SwitchBtn";

interface Props {
  item: QuestionnaireItem;
}

const HyperlinkTargetElementToggle = ({ item }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const {
    state: { qItems, qOrder, qMetadata },
    dispatch,
  } = useContext(TreeContext);

  const [openSameWindow, setOpenSameWindow] = useState<boolean>(false);
  const [itemHyperlinkValue, setItemHyperlinkValue] = useState<
    HyperlinkTarget | undefined
  >(undefined);
  const [formHyperlinkValue, setFormHyperlinkValue] = useState<
    HyperlinkTarget | undefined
  >(undefined);
  const [itemIsInline, setItemIsInline] = useState<boolean>(false);

  useEffect(() => {
    setItemIsInline(isItemControlInline(item));
  }, [item]);

  useLayoutEffect(() => {
    setItemHyperlinkValue(
      getHyperlinkTargetvalue(item.extension ? item.extension : []),
    );
    setFormHyperlinkValue(
      getHyperlinkTargetvalue(qMetadata.extension ? qMetadata.extension : []),
    );
  }, [item.extension, qMetadata.extension]);

  useLayoutEffect(() => {
    if (!itemHyperlinkValue && !formHyperlinkValue) setOpenSameWindow(false);
    if (itemHyperlinkValue === HyperlinkTarget.DEFAULT)
      setOpenSameWindow(false);
    if (itemHyperlinkValue === HyperlinkTarget.SAME_WINDOW)
      setOpenSameWindow(true);
    if (
      !itemHyperlinkValue &&
      formHyperlinkValue === HyperlinkTarget.SAME_WINDOW
    )
      setOpenSameWindow(true);
  }, [itemHyperlinkValue, formHyperlinkValue]);

  const handleHyperlinkTargetExtension = (
    questionnaireItem: QuestionnaireItem,
    itemHyperValue: HyperlinkTarget | undefined,
    formHyperValue: HyperlinkTarget | undefined,
  ): void => {
    if (
      (!itemHyperValue || itemHyperValue === HyperlinkTarget.DEFAULT) &&
      !formHyperValue
    ) {
      setItemExtension(
        questionnaireItem,
        createHyperlinkTargetExtension(),
        dispatch,
      );
    } else if (
      (!formHyperValue || itemHyperValue === HyperlinkTarget.DEFAULT) &&
      formHyperValue === HyperlinkTarget.SAME_WINDOW
    ) {
      removeItemExtension(
        questionnaireItem,
        IExtensionType.hyperlinkTarget,
        dispatch,
      );
    } else if (
      !itemHyperValue &&
      formHyperValue === HyperlinkTarget.SAME_WINDOW
    ) {
      setItemExtension(
        questionnaireItem,
        createHyperlinkTargetExtension(HyperlinkTarget.DEFAULT),
        dispatch,
      );
    }
  };

  const getInlineItemId = (
    currentItemId: string,
    orderList: OrderItem[],
  ): string | undefined => {
    const orderListItem = orderList.find((x) => x.linkId === currentItemId);
    return orderListItem?.items[0].linkId;
  };

  const handleHyperlinkTarget = (): void => {
    handleHyperlinkTargetExtension(
      item,
      itemHyperlinkValue,
      formHyperlinkValue,
    );

    // If item is an inline item, set same extension on related item
    if (itemIsInline) {
      const inlineId = getInlineItemId(item.linkId, qOrder);
      if (inlineId)
        handleHyperlinkTargetExtension(
          qItems[inlineId],
          itemHyperlinkValue,
          formHyperlinkValue,
        );
    }
  };

  return (
    <FormField>
      <SwitchBtn
        label={t("Open item links in same tab")}
        value={openSameWindow}
        onChange={() => {
          handleHyperlinkTarget();
        }}
      />
    </FormField>
  );
};

export default HyperlinkTargetElementToggle;
