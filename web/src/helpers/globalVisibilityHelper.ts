import { Extension, Coding } from "fhir/r4";

import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "../types/IQuestionnaireMetadataType";
import { ICodeSystem, IExtensionType } from "../types/IQuestionnareItemType";

import { updateQuestionnaireMetadataAction } from "../store/treeStore/treeActions";
import { ActionType } from "../store/treeStore/treeStore";

export const globalVisibility = [
  { code: "hide-sidebar", display: "Hide sidebar texts" },
  { code: "hide-help", display: "Hide help texts" },
  { code: "hide-sublabel", display: "Hide sublabel texts" },
  { code: "hide-progress", display: "Hide progress indicator" },
];

export enum VisibilityType {
  hideSidebar = "hide-sidebar",
  hideHelp = "hide-help",
  hideSublabel = "hide-sublabel",
  hideProgress = "hide-progress",
}

const createItemControlExtensionWithTypes = (
  types: VisibilityType[],
): Extension => {
  const initCodingArray: Coding[] = [];
  const extension = {
    url: IExtensionType.globalVisibility,
    valueCodeableConcept: { coding: initCodingArray },
  };

  types.forEach((type: VisibilityType) => {
    extension.valueCodeableConcept.coding.push(createVisibilityCoding(type));
  });
  return extension;
};

export const createItemControlExtension = (type: VisibilityType): Extension => {
  let codingSystem = "";
  if (type === VisibilityType.hideProgress) {
    codingSystem = ICodeSystem.progressIndicatorOptions;
  } else {
    codingSystem = ICodeSystem.attachmentRenderOptions;
  }
  return {
    url: IExtensionType.globalVisibility,
    valueCodeableConcept: {
      coding: [
        {
          system: codingSystem,
          code: type,
          display: getVisibilityCodeDisplay(type),
        },
      ],
    },
  };
};

const existItemControlExtension = (item: IQuestionnaireMetadata): boolean => {
  return (
    item.extension?.find(
      (x: Extension) => x.url === IExtensionType.globalVisibility,
    ) !== undefined
  );
};

const existItemControlWithCode = (
  item: IQuestionnaireMetadata,
  code: string,
): boolean => {
  const exist =
    item.extension
      ?.filter((x: Extension) => x.url === IExtensionType.globalVisibility)
      ?.find((x: Extension) =>
        x.valueCodeableConcept?.coding?.some((s: Coding) => s.code === code),
      ) !== undefined;
  return exist;
};

const handleTypeInItemControlExtension = (
  item: IQuestionnaireMetadata,
  code: VisibilityType,
): Extension | null => {
  if (!existItemControlExtension(item)) {
    return createItemControlExtension(code);
  }

  const coding = item.extension
    ?.find((f: Extension) => f.url === IExtensionType.globalVisibility)
    ?.valueCodeableConcept?.coding?.filter((f: Coding) => f.code !== code)
    ?.map((c: Coding) => c.code) as VisibilityType[];

  if (!existItemControlWithCode(item, code)) {
    coding.push(code);
  }

  return coding.length > 0 ? createItemControlExtensionWithTypes(coding) : null;
};

export const isVisibilityHideSidebar = (
  item: IQuestionnaireMetadata,
): boolean => {
  return existItemControlWithCode(item, VisibilityType.hideSidebar);
};

export const isVisibilityHideHelp = (item: IQuestionnaireMetadata): boolean => {
  return existItemControlWithCode(item, VisibilityType.hideHelp);
};

export const isVisibilityHideSublabel = (
  item: IQuestionnaireMetadata,
): boolean => {
  return existItemControlWithCode(item, VisibilityType.hideSublabel);
};

export const isVisibilityHideProgress = (
  item: IQuestionnaireMetadata,
): boolean => {
  return existItemControlWithCode(item, VisibilityType.hideProgress);
};

export const setItemControlExtension = (
  item: IQuestionnaireMetadata,
  code: VisibilityType,
  dispatch: (value: ActionType) => void,
): void => {
  const extensionsToSet = (item.extension || []).filter(
    (x: Extension) => x.url !== IExtensionType.globalVisibility,
  );
  const extension = handleTypeInItemControlExtension(item, code);
  if (extension) {
    extensionsToSet.push(extension);
  }
  dispatch(
    updateQuestionnaireMetadataAction(
      IQuestionnaireMetadataType.extension,
      extensionsToSet,
    ),
  );
};

export const getVisibilityCodeDisplay = (
  code: VisibilityType,
): string | undefined => {
  return globalVisibility.find((c) => c.code === code)?.display;
};

export const createVisibilityCoding = (code: VisibilityType): Coding => {
  let codingSystem = "";
  if (code === VisibilityType.hideProgress) {
    codingSystem = ICodeSystem.progressIndicatorOptions;
  } else {
    codingSystem = ICodeSystem.attachmentRenderOptions;
  }
  return {
    system: codingSystem,
    code: code,
    display: getVisibilityCodeDisplay(code),
  };
};
