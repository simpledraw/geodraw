import { ExcalidrawElement } from "../../element/types";
import { AppState } from "../../types";

// app state缩略版
export interface StateModel {
  bgColor?: string;
  theme?: string;
  zoom?: number;
}
export interface Patch {
  base: number; // base timestamp
  ts: number;
  version: number;
  delta: any; // Delta
}
export interface DrawState {
  version: number;
  base: number;
  elements: ExcalidrawElement[];
  appState: AppState;
}
