import React, { useEffect, useState } from "react";
import { getDefaultAppState } from "../../appState";
import { ExcalidrawImperativeAPI } from "../../types";
import { Preview } from "./preview";
import { DbImperativeAPI, DrawState } from "./types";
import "./controlpanel.scss";

export const ControlPanel = ({
  excalidrawAPI,
  dbAPI,
}: {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  dbAPI: DbImperativeAPI | null;
}) => {
  // const [question, setQuestion] = useState<DrawState>();
  // const [suggestion, setSuggestion] = useState<DrawState>();
  // const [answer, setAnswer] = useState<DrawState>();

  const startPlay = (base: number) => {
    if (!excalidrawAPI || !dbAPI) {
      return;
    }
    excalidrawAPI.resetScene();
    const ck = dbAPI.getCheckPoints().find((c: DrawState) => c.base === base);
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
          checkpoints={dbAPI?.getCheckPoints() || []}
          onDelete={(base: number) => handleDeleteCheckpoint(base)}
        >
          <div />
        </Preview>
      </div>
    </div>
  );
};
