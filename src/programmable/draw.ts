import _ from "lodash";
import {
  DrawApi,
  ImportExportApi,
  EffectApi,
  TimeApi,
  ElementApi,
} from "./globals";
import { ExcalidrawImperativeAPI } from "../types";
import { actionToggleZenMode } from "../actions";
import { actionToggleGeoMode } from "./geomode";
import { actionToggleViewMode } from "../actions/actionToggleViewMode";
import { actionZoomToFitV2 } from "../actions/actionCanvas";
import { serializeAsJSON } from "../data/json";
import { ImportedDataState } from "../data/types";
import { restore } from "../data/restore";

const load = (
  scene: ImportedDataState,
  excalidrawAPI?: ExcalidrawImperativeAPI | null,
) => {
  if (!excalidrawAPI) {
    return;
  }
  excalidrawAPI.updateScene({
    ...scene,
    ...restore(scene, null, null),
  });
};

export const setupDraw = (
  P: DrawApi,
  excalidrawAPI: ExcalidrawImperativeAPI,
): DrawApi => {
  P._update = () => redraw(excalidrawAPI);
  P._state = () => excalidrawAPI.getAppState();
  P._elements = () => excalidrawAPI.getSceneElements();
  P._toast = (msg: string, closable?: boolean) => {
    excalidrawAPI?.setToast({
      message: msg,
      closable: closable === undefined ? false : closable,
    });
  };
  P._api = excalidrawAPI;

  P._zen = (open: boolean) => {
    if (open && !P._state().zenModeEnabled) {
      (window as any).executeAction(actionToggleZenMode);
    } else if (!open && P._state().zenModeEnabled) {
      (window as any).executeAction(actionToggleZenMode);
    }
  };
  P._viewOnly = (open: boolean) => {
    if (open && !P._state().viewModeEnabled) {
      (window as any).executeAction(actionToggleViewMode);
    } else if (!open && P._state().viewModeEnabled) {
      (window as any).executeAction(actionToggleViewMode);
    }
  };
  P._geo = () => (window as any).executeAction(actionToggleGeoMode);
  P._center = () => (window as any).executeAction(actionZoomToFitV2);
  P._lockAll = () => {
    const all = excalidrawAPI?.getSceneElements();
    if (all) {
      for (const e of all) {
        (e as any).locked = true;
      }
    }
    redraw(P._api);
  };
  return P;
};

const redraw = (excalidrawAPI?: ExcalidrawImperativeAPI | null) => {
  excalidrawAPI?.updateScene({
    elements: _.cloneDeep(excalidrawAPI?.getSceneElements()),
  });
};

export const setupExport = (
  P: ImportExportApi,
  excalidrawAPI: ExcalidrawImperativeAPI,
) => {
  // import and export api
  P._loadJSON = (json: any) => {
    return load(json, excalidrawAPI);
  };
  P._loadUrlEncodedJSON = (ejson: string) => {
    const obj = JSON.parse(decodeURIComponent(ejson));
    return load(obj, excalidrawAPI);
  };
  P._dumpJSON = (): string | undefined => {
    if (!excalidrawAPI) {
      return;
    }
    return serializeAsJSON(
      excalidrawAPI.getSceneElementsIncludingDeleted(),
      excalidrawAPI.getAppState(),
      excalidrawAPI.getFiles(),
      "local",
    );
  };

  return P;
};

// how to show the element
export const setupEffect = (
  P: EffectApi & TimeApi & DrawApi & ElementApi,
): EffectApi => {
  P._hide = async function (selectors: string | string[], ms: number) {
    if (_.isString(selectors)) {
      selectors = [selectors];
    }
    for (const c of selectors) {
      P._$(c).forEach((e: any) => (e.opacity = 0));
    }
    P._update();
    if (ms) {
      await P._sleep(ms);
    }
  };

  P._show = async function show(selectors: string | string[], ms: number) {
    if (_.isString(selectors)) {
      selectors = [selectors];
    }
    for (const c of selectors) {
      P._$(c).forEach((e: any) => (e.opacity = 80));
    }
    P._update();
    if (ms) {
      await P._sleep(ms);
    }
  };
  P._shine = async function (clzs: string[], ms: number, times: number) {
    for (let i = 0; i < times; i++) {
      await P._show(clzs, ms);
      await P._hide(clzs, ms);
    }
    await P._show(clzs);
  };
  return P;
};
