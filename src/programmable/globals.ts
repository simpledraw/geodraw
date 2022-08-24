import _ from "lodash";
import { ExcalidrawImperativeAPI } from "../types";
const redraw = (excalidrawAPI?: ExcalidrawImperativeAPI | null) => {
  excalidrawAPI?.updateScene({
    elements: _.cloneDeep(excalidrawAPI?.getSceneElements()),
  });
};
export const setupGlobals = (
  excalidrawAPI?: ExcalidrawImperativeAPI | null,
) => {
  (window as any).__ = _;
  (window as any)._$ = excalidrawAPI?.$;
  (window as any)._print = (log: string) => {
    // eslint-disable-next-line no-console
    console.log(log);
    const lst = (window as any).latest;
    (window as any).latest = {
      ...lst,
      log: `${lst.log}\r\n${log}`,
    };
    const cb = (window as any)._callback;
    if (cb) {
      cb("log", log);
    }
  };
  (window as any)._update = () => redraw(excalidrawAPI);
  (window as any)._sleep = (ms: number) => {
    return new Promise((r, j) => {
      setTimeout(r, ms);
    });
  };
  (window as any)._state = () => excalidrawAPI?.getAppState();
  (window as any)._elements = () => excalidrawAPI?.getSceneElements();
  (window as any)._api = excalidrawAPI;
  (window as any)._exec = async (js: string) => {
    const thread = `${new Date().getTime()}`;
    (window as any).latest = {
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
};
