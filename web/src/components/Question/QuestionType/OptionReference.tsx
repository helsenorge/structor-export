import React, { useContext } from "react";

import { Extension, QuestionnaireItem } from "fhir/r4";
import {
  DragDropContext,
  Draggable,
  DraggingStyle,
  Droppable,
  DropResult,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { useTranslation } from "react-i18next";
import "./OptionReference.css";

import {
  IExtensionType,
  IItemProperty,
} from "../../../types/IQuestionnareItemType";

import createUUID from "../../../helpers/CreateUUID";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import Btn from "../../Btn/Btn";
import InputField from "../../InputField/inputField";

type Props = {
  item: QuestionnaireItem;
};

const OptionReference = ({ item }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);

  const dispatchNewItem = (): void => {
    const newItem = [
      {
        url: IExtensionType.optionReference,
        valueReference: {
          reference: "",
          display: "",
          id: createUUID(),
        },
      },
    ];

    if (item.linkId) {
      dispatch(
        updateItemAction(item.linkId, IItemProperty.extension, [
          ...(item.extension || []),
          ...newItem,
        ]),
      );
    }
  };

  const removeItem = (id?: string): void => {
    if (id) {
      const newExtension =
        item.extension?.filter((x) => x.valueReference?.id !== id) || [];
      dispatch(
        updateItemAction(item.linkId, IItemProperty.extension, [
          ...newExtension,
        ]),
      );
    }
  };

  const updateReference = (
    type: "display" | "reference",
    value: string,
    id?: string,
  ): void => {
    const newExtension = item?.extension?.map((x) => {
      return x.valueReference?.id === id
        ? {
            url: x.url,
            valueReference: {
              ...x.valueReference,
              [type]: value,
            },
          }
        : x;
    });

    if (newExtension) {
      dispatch(
        updateItemAction(item.linkId, IItemProperty.extension, newExtension),
      );
    }
  };

  const getItemStyle = (
    isDragging: boolean,
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
  ): React.CSSProperties => ({
    userSelect: "none",
    background: isDragging ? "lightgreen" : "transparent",
    cursor: "pointer",
    ...draggableStyle,
  });

  const getListStyle = (
    isDraggingOver: boolean,
  ): {
    background: string;
  } => ({
    background: isDraggingOver ? "lightblue" : "transparent",
  });

  const optionReferences = item.extension?.filter(
    (x) => x.url === IExtensionType.optionReference,
  );

  const reorderExtension = (
    list: Extension[],
    to: number,
    from: number,
  ): Extension[] => {
    const itemToMove = list.splice(from, 1);
    list.splice(to, 0, itemToMove[0]);
    return list;
  };

  const handleReorder = (result: DropResult): void => {
    if (!result.source || !result.destination || !result.draggableId) {
      return;
    }

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    if (fromIndex !== toIndex) {
      const tempList = item.extension ? [...item.extension] : [];
      const nonOptionReferences = tempList.filter(
        (x) => x.url !== IExtensionType.optionReference,
      );
      const currentOptionReferences = tempList.filter(
        (x) => x.url === IExtensionType.optionReference,
      );
      const reordered = reorderExtension(
        currentOptionReferences,
        toIndex,
        fromIndex,
      );
      dispatch(
        updateItemAction(item.linkId, IItemProperty.extension, [
          ...nonOptionReferences,
          ...reordered,
        ]),
      );
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleReorder}>
        <Droppable
          droppableId={`droppable-${item.linkId}-option-reference`}
          key={`droppable-${item.linkId}-option-reference`}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {optionReferences?.map((reference, index) => {
                return (
                  <Draggable
                    key={reference.valueReference?.id}
                    draggableId={reference.valueReference?.id || "1"}
                    index={index}
                  >
                    {(providedDrag, snapshotDrag) => (
                      <div
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                        style={getItemStyle(
                          snapshotDrag.isDragging,
                          providedDrag.draggableProps.style,
                        )}
                        key={reference.valueReference?.id}
                      >
                        <div className="option-reference align-everything">
                          <span
                            {...providedDrag.dragHandleProps}
                            className="reorder-icon"
                            aria-label="reorder element"
                          />
                          <InputField
                            name="beskrivelse"
                            placeholder={t("Select recipient..")}
                            defaultValue={reference.valueReference?.display}
                            onBlur={(event) =>
                              updateReference(
                                "display",
                                event.target.value,
                                reference.valueReference?.id,
                              )
                            }
                          />
                          <InputField
                            name="verdi"
                            placeholder={t("Select endpoint..")}
                            defaultValue={reference.valueReference?.reference}
                            onBlur={(event) =>
                              updateReference(
                                "reference",
                                event.target.value,
                                reference.valueReference?.id,
                              )
                            }
                          />
                          {optionReferences.length > 2 && (
                            <button
                              type="button"
                              name="Fjern element"
                              className="align-everything"
                              onClick={() =>
                                removeItem(reference.valueReference?.id)
                              }
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className="center-text new-option-reference">
        <Btn
          type="button"
          variant="secondary"
          onClick={() => dispatchNewItem()}
          title={t("+ Add recipient")}
        />
      </div>
    </>
  );
};

export default OptionReference;
