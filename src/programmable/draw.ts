import _ from "lodash";
import {
  DrawApi,
  ImportExportApi,
  EffectApi,
  TimeApi,
  ElementApi,
} from "./globals";
import { ExcalidrawImperativeAPI } from "../types";
import {
  actionToggleCanvasMenu,
  actionToggleEditMenu,
  actionToggleZenMode,
} from "../actions";
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
  P: DrawApi & TimeApi,
  excalidrawAPI: ExcalidrawImperativeAPI,
): DrawApi => {
  P._update = () => {
    redraw(excalidrawAPI);
    return P;
  };
  P._resetScene = () => {
    excalidrawAPI.resetScene();
    return P;
  };
  P._state = () => excalidrawAPI.getAppState();
  P._elements = () => excalidrawAPI.getSceneElements();
  P._toast = (msg: string, closable?: boolean, duration?: number) => {
    excalidrawAPI?.setToast({
      message: msg,
      duration,
      closable: closable === undefined ? false : closable,
    });
    return P;
  };
  P._api = excalidrawAPI;

  P._zen = (open: boolean) => {
    if (open && !P._state().zenModeEnabled) {
      (window as any).executeAction(actionToggleZenMode);
    } else if (!open && P._state().zenModeEnabled) {
      (window as any).executeAction(actionToggleZenMode);
    }
    return P;
  };
  P._viewOnly = (open: boolean) => {
    if (open && !P._state().viewModeEnabled) {
      (window as any).executeAction(actionToggleViewMode);
    } else if (!open && P._state().viewModeEnabled) {
      (window as any).executeAction(actionToggleViewMode);
    }
    return P;
  };
  P._geo = (open: boolean) => {
    if (open && !P._state().geoModeEnabled) {
      (window as any).executeAction(actionToggleGeoMode);
    } else if (!open && P._state().geoModeEnabled) {
      (window as any).executeAction(actionToggleGeoMode);
    }
    return P;
  };
  P._prepareGeo = async ({ message }: { message?: string }) => {
    await P._closeMenu();
    P._center();
    P._resetTime();
    P._toast(message || "Welcome, Let's Start!", false, 1000);
    await P._sleep(500);
    P._viewOnly(true);
    if (!P._state().geoModeEnabled) {
      await P._sleep(500);
      P._geo(true);
    }
    return P;
  };
  P._center = () => {
    (window as any).executeAction(actionZoomToFitV2);
    return P;
  };

  P._closeMenu = async () => {
    if (P._state().openMenu === "canvas") {
      (window as any).executeAction(actionToggleCanvasMenu);
      await P._sleep(500);
    }
    if (P._state().openMenu === "shape") {
      (window as any).executeAction(actionToggleEditMenu);
      await P._sleep(500);
    }
    return P;
  };
  P._lockAll = () => {
    const all = excalidrawAPI?.getSceneElements();
    if (all) {
      for (const e of all) {
        (e as any).locked = true;
      }
    }
    redraw(P._api);
    return P;
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
    load(json, excalidrawAPI);
    return P;
  };
  P._loadUrlEncodedJSON = (ejson: string) => {
    const obj = JSON.parse(decodeURIComponent(ejson));
    load(obj, excalidrawAPI);
    return P;
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
    return P;
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
    return P;
  };
  P._shine = async function (clzs: string[], ms: number, times: number) {
    for (let i = 0; i < times; i++) {
      await P._show(clzs, ms);
      await P._hide(clzs, ms);
    }
    await P._show(clzs);
    return P;
  };
  return P;
};
