import { register } from "../actions/register";
import { CODES, KEYS } from "../keys";

export const parseBooleanFromUrl = (key: string): boolean | undefined => {
  const val =
    new URLSearchParams((window.location.hash || "#").slice(1)).get(key) ||
    new URLSearchParams(window.location.search).get(key);

  return val ? ["1", "true"].includes(val) || parseInt(val) >= 0 : undefined;
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
