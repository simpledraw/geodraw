import { useState } from "react";

export const ScriptZone = () => {
  const [js, setJs] = useState<string>("_print('hello')");
  const [log, setLog] = useState<string>("");

  // (window as any)._callback = (event: "log", msg: string) => {
  //   setLog((window as any).latest?.log);
  // };

  const exec = () => {
    (window as any)._exec(js);
    setTimeout(() => {
      setLog((window as any).latest?.log);
    }, 1000);
  };

  return (
    <div
      style={{
        width: "20%",
        fontSize: "0.7em",
        textAlign: "left",
      }}
    >
      <h4>script</h4>
      <textarea
        value={js}
        onChange={({ target: { value } }) => setJs(value)}
      ></textarea>
      <button onClick={exec}>exec</button>
      <hr></hr>
      <span>{log}</span>
    </div>
  );
};
