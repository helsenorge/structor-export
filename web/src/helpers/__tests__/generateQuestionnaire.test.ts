import { Questionnaire } from "fhir/r4";
import { describe, beforeAll, it, expect } from "vitest";

import { getInitialState } from "../../store/treeStore/initialState";
import { TreeState } from "../../store/treeStore/treeStore";
import { generateQuestionnaire } from "../generateQuestionnaire";

describe(`generateQuestionnaire from initialState`, () => {
  let generatedQuestionnaire: Questionnaire;
  beforeAll(() => {
    const result = generateQuestionnaire(getInitialState());
    generatedQuestionnaire = JSON.parse(result);
  });
  it(`removes empty string properties`, () => {
    expect(generatedQuestionnaire).not.toHaveProperty("title");
  });

  it("does not remove string properties", () => {
    expect(generatedQuestionnaire).toHaveProperty(
      "resourceType",
      "Questionnaire"
    );
  });

  it(`does not remove populated arrays`, () => {
    expect(generatedQuestionnaire).toHaveProperty("subjectType", ["Patient"]);
  });
});

describe(`generateQuestionnaire from state with items`, () => {
  let generatedQuestionnaire: Questionnaire;
  beforeAll(() => {
    const linkId1 = "12345";
    const linkId2 = "67890";
    const state: TreeState = {
      ...getInitialState(),
      qItems: {
        [linkId1]: { linkId: linkId1, type: "group", _text: {} },
        [linkId2]: { linkId: linkId2, type: "group", _text: { extension: [] } },
      },
      qOrder: [
        { linkId: linkId1, items: [] },
        { linkId: linkId2, items: [] },
      ],
    };
    const result = generateQuestionnaire(state);
    generatedQuestionnaire = JSON.parse(result);
  });

  it(`removes empty objects`, () => {
    const item = generatedQuestionnaire.item
      ? generatedQuestionnaire.item[0]
      : undefined;
    expect(item).not.toHaveProperty("_text");
  });

  it(`does not remove populated objects`, () => {
    const item = generatedQuestionnaire.item
      ? generatedQuestionnaire.item[1]
      : undefined;
    expect(item).toHaveProperty("_text");
  });
});
