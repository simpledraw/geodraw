import { selectGroupsForSelectedElements } from "../groups";
import { changeProperty, getFormValue } from "../actions/actionProperties";
import { register } from "../actions/register";
import { newElementWith } from "../element/mutateElement";
import { ExcalidrawElement } from "../element/types";
import { getNonDeletedElements, isTextElement } from "../element";
import { getSelectedElements } from "../scene";
import { t } from "../i18n";

export const actionChangeClass = register({
  name: "changeClass",
  trackEvent: false,
  perform: (elements, appState, value) => {
    if (value.type === "update") {
      return {
        elements: changeProperty(
          elements,
          appState,
          (el) =>
            newElementWith(el, {
              className: value.value,
            }),
          true,
        ),
        appState: { ...appState, currentItemClassName: value.value },
        commitToHistory: true,
      };
    } else if (value.type === "select") {
      const selectedElementIds = elements.reduce(
        (map: Record<ExcalidrawElement["id"], true>, element) => {
          if (
            !element.isDeleted &&
            !(isTextElement(element) && element.containerId) &&
            !element.locked &&
            element.className.split(" ").includes(value.value)
          ) {
            map[element.id] = true;
          }
          return map;
        },
        {},
      );

      return {
        appState: selectGroupsForSelectedElements(
          {
            ...appState,
            selectedLinearElement: null,
            editingGroupId: null,
            selectedElementIds,
          },
          getNonDeletedElements(elements),
        ),
        commitToHistory: false,
      };
    }
    return { elements, appState, commitToHistory: false };
  },

  PanelComponent: ({ elements, appState, updateData }) => (
    <label className="control-label">
      {t("labels.class") || "class"}
      {getSelectedElements(elements, appState).length === 1 ? (
        <input
          type="text"
          onChange={(event) =>
            updateData({ type: "update", value: event.target.value })
          }
          value={
            getFormValue(
              elements,
              appState,
              (element) => element.className,
              appState.currentItemClassName,
            ) ?? undefined
          }
        />
      ) : (
        <div>
          {elements
            .filter((e) => e.className)
            .map((e) => e.className.split(" "))
            .reduce((all, classes) => all.concat(classes), [] as string[])
            .reduce(
              (uniqs, clz) =>
                uniqs.includes(clz) ? uniqs : uniqs.concat([clz]),
              [] as string[],
            )
            .map((className) => (
              <span
                onClick={() => {
                  updateData({ type: "select", value: className });
                }}
              >
                {className}&nbsp;
              </span>
            ))}
        </div>
      )}
    </label>
  ),
});
