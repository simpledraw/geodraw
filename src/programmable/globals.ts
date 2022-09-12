import _ from "lodash";
import { ExcalidrawImperativeAPI } from "../types";
import { handlePointEvent, listenMouseDownEvent } from "./event";
import { actionToggleZenMode } from "../actions";
import { actionToggleGeoMode } from "./geomode";
import { actionToggleViewMode } from "../actions/actionToggleViewMode";

const redraw = (excalidrawAPI?: ExcalidrawImperativeAPI | null) => {
  excalidrawAPI?.updateScene({
    elements: _.cloneDeep(excalidrawAPI?.getSceneElements()),
  });
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
    const lst = P.latest;
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
  P._sleep = (ms: number) => {
    return new Promise((r, j) => {
      setTimeout(r, ms);
    });
  };
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
  P._zen = () => (window as any).executeAction(actionToggleZenMode);
  P._geo = () => (window as any).executeAction(actionToggleGeoMode);
  P._viewOnly = () => (window as any).executeAction(actionToggleViewMode);

  return P;
};
