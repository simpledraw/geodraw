import { register } from "../actions/register";
import { CODES, KEYS } from "../keys";

export const parseBooleanFromUrl = (key?: string): boolean | undefined => {
  const geomode =
    // current
    new URLSearchParams(window.location.hash.slice(1)).get(key || "geomode") ||
    // legacy, kept for compat reasons
    new URLSearchParams(window.location.search).get(key || "geomode");

  return geomode ? ["1", "true"].includes(geomode) : undefined;
};

export const actionToggleGeoMode = register({
  name: "geoMode",
  trackEvent: {
    category: "canvas",
    predicate: (appState) => !appState.geoModeEnabled,
  },
  perform(elements, appState) {
    return {
      appState: {
        ...appState,
        geoModeEnabled: !this.checked!(appState),
      },
      commitToHistory: false,
    };
  },
  checked: (appState) => appState.geoModeEnabled,
  contextItemLabel: "buttons.geoMode",
  keyTest: (event) =>
    !event[KEYS.CTRL_OR_CMD] && event.altKey && event.code === CODES.Z,
});
