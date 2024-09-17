// handle react native

// return undefined if not in RN web view
export const getReactNativeWebView = () => {
  return (window as any).ReactNativeWebView;
};

export const logToRnAsNeed = (
  msg: string,
  level?: "info" | "error",
  data?: any,
) => {
  if (getReactNativeWebView()) {
    logToRn(level || "info", msg, data);
  } else {
    // eslint-disable-next-line no-console
    console.log(msg);
  }
};

// share with RN apps project
export enum RN_ACTIONS {
  EXPORT = "export",
  OPEN_DEBUG_VIEW = "open-debug-view",
  PRESS_BUTTON = "press-button",
  LOG = "log",
  PONG = "pong",
  CHNAGE_BG_COLOR = "change-bg-color",
  OPEN_PAGE = "open-page",
}

export const exportToPng = async (blob: Blob, name: string) => {
  const toBase64 = async (blob: Blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return await new Promise((r, j) => {
      reader.onloadend = function () {
        const base64data = reader.result;
        r(base64data);
      };
    });
  };
  const contentBase64 = await toBase64(blob);
  getReactNativeWebView().postMessage(
    JSON.stringify({ type: RN_ACTIONS.EXPORT, base64: contentBase64, name }),
  );
};

export const openDebugView = () => {
  getReactNativeWebView().postMessage(
    JSON.stringify({ type: RN_ACTIONS.OPEN_DEBUG_VIEW }),
  );
};
export const pressButton = (name: string, data?: any) => {
  if (getReactNativeWebView()) {
    getReactNativeWebView().postMessage(
      JSON.stringify({ type: RN_ACTIONS.PRESS_BUTTON, name, data }),
    );
  }
};
export const logToRn = (level: any, msg: string, data?: any) => {
  getReactNativeWebView().postMessage(
    JSON.stringify({ type: RN_ACTIONS.LOG, level, msg, data }),
  );
};
// send ping message to RN
export const pongToRn = (data: string) => {
  getReactNativeWebView().postMessage(
    JSON.stringify({ type: RN_ACTIONS.PONG, data }),
  );
};
export const changeCanvasBgColor = (color: string) => {
  getReactNativeWebView().postMessage(
    JSON.stringify({ type: RN_ACTIONS.CHNAGE_BG_COLOR, color }),
  );
};
export const openPage = (location: string) => {
  getReactNativeWebView().postMessage(
    JSON.stringify({ type: RN_ACTIONS.OPEN_PAGE, location }),
  );
};
