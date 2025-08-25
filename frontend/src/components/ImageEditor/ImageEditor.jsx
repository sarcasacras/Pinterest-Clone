import "./ImageEditor.css";
import { createPortal } from "react-dom";
import Img from "../Image/Image";

export default function ImageEditor({ close, src, onSave }) {
  return createPortal(
    <div className="image-editor-container" onClick={close}>
      <div className="image-editor-window" onClick={(e) => e.stopPropagation()}>
        <div className="top">
          <div className="image-area">
            <div className="image-container">
              <Img src={src} className={"edited-image"} />
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
          <button className="done-button" onClick={close}>
            Apply
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
