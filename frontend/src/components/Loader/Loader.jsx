import "./Loader.css";

export default function Loader({ text = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="loader"></div>
      <p className="loading-text">{text}</p>
    </div>
  );
}