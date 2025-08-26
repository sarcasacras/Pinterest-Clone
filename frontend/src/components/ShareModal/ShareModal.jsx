import { useState } from "react";
import "./ShareModal.css";
import Img from "../Image/Image";

export default function ShareModal({ isOpen, onClose, pinId, pinSlug, profileUsername }) {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!isOpen) return null;

  const shareUrl = profileUsername
    ? `${window.location.origin}/${profileUsername}`
    : pinSlug && pinSlug.startsWith('board/')
    ? `${window.location.origin}/${pinSlug}`
    : pinSlug 
    ? `${window.location.origin}/pin/${pinSlug}` 
    : `${window.location.origin}/pin/${pinId}`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (fallbackErr) {
        console.error('Failed to copy to clipboard', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {profileUsername 
              ? "Share Profile" 
              : pinSlug && pinSlug.startsWith('board/')
              ? "Share Board"
              : "Share Pin"}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <Img src={"/icons/close.svg"} w={80} className={"close-button-image"}/>
          </button>
        </div>

        <div className="modal-content">
          <div className="share-content">
            <div className="share-url-container">
              <label className="share-label">Share this link:</label>
              <div className="url-input-container">
                <input 
                  type="text" 
                  value={shareUrl} 
                  readOnly 
                  className="share-url-input"
                />
                <button 
                  className="copy-btn"
                  onClick={handleCopyToClipboard}
                >
                  Copy
                </button>
              </div>
              <p className={`copy-success-message ${copySuccess ? 'visible' : ''}`}>
                Link copied to clipboard!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}