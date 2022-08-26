import { useState } from "react";

export const ScriptZone = () => {
  const [js, setJs] = useState<string>("_print('hello')");
  const [log, setLog] = useState<string>("");

  const exec = () => {
    (window as any).P._exec(js);
    setTimeout(() => {
      setLog((window as any).P.latest?.log);
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
