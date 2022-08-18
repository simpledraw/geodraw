import { DiffPatcher, create } from "jsondiffpatch";
import { StateModel } from "./types";
import _ from "lodash";

export interface DiffState {
  base?: number;
  readonly elements: any[];
  readonly state?: StateModel;
}

const diffConfig = {
  arrays: {
    detectMove: true,
    includeValueOnMove: true,
  },
  cloneDiffValues: false, // 已经clone了
};

const jsondiff = create(diffConfig);

const patcher = new DiffPatcher(diffConfig);

// return delta
export const jsonDiff = (left: DiffState, right: any): any => {
  return _.cloneDeep(jsondiff.diff(left, right)); // 可能有深度的refer, 所以需要diff
};
export const jsonApplyPatch = (left: DiffState, delta: any): DiffState => {
  return patcher.patch(_.cloneDeep(left), delta);
};

export const applyPatch = jsonApplyPatch; // jsApplyPatch;
export const diff = jsonDiff; // jsDiff;
