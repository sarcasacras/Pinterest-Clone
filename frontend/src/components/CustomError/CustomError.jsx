import "./CustomError.css";
import { createPortal } from "react-dom";
import Img from "../Image/Image";

export default function CustomError({ message, close }) {
  return createPortal(
    <div className="error-overlay" onClick={close}>
      <div className="error-window" onClick={(e) => e.stopPropagation()}>
        <Img src={"/icons/alert.svg"} className={'alert-image'}/>
        <h1 className="error-title">Error!</h1>
        <p className="error-message">{message}</p>
        <button className="ok-button" onClick={close}>Ok</button>
      </div>
    </div>,
    document.body
  );
}
