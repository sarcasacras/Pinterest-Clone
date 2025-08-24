import "./ImageErrorModal.css";

export default function ImageErrorModal({ isOpen, onClose, onTryAnother }) {
  if (!isOpen) return null;

  return (
    <div className="image-error-overlay" onClick={onClose}>
      <div className="image-error-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Image Processing Error</h2>
        </div>
        
        <div className="modal-content">
          <div className="error-icon">⚠️</div>
          <p className="error-message">
            Sorry, we couldn't process your image... Try to use another one
          </p>
        </div>
        
        <div className="modal-actions">
          <button className="try-another-btn" onClick={onTryAnother}>
            Try Another Image
          </button>
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}