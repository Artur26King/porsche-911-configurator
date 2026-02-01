/**
 * Full-screen lightbox for Configurator images: double-click opens; Next/Prev, zoom, close.
 */
import { useState, useEffect } from 'react';
import './ConfiguratorLightbox.css';

const ZOOM_STEPS = [1, 1.25, 1.5, 2, 2.5, 3];
const MIN_ZOOM_INDEX = 0;
const MAX_ZOOM_INDEX = ZOOM_STEPS.length - 1;

export default function ConfiguratorLightbox({ isOpen, onClose, images = [], initialIndex = 0 }) {
  const [index, setIndex] = useState(initialIndex);
  const [zoomIndex, setZoomIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
      setZoomIndex(0);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex((i) => (i + images.length - 1) % images.length);
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, images.length, onClose]);

  if (!isOpen || !images.length) return null;

  const currentImage = images[index];
  const zoom = ZOOM_STEPS[zoomIndex];

  const goPrev = () => setIndex((i) => (i + images.length - 1) % images.length);
  const goNext = () => setIndex((i) => (i + 1) % images.length);
  const zoomIn = () => setZoomIndex((i) => (i >= MAX_ZOOM_INDEX ? i : i + 1));
  const zoomOut = () => setZoomIndex((i) => (i <= MIN_ZOOM_INDEX ? i : i - 1));

  return (
    <div
      className="configurator-lightbox-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
    >
      <button
        type="button"
        className="configurator-lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            className="configurator-lightbox-nav configurator-lightbox-prev"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            className="configurator-lightbox-nav configurator-lightbox-next"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Next image"
          >
            ›
          </button>
        </>
      )}

      <div
        className="configurator-lightbox-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="configurator-lightbox-image-wrap"
          style={{ transform: `scale(${zoom})` }}
        >
          <img
            src={currentImage}
            alt="Configuration preview"
            className="configurator-lightbox-image"
            draggable={false}
          />
        </div>
      </div>

      <div className="configurator-lightbox-zoom" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="configurator-lightbox-zoom-btn"
          onClick={zoomOut}
          disabled={zoomIndex <= MIN_ZOOM_INDEX}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="configurator-lightbox-zoom-label">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          className="configurator-lightbox-zoom-btn"
          onClick={zoomIn}
          disabled={zoomIndex >= MAX_ZOOM_INDEX}
          aria-label="Zoom in"
        >
          +
        </button>
      </div>
    </div>
  );
}
