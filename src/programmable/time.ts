import _ from "lodash";
import { TimeApi, TimeState } from "./globals";

const DefaultState: TimeState = {
  speed: 1.0,
  timer: null,
  pausing: false,
};

export const setupTime = (P: TimeApi): TimeApi => {
  // start time travel
  P._sleepNoPausing = async (ms: number) => {
    await new Promise((r, j) => {
      P.__timeState.timer = setTimeout(r, P._time(ms));
    });
  };

  P._sleep = async (ms: number) => {
    await P._sleepNoPausing(ms);
    while (P.__timeState.pausing) {
      await P._sleepNoPausing(1000);
    }
  };

  P._time = (ms: number): number => {
    return P._speed() * ms;
  };

  /*
   = 0 means skip immediately
   = 1 (default) means normal
   = 2 means very slow
  */
  P._speed = () => P.__timeState.speed;
  P._setSpeed = (s: number) => {
    P.__timeState.speed = s;
    return P;
  };

  P._done = () => {
    P._setSpeed(0); // skip all sleep and show now
    return P;
  };

  P.__timeState = _.cloneDeep(DefaultState);
  P._pause = () => {
    P.__timeState.pausing = true;
    return P;
  };
  P._isPausing = () => {
    return P.__timeState.pausing;
  };
  P._resume = () => {
    const speed = P.__timeState.speed;
    P._resetTime();
    P.__timeState.speed = speed;
    return P;
  };
  P._resetTime = () => {
    P.__timeState = _.cloneDeep(DefaultState);
    return P;
  };
  // end time travel
  return P;
};
