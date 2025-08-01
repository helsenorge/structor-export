import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import { IQuestionnaireMetadata } from "src/types/IQuestionnaireMetadataType";
import {
  IExtensionType,
  IValueSetSystem,
} from "src/types/IQuestionnareItemType";
import { Coding, Extension } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import SaveCapabilityView from "../SaveCapabilityView";

const saveCoding = (code: string): Coding => {
  return {
    system: IValueSetSystem.saveCapabilityValueSet,
    code: code,
  } as Coding;
};

const saveExtension = (code: string): Extension => {
  return {
    url: IExtensionType.saveCapability,
    valueCoding: saveCoding(code),
  } as Extension;
};

describe("SaveCapabilityView", () => {
  const updateExtensionMock = vi.fn();

  vi.mock("react-i18next", () => ({
    useTranslation: () => {
      return {
        t: (i18nKey: any) => i18nKey,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
    initReactI18next: {
      type: "3rdParty",
      init: () => {},
    },
  }));

  beforeEach(() => {
    updateExtensionMock.mockClear();
  });

  it("Shows options", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <SaveCapabilityView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    expect(
      screen.getByText(
        "Save submitted questionnaire and intermediate save (standard setting)",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Only submitted questionnaire is saved"),
    ).toBeInTheDocument();
    expect(screen.getByText("No saving")).toBeInTheDocument();
  });

  it("If no extension, default value is save and intermediate save", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <SaveCapabilityView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const saveAndIntermediateElement = screen.getByLabelText(
      "Save submitted questionnaire and intermediate save (standard setting)",
    );
    expect(saveAndIntermediateElement).toBeChecked();
    expect(saveAndIntermediateElement.getAttribute("value")).toBe("1");
  });

  it("Has only submitted code in extension, correct value is selected", () => {
    const onlySubmittedExtension = saveExtension("2");
    const treeState = {
      qMetadata: {
        extension: [onlySubmittedExtension],
      } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <SaveCapabilityView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const onlySaveElement = screen.getByLabelText(
      "Only submitted questionnaire is saved",
    );
    expect(onlySaveElement).toBeChecked();
    expect(onlySaveElement.getAttribute("value")).toBe("2");

    const defaultElement = screen.getByLabelText(
      "Save submitted questionnaire and intermediate save (standard setting)",
    );
    expect(defaultElement).not.toBeChecked();
  });

  it("Has no saving code in extension, correct value is selected", () => {
    const noSavingExtension = saveExtension("3");
    const treeState = {
      qMetadata: { extension: [noSavingExtension] } as IQuestionnaireMetadata,
    } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <SaveCapabilityView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const noSavingElement = screen.getByLabelText("No saving");
    expect(noSavingElement).toBeChecked();
    expect(noSavingElement.getAttribute("value")).toBe("3");

    const defaultElement = screen.getByLabelText(
      "Save submitted questionnaire and intermediate save (standard setting)",
    );
    expect(defaultElement).not.toBeChecked();
  });

  it("Default then change to no saving", () => {
    const treeState = { qMetadata: {} as IQuestionnaireMetadata } as TreeState;

    render(
      <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
        <SaveCapabilityView updateExtension={updateExtensionMock} />
      </TreeContext.Provider>,
    );

    const defaultElement = screen.getByLabelText(
      "Save submitted questionnaire and intermediate save (standard setting)",
    );
    expect(defaultElement).toBeChecked();
    expect(defaultElement.getAttribute("value")).toBe("1");

    const noSavingElement = screen.getByLabelText("No saving");
    fireEvent.click(noSavingElement);

    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: IExtensionType.saveCapability,
        }),
      ]),
    );
    expect(updateExtensionMock.mock.calls[0]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ valueCoding: saveCoding("3") }),
      ]),
    );
  });
});
