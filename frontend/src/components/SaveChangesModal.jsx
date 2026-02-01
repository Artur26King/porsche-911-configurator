import './MotivationModal.css';

export default function SaveChangesModal({ open, onYes, onNo }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onNo} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="modal-quote">Do you want to save changes?</p>
        <div className="modal-actions">
          <button type="button" className="modal-btn modal-btn-yes" onClick={onYes}>
            YES
          </button>
          <button type="button" className="modal-btn modal-btn-no" onClick={onNo}>
            NO
          </button>
        </div>
      </div>
    </div>
  );
}
