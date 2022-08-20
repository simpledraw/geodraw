import React, { useEffect, useRef, useState } from "react";
import { DrawState } from "./types";
import "./preview.scss";
import { exportToBlob } from "../../packages/utils/index";
import { getDefaultAppState } from "../../appState";

function CheckpointPreviewPlaceholder() {
  return (
    <div className="preview-checkpoint-container">
      <div className="preview-checkpoint-placehoder">
        Record your draw action then will show here
      </div>
    </div>
  );
}
export function CheckpointPreview({
  checkpoint,
  onDoubleClick,
  onDelete,
}: {
  checkpoint: DrawState;
  onDoubleClick: Function;
  onDelete: Function;
}) {
  const canvasParent = useRef<any>(null);
  const [canvasUrl, setCanvasUrl] = useState<string>();
  const [deleting, setDeleting] = useState<boolean>();
  const [hovering, setHovering] = useState<boolean>(false);

  useEffect(() => {
    const build = async () => {
      if (canvasParent && checkpoint) {
        const blob = await exportToBlob({
          mimeType: "image/png",
          elements: checkpoint.elements,
          appState: {
            ...getDefaultAppState(),
            ...checkpoint.appState,
            exportBackground: true,
            exportWithDarkMode: checkpoint.appState.theme === "dark",
          },
          files: [] as any,
        });
        if (blob) {
          setCanvasUrl(URL.createObjectURL(blob));
        }
      }
    };
    build();
  }, [canvasParent, checkpoint]);

  const confirmDelete = () => {
    onDelete && onDelete();
  };

  useEffect(() => {
    if (!hovering) {
      setDeleting(false);
    }
  }, [hovering]);

  const renderHovering = () => {
    if (!hovering) {
      return;
    }
    return (
      <div className="preview-checkpoint-footer">
        {!deleting ? (
          <label className="preview-btn" onClick={() => setDeleting(true)}>
            DELETE
          </label>
        ) : undefined}
        {!deleting ? (
          <label className="preview-btn" onClick={onDoubleClick as any}>
            REPLAY
          </label>
        ) : undefined}
      </div>
    );
  };
  const renderDeleting = () => {
    if (!deleting) {
      return;
    }

    return (
      <div className="preview-checkpoint-footer">
        <label> Confirm to delete this segment</label>
        <div className="preview-deleting-bar">
          <label className="preview-btn" onClick={() => confirmDelete()}>
            OK
          </label>
          <label className="preview-btn" onClick={() => setDeleting(false)}>
            Cancel
          </label>
        </div>
      </div>
    );
  };
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className={`preview-checkpoint-container`}
      ref={canvasParent}
      onDoubleClick={onDoubleClick as any}
    >
      <div
        style={{
          width: "100px",
          height: "100px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={canvasUrl || ""} alt="" style={{ height: "100%" }} />
      </div>
      {renderHovering()}
      {renderDeleting()}
    </div>
  );
}
export function Preview({
  checkpoints,
  onStartPlay,
  onDelete,
  children,
}: {
  children: any;
  checkpoints: DrawState[];
  onStartPlay: Function;
  onDelete: Function;
}) {
  return (
    <div className="preview-container">
      <div className="preview-checkpoints-container">
        {checkpoints.length === 0 && <CheckpointPreviewPlaceholder />}
        {checkpoints.map((checkpoint, idx) => (
          <CheckpointPreview
            onDoubleClick={() => onStartPlay(checkpoint.base)}
            key={idx}
            onDelete={() => onDelete(checkpoint.base)}
            checkpoint={checkpoint}
          />
        ))}
      </div>
      <div className="preview-right">{children}</div>
    </div>
  );
}
