/**
 * Modal shown when user clicks "Pay" — motivational message, no real payment.
 */
import './MotivationModal.css';

const MESSAGE = 'To get the best, you must go through the worst.';

export default function MotivationModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <p className="modal-quote">{MESSAGE}</p>
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
