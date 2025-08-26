import "./CustomAlert.css";
import { createPortal } from "react-dom";

export default function CustomAlert({ title, message, onConfirm, onCancel }) {
  return createPortal(
    <div className="alert-overlay" onClick={onCancel}>
      <div className="alert-window" onClick={(e) => e.stopPropagation()}>
        <h1 className="alert-title">{title}</h1>
        <p className="alert-message">{message}</p>
        <div className="alert-buttons">
          <button className="cancel-button" onClick={onCancel}>Cancel</button>
          <button className="confirm-button" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>,
    document.body
  );
}