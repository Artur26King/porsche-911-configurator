import './MotivationModal.css';

const MESSAGE = 'You can store only 3 configurations. Delete one to continue.';

export default function LimitModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="modal-quote">{MESSAGE}</p>
        <button type="button" className="modal-close" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
