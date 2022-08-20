import React, { useEffect, useState } from "react";
import { ExcalidrawImperativeAPI } from "../../types";
import { DbImperativeAPI, DrawState } from "./types";
import "./resolver.scss";

export const Resolver = ({
  excalidrawAPI,
  setViewMode,
  dbAPI,
}: {
  excalidrawAPI: ExcalidrawImperativeAPI | null;
  setViewMode: Function;
  dbAPI: DbImperativeAPI | null;
}) => {
  const startAnswer = () => {
    setViewMode(false);
  };
  const showAnswer = () => {
    if (!excalidrawAPI || !dbAPI) {
      return;
    }
    setViewMode(true);
    excalidrawAPI.updateScene(dbAPI?.getAnswer());
  };
  const reset = () => {
    if (!excalidrawAPI || !dbAPI) {
      return;
    }
    excalidrawAPI.updateScene(dbAPI.getQuestion());
  };
  return (
    <div className="resolver-container">
      <button onClick={startAnswer}>START RESOLVE</button>
      <button onClick={reset}>Clean</button>
      <button onClick={showAnswer}>Show Answer</button>
    </div>
  );
};
