import { QuestionnaireItem } from "fhir/r4";

import { ICodeSystem, IExtensionType } from "../types/IQuestionnareItemType";

import { RenderingOptionsEnum } from "../helpers/codeHelper";

export const hiddenItem = {
  linkId: "hidden_item",
  type: "string",
  text: "Answer here is hidden",
  code: [],
  item: [],
  required: false,
  extension: [
    {
      url: IExtensionType.hidden,
      valueBoolean: true,
    },
  ],
};

export const itemWithRenderOption = (
  renderOptions: RenderingOptionsEnum,
): QuestionnaireItem => {
  return {
    linkId: "renderOption_item",
    type: "string",
    text: "Answer here is shown",
    code: [
      {
        code: renderOptions,
        display: "KunPdf",
        system: ICodeSystem.renderOptionsCodeSystem,
        id: "06d7fc02-c17d-486d-d5f2-cb2b1dff1ee4",
      },
    ],
    item: [],
    required: false,
  } as QuestionnaireItem;
};
