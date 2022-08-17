import React, { useEffect, useState } from "react";
import { getDefaultAppState } from "../../appState";
import { ExcalidrawImperativeAPI } from "../../types";
import { Preview } from "./preview";
import { DrawState } from "./types";
import "./controlpanel.scss";

export const ControlPanel = ({
  excalidrawAPI,
}: {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
}) => {
  // const [question, setQuestion] = useState<DrawState>();
  // const [suggestion, setSuggestion] = useState<DrawState>();
  // const [answer, setAnswer] = useState<DrawState>();
  const [checkpoints, setCheckpoints] = useState<DrawState[]>([]);

  useEffect(() => {
    let q = require("./p1/question.json");
    q = {
      ...q,
      base: 0,
      appState: { ...getDefaultAppState(), ...q.appState },
    };
    // setQuestion(q);
    let s = require("./p1/suggestion.json");
    s = {
      ...s,
      base: 1,
      appState: { ...getDefaultAppState(), ...s.appState },
    };
    // setSuggestion(s);

    let a = require("./p1/answer.json");
    a = {
      ...a,
      base: 2,
      appState: { ...getDefaultAppState(), ...a.appState },
    };
    // setAnswer(a);

    setCheckpoints([q!, s!, a!]);
  }, []);

  const startPlay = (base: number) => {
    if (!excalidrawAPI) {
      return;
    }
    excalidrawAPI.resetScene();
    const ck = checkpoints.find((c) => c.base === base);
    if (!ck) {
      return;
    }
    excalidrawAPI.updateScene({
      elements: ck.elements,
      appState: { ...getDefaultAppState(), ...ck.appState },
    });
  };

  const handleDeleteCheckpoint = (base: any) => {};
  return (
    <div className="controlpanel">
      <div className="container">
        <h4 className="title">Solution Stream</h4>
        <Preview
          onStartPlay={(base: number) => startPlay(base)}
          checkpoints={checkpoints}
          onDelete={(base: number) => handleDeleteCheckpoint(base)}
        >
          <div />
        </Preview>
      </div>
    </div>
  );
};
