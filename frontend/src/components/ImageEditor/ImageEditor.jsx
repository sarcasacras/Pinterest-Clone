import "./ImageEditor.css";
import { createPortal } from "react-dom";
import Img from "../Image/Image";
import { useRef, useEffect } from "react";

export default function ImageEditor({ close, src, onSave }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const maxSize = 600;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      const displayWidth = img.width * scale;
      const displayHeight = img.height * scale;
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
    };
    img.src = src;
  }, [src]);

  const handleApply = () => {
    const canvas = canvasRef.current;
    canvas.toBlob(
      (blob) => {
        const file = new File([blob], "edited-image.jpg", {
          type: "image/jpeg",
        });
        onSave(file);
        close();
      },
      "image/jpeg",
      0.9
    );
  };

  return createPortal(
    <div className="image-editor-container" onClick={close}>
      <div className="image-editor-window" onClick={(e) => e.stopPropagation()}>
        <div className="top">
          <div className="image-area">
            <div className="edit-image-container">
              <canvas className="edited-image" ref={canvasRef}></canvas>
            </div>
          </div>
          <div className="edit-area">
            <p>˚</p>
            <p>˚</p>
            <p>˚</p>
            <p>˚</p>
            <p>˚</p>
            <p>˚</p>
          </div>
        </div>
        <div className="button-group">
          <button className="done-button" onClick={close}>
            Cancel
          </button>
          <button className="done-button" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
