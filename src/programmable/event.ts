import { hitTest } from "../element";
import { NonDeletedExcalidrawElement } from "../element/types";
import { AppState, Gesture } from "../types";
import { isMatch } from "./selector";

const MOUSE_EVENT_MAP: any = {};

export const listenMouseDownEvent = (
  selector: string,
  handle: (element: NonDeletedExcalidrawElement) => void,
) => {
  if (!handle) {
    delete MOUSE_EVENT_MAP[selector];
  } else {
    MOUSE_EVENT_MAP[selector] = handle;
  }
};

export const removeAllListeners = () => {
  for (const key of MOUSE_EVENT_MAP.keys()) {
    delete MOUSE_EVENT_MAP[key];
  }
};

export const handlePointEvent = (
  payload: {
    pointer: { x: number; y: number };
    button: "down" | "up";
    pointersMap: Gesture["pointers"];
  },
  appState?: AppState,
  elements?: readonly NonDeletedExcalidrawElement[],
) => {
  if (payload.button === "down") {
    let fired = false;
    if (appState?.viewModeEnabled && elements) {
      const selectors = Object.keys(MOUSE_EVENT_MAP);
      const hittingElements = elements.filter((e) =>
        hitTest(e, appState, payload.pointer.x, payload.pointer.y),
      );
      hittingElements.forEach((e) => {
        const selector = selectors.find((selector) => isMatch(selector, e));
        if (selector && MOUSE_EVENT_MAP[selector]) {
          MOUSE_EVENT_MAP[selector](e);
          // eslint-disable-next-line
          console.log(
            `DEBUG: click event ${payload.button} on selector ${selector} fired`,
          );
          fired = true;
        }
      });
    }
    if (fired) {
      (window as any).P._update();
    }
  }
};
