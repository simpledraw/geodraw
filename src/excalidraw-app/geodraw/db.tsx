import React, { useEffect, useState } from "react";
import { DbImperativeAPI, DrawState } from "./types";
import { getDefaultAppState } from "../../appState";

export const DB = ({ onAPIReady }: { onAPIReady: Function }) => {
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

    const cks = [q!, s!, a!];
    setCheckpoints(cks);
    if (onAPIReady) {
      const dbAPI: DbImperativeAPI = {
        getAnswer: () => a,
        getQuestion: () => q,
        getCheckPoints: () => cks,
      };
      onAPIReady(dbAPI);
    }
  }, []);

  return <div />;
};
