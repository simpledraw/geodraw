import _, { LoDashStatic } from "lodash";
import { ExcalidrawImperativeAPI } from "../types";
import {
  handlePointEvent,
  listenMouseDownEvent,
  removeAllListeners,
} from "./event";
import { setupDraw, setupEffect, setupExport } from "./draw";
import { setupTime } from "./time";

export interface VersionApi {
  _version: () => string;
}
export interface EffectApi {
  _hide: Function;
  _show: Function;
  _shine: Function;
}
export interface TimeState {
  speed: number;
  pausing: boolean;
  timer: any;
}
export interface TimeApi {
  _sleep: Function;
  _time: Function;
  _sleepNoPausing: Function;
  __timeState: TimeState;
  _speed: Function;
  _setSpeed: Function;
  _done: Function;
  _pause: Function;
  _resume: Function;
  _resetTime: Function;
  _isPausing: () => boolean;
}
export interface ElementApi {
  __: LoDashStatic;
  _$: Function;
  _classes: Function;
}
export interface EventApi {
  _handlePointEvent: Function;
  _listenMouseDownEvent: Function;
  _removeAllListeners: Function;
}
export interface DrawApi {
  _state: Function;
  _elements: Function;
  _resetScene: Function;
  _update: Function;
  _api?: ExcalidrawImperativeAPI | null;
  _toast: Function;
  _zen: Function;
  _geo: Function;
  _prepareGeo: ({ message }: { message?: string }) => Promise<any>;
  _viewOnly: Function;
  _center: Function;
  _lockAll: Function;
}

export interface ImportExportApi {
  _dumpJSON: Function;
  _loadJSON: Function;
  _loadUrlEncodedJSON: Function;
}

export type ProgramableApi = VersionApi &
  ElementApi &
  TimeApi &
  ImportExportApi &
  EffectApi &
  DrawApi &
  EventApi;

export const setupProgrammable = (
  excalidrawAPI?: ExcalidrawImperativeAPI | null,
): ProgramableApi | undefined => {
  if (!excalidrawAPI) {
    return;
  }
  let P: ProgramableApi = {} as any;

  P._version = () => "1.0"; // version api

  // basic element api: selector capibility
  P.__ = _;
  P._$ = excalidrawAPI?.$;
  P._classes = (): string[] => {
    const all = excalidrawAPI?.getSceneElements() || [];
    return _.uniq(
      all
        .map((e) => e.className)
        .join(" ")
        .split(" "),
    ).filter((c) => !!c);
  };

  P = setupDraw(P, excalidrawAPI) as any;
  P = setupExport(P, excalidrawAPI) as any; // import & export
  P = setupTime(P) as any; // time api
  P = setupEffect(P) as any; // effect api

  // event api
  P._handlePointEvent = handlePointEvent;
  P._listenMouseDownEvent = listenMouseDownEvent;
  P._removeAllListeners = removeAllListeners;

  return P;
};
