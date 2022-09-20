import _ from "lodash";
import { ExcalidrawImperativeAPI } from "../types";
import { handlePointEvent, listenMouseDownEvent } from "./event";
import { actionToggleZenMode } from "../actions";
import { actionToggleGeoMode } from "./geomode";
import { actionToggleViewMode } from "../actions/actionToggleViewMode";
import { ImportedDataState } from "../data/types";
import { restore } from "../data/restore";
import { serializeAsJSON } from "../data/json";
import { actionZoomToFitV2 } from "../actions/actionCanvas";

const redraw = (excalidrawAPI?: ExcalidrawImperativeAPI | null) => {
  excalidrawAPI?.updateScene({
    elements: _.cloneDeep(excalidrawAPI?.getSceneElements()),
  });
};

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

interface State {
  speed: number;
  zero: number;
  pausing: boolean;
  timer: any;
}
const DefaultState: State = {
  speed: 1.0,
  zero: 0,
  timer: null,
  pausing: false,
};
export const setupProgrammable = (
  excalidrawAPI?: ExcalidrawImperativeAPI | null,
) => {
  const P: any = {};
  P.__ = _;
  P._$ = excalidrawAPI?.$;
  P._print = (log: string) => {
    // eslint-disable-next-line no-console
    console.log(log);
    const lst = P.latest || {};
    P.latest = {
      ...lst,
      log: `${lst.log}\r\n${log}`,
    };
    const cb = P._callback;
    if (cb) {
      cb("log", log);
    }
  };
  P._update = () => redraw(excalidrawAPI);
  P._state = () => excalidrawAPI?.getAppState();
  P._elements = () => excalidrawAPI?.getSceneElements();
  P._api = excalidrawAPI;
  P._exec = async (js: string) => {
    const thread = `${new Date().getTime()}`;
    P.latest = {
      id: thread,
      log: "",
    };
    const func = `async function async_exec() {
        ${js}
      }
      async_exec();`;
    // eslint-disable-next-line no-eval
    await eval(func);
    excalidrawAPI?.updateScene({
      elements: _.cloneDeep(excalidrawAPI?.getSceneElements()),
    });
  };
  P._handlePointEvent = handlePointEvent;
  P._listenMouseDownEvent = listenMouseDownEvent;
  P._toast = (msg: string, closable?: boolean) => {
    excalidrawAPI?.setToast({
      message: msg,
      closable: closable === undefined ? false : closable,
    });
  };
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
  P._classes = (): string[] => {
    const all = excalidrawAPI?.getSceneElements() || [];
    return _.uniq(
      all
        .map((e) => e.className)
        .join(" ")
        .split(" "),
    ).filter((c) => !!c);
  };
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

  P._hide = async function (clzs: string[], ms: number) {
    for (const c of clzs) {
      P._$(`.${c}`).forEach((e: any) => (e.opacity = 0));
    }
    P._update();
    if (ms) {
      await P._sleep(ms);
    }
  };

  P._show = async function show(clzs: string[], ms: number) {
    for (const c of clzs) {
      P._$(`.${c}`).forEach((e: any) => (e.opacity = 80));
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

  // start time travel
  P._sleepNoPausing = async (ms: number) => {
    await new Promise((r, j) => {
      P.__data.timer = setTimeout(r, P._time(ms));
    });
  };
  P._sleep = async (ms: number) => {
    await P._sleepNoPausing(ms);
    while (P.__data.pausing) {
      await P._sleepNoPausing(1000);
    }
  };

  P._time = (ms: number): number => {
    return Math.max(P._speed() * ms + P.__data.zero || 0, 0);
  };

  /*
   = 0 means skip immediately
   = 1 (default) means normal
   = 2 means very slow
  */
  P._speed = () => P.__data.speed;
  P._setSpeed = (s: number) => (P.__data.speed = s);
  P._done = () => P._setSpeed(0); // skip all sleep and show now
  P.__data = _.cloneDeep(DefaultState);
  P._pause = () => {
    P.__data.pausing = true;
  };
  P._resume = () => {
    const speed = P.__data.speed;
    P._reset();
    P.__data.speed = speed;
  };
  P._reset = () => {
    // if (P.__data.timer) {
    //   clearTimeout(P.__data.timer);
    // }
    P.__data = _.cloneDeep(DefaultState);
  };
  // end time travel

  return P;
};
