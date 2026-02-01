import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useConfigurator } from '../hooks/useConfigurator';
import { useAuth } from '../context/AuthContext';
import { saveConfig, updateConfig } from '../services/api';
import { getPreviewImageForModel } from '../utils/configImages';
import MotivationModal from '../components/MotivationModal';
import ConfiguratorLightbox from '../components/ConfiguratorLightbox';
import SaveChangesModal from '../components/SaveChangesModal';
import LimitModal from '../components/LimitModal';
import './Configurator.css';

// Carrera image filenames per option (one image per selection)
const CARRERA_COLOR_IMAGES = {
  black: '/images/carreraCon1B.jpg',
  white: '/images/carreraCon1.jpg',
  'gt-silver': '/images/carreraCon1S.jpg',
  'guards-red': '/images/carreraCon1R.jpg',
  'racing-yellow': '/images/carreraCon1Y.jpg',
  'miami-blue': '/images/carreraCon1Bu.jpg',
  'carmine-red': '/images/carreraCon1CR.jpg',
};
// Wheel image per (exterior color + wheel type); only the current combo is shown
const CARRERA_WHEEL_BY_COLOR = {
  white: {
    standard: '/images/carreraCon1WW20SC.jpg', // fallback: 19" not provided, use Sport Classic
    sport: '/images/carreraCon1WW20SC.jpg',
    turbo: '/images/carreraCon1WW20T.jpg',
    'rs-spyder': '/images/carreraCon1WW20RCS.jpg',
  },
  black: {
    standard: '/images/carreraCon1BW19C.jpg',
    sport: '/images/carreraCon1BW20SC.jpg',
    turbo: '/images/carreraCon1BW20T.jpg',
    'rs-spyder': '/images/carreraCon1BW20RCS.jpg',
  },
  'gt-silver': {
    standard: '/images/carreraCon1SW19C.jpg',
    sport: '/images/carreraCon1SW19SC.jpg',
    turbo: '/images/carreraCon1SW20T.jpg',
    'rs-spyder': '/images/carreraCon1SW20RCS.jpg',
  },
  'guards-red': {
    standard: '/images/carreraCon1RW19C.jpg',
    sport: '/images/carreraCon1RW20SC.jpg',
    turbo: '/images/carreraCon1RW20T.jpg',
    'rs-spyder': '/images/carreraCon1RW20RCS.jpg',
  },
  'racing-yellow': {
    standard: '/images/carreraCon1YW19C.jpg',
    sport: '/images/carreraCon1YW20SC.jpg',
    turbo: '/images/carreraCon1YW20T.jpg',
    'rs-spyder': '/images/carreraCon1YW20RCS.jpg',
  },
  'miami-blue': {
    standard: '/images/carreraCon1BuW19C.jpg',
    sport: '/images/carreraCon1BuW20SC.jpg',
    turbo: '/images/carreraCon1BuW20T.jpg',
    'rs-spyder': '/images/carreraCon1BuW20RCS.jpg',
  },
  'carmine-red': {
    standard: '/images/carreraCon1CRW19C.jpg',
    sport: '/images/carreraCon1CRW20SC.jpg',
    turbo: '/images/carreraCon1CRW20T.jpg',
    'rs-spyder': '/images/carreraCon1CRW20RCS.jpg',
  },
};

function getWheelImageForColor(colorId, wheelId) {
  const byColor = CARRERA_WHEEL_BY_COLOR[colorId] ?? CARRERA_WHEEL_BY_COLOR.black;
  const path = byColor[wheelId] ?? byColor.standard;
  return path;
}

// 911 Carrera S only: wheel images from frontend/public/images/carreraS/
const CARRERA_S_WHEEL_BY_COLOR = {
  white: {
    exclusive: '/images/carreraS/WS20E.jpg',
    sport: '/images/carreraS/WS20SC.jpg',
    turbo: '/images/carreraS/WS20T.jpg',
    'rs-spyder': '/images/carreraS/WS20RCS.jpg',
  },
  black: {
    exclusive: '/images/carreraS/BS20E.jpg',
    sport: '/images/carreraS/BS20C.jpg',
    turbo: '/images/carreraS/BS20T.jpg',
    'rs-spyder': '/images/carreraS/BS20RCS.jpg',
  },
  'gt-silver': {
    exclusive: '/images/carreraS/SS20E.jpg',
    sport: '/images/carreraS/SS20C.jpg',
    turbo: '/images/carreraS/SS20T.jpg',
    'rs-spyder': '/images/carreraS/SS20RCS.jpg',
  },
  'guards-red': {
    exclusive: '/images/carreraS/RS20E.jpg',
    sport: '/images/carreraS/RS20C.jpg',
    turbo: '/images/carreraS/RS20T.jpg',
    'rs-spyder': '/images/carreraS/RS20RCS.jpg',
  },
  'racing-yellow': {
    exclusive: '/images/carreraS/YS20E.jpg',
    sport: '/images/carreraS/YS20C.jpg',
    turbo: '/images/carreraS/YS20T.jpg',
    'rs-spyder': '/images/carreraS/YS20RCS.jpg',
  },
  'miami-blue': {
    exclusive: '/images/carreraS/BuS20E.jpg',
    sport: '/images/carreraS/BuS20C.jpg',
    turbo: '/images/carreraS/BuS20T.jpg',
    'rs-spyder': '/images/carreraS/BuS20RCS.jpg',
  },
  'carmine-red': {
    exclusive: '/images/carreraS/CRS20E.jpg',
    sport: '/images/carreraS/CRS20C.jpg',
    turbo: '/images/carreraS/CRS20T.jpg',
    'rs-spyder': '/images/carreraS/CRS20RCS.jpg',
  },
};

function getCarreraSWheelImageForColor(colorId, wheelId) {
  const byColor = CARRERA_S_WHEEL_BY_COLOR[colorId] ?? CARRERA_S_WHEEL_BY_COLOR.black;
  return byColor[wheelId] ?? byColor.exclusive;
}

const CARRERA_INTERIOR_IMAGES = {
  'standard-black': '/images/carreraCon1I.jpg',
  'black-leather': '/images/carreraCon1IFB.jpg',
  'red-leather': '/images/carreraCon1IR.jpg',
  'white-leather': '/images/carreraCon1IW.jpg',
};

// 911 Turbo only: images from frontend/public/images/Turbo/
const TURBO_COLOR_IMAGES = {
  white: '/images/Turbo/ColorW.jpg',
  black: '/images/Turbo/ColorB.jpg',
  'gt-silver': '/images/Turbo/ColorS.jpg',
  'guards-red': '/images/Turbo/ColorR.jpg',
  'racing-yellow': '/images/Turbo/ColorY.jpg',
  'miami-blue': '/images/Turbo/ColorBu.jpg',
  'carmine-red': '/images/Turbo/ColorCR.jpg',
};
const TURBO_INTERIOR_IMAGES = {
  'standard-black': '/images/Turbo/ISB.jpg',
  'black-leather': '/images/Turbo/IFB.jpg',
  'red-leather': '/images/Turbo/IFR.jpg',
  'white-leather': '/images/Turbo/IFW.jpg',
};

// 911 Turbo only: wheel images by exterior color (20" Exclusive, Sport Classic, Turbo) from frontend/public/images/Turbo/
const TURBO_WHEEL_BY_COLOR = {
  black: {
    exclusive: '/images/Turbo/B20E.jpg',
    sport: '/images/Turbo/B20C.jpg',
    turbo: '/images/Turbo/B20T.jpg',
  },
  white: {
    exclusive: '/images/Turbo/W20E.jpg',
    sport: '/images/Turbo/W20C.jpg',
    turbo: '/images/Turbo/W20T.jpg',
  },
  'gt-silver': {
    exclusive: '/images/Turbo/S20E.jpg',
    sport: '/images/Turbo/S20C.jpg',
    turbo: '/images/Turbo/S20T.jpg',
  },
  'guards-red': {
    exclusive: '/images/Turbo/R20E.jpg',
    sport: '/images/Turbo/R20C.jpg',
    turbo: '/images/Turbo/R20T.jpg',
  },
  'racing-yellow': {
    exclusive: '/images/Turbo/Y20E.jpg',
    sport: '/images/Turbo/Y20C.jpg',
    turbo: '/images/Turbo/Y20T.jpg',
  },
  'miami-blue': {
    exclusive: '/images/Turbo/Bu20E.jpg',
    sport: '/images/Turbo/Bu20C.jpg',
    turbo: '/images/Turbo/Bu20T.jpg',
  },
  'carmine-red': {
    exclusive: '/images/Turbo/CR20E.jpg',
    sport: '/images/Turbo/CR20C.jpg',
    turbo: '/images/Turbo/CR20T.jpg',
  },
};

function getTurboWheelImageForColor(colorId, wheelId) {
  const byColor = TURBO_WHEEL_BY_COLOR[colorId] ?? TURBO_WHEEL_BY_COLOR.black;
  return byColor[wheelId] ?? byColor.exclusive;
}

// 911 GT3 only: images from frontend/public/images/GT3/
const GT3_COLOR_IMAGES = {
  white: '/images/GT3/W.jpg',
  black: '/images/GT3/B.jpg',
  'gt-silver': '/images/GT3/S.jpg',
  'guards-red': '/images/GT3/R.jpg',
  'racing-yellow': '/images/GT3/Y.jpg',
  'miami-blue': '/images/GT3/Bu.jpg',
};
const GT3_INTERIOR_IMAGES = {
  'standard-black': '/images/GT3/IB.jpg',
  'black-leather': '/images/GT3/IFB.jpg',
  'red-leather': '/images/GT3/IR.jpg',
  'white-leather': '/images/GT3/IW.jpg',
};
const GT3_WHEEL_BY_COLOR = {
  white: {
    sport: '/images/GT3/W20C.jpg',
    'forged-mag': '/images/GT3/W20M.jpg',
  },
  black: {
    sport: '/images/GT3/B20C.jpg',
    'forged-mag': '/images/GT3/B20M.jpg',
  },
  'gt-silver': {
    sport: '/images/GT3/S20C.jpg',
    'forged-mag': '/images/GT3/S20M.jpg',
  },
  'guards-red': {
    sport: '/images/GT3/R20C.jpg',
    'forged-mag': '/images/GT3/R20M.jpg',
  },
  'racing-yellow': {
    sport: '/images/GT3/Y20C.jpg',
    'forged-mag': '/images/GT3/Y20M.jpg',
  },
  'miami-blue': {
    sport: '/images/GT3/Bu20C.jpg',
    'forged-mag': '/images/GT3/Bu20C.jpg',
  },
};

function getGT3WheelImageForColor(colorId, wheelId) {
  const byColor = GT3_WHEEL_BY_COLOR[colorId] ?? GT3_WHEEL_BY_COLOR.black;
  return byColor[wheelId] ?? byColor.sport;
}

// 911 GTS only: images from frontend/public/images/GTS/
const GTS_COLOR_IMAGES = {
  black: '/images/GTS/B.jpg',
  white: '/images/GTS/W.jpg',
  'gt-silver': '/images/GTS/S.jpg',
  'guards-red': '/images/GTS/R.jpg',
  'racing-yellow': '/images/GTS/Y.jpg',
  'miami-blue': '/images/GTS/Bu.jpg',
  'carmine-red': '/images/GTS/CR.jpg',
};
const GTS_INTERIOR_IMAGES = {
  'standard-black': '/images/GTS/IB.jpg',
  'red-leather': '/images/GTS/IR.jpg',
  'white-leather': '/images/GTS/IW.jpg',
};
const GTS_WHEEL_BY_COLOR = {
  white: {
    sport: '/images/GTS/W20C.jpg',
    exclusive: '/images/GTS/W20E.jpg',
    'rs-spyder': '/images/GTS/W20RCS.jpg',
  },
  black: {
    sport: '/images/GTS/B20C.jpg',
    exclusive: '/images/GTS/B20E.jpg',
    'rs-spyder': '/images/GTS/B20RCS.jpg',
  },
  'gt-silver': {
    sport: '/images/GTS/S20C.jpg',
    exclusive: '/images/GTS/S20E.jpg',
    'rs-spyder': '/images/GTS/S20RCS.jpg',
  },
  'guards-red': {
    sport: '/images/GTS/R20C.jpg',
    exclusive: '/images/GTS/R20E.jpg',
    'rs-spyder': '/images/GTS/R20RCS.jpg',
  },
  'racing-yellow': {
    sport: '/images/GTS/W20C.jpg',
    exclusive: '/images/GTS/W20E.jpg',
    'rs-spyder': '/images/GTS/W20RCS.jpg',
  },
  'miami-blue': {
    sport: '/images/GTS/Y20C.jpg',
    exclusive: '/images/GTS/Y20E.jpg',
    'rs-spyder': '/images/GTS/Y20RCS.jpg',
  },
  'carmine-red': {
    sport: '/images/GTS/CR20C.jpg',
    exclusive: '/images/GTS/CR20E.jpg',
    'rs-spyder': '/images/GTS/CR20RCS.jpg',
  },
};

function getGTSWheelImageForColor(colorId, wheelId) {
  const byColor = GTS_WHEEL_BY_COLOR[colorId] ?? GTS_WHEEL_BY_COLOR.black;
  return byColor[wheelId] ?? byColor.exclusive;
}

export default function Configurator() {
  const { user } = useAuth();
  const location = useLocation();
  const editConfig = location.state?.editConfig;
  const {
    modelId,
    setModelId,
    colorId,
    setColorId,
    wheelId,
    setWheelId,
    interiorId,
    setInteriorId,
    total,
    configurationData,
    options,
  } = useConfigurator(editConfig);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [saveChangesModalOpen, setSaveChangesModalOpen] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(() => !location.state?.modelId && !editConfig);
  const [carreraImageIndex, setCarreraImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const initialEditState = useRef(editConfig ? { modelId: editConfig.modelId, colorId: editConfig.colorId, wheelId: editConfig.wheelId, interiorId: editConfig.interiorId } : null);

  // Same image logic for 911 Carrera, 911 Carrera S, and 911 Carrera 4S (asset reuse)
  const usesCarreraImages = modelId === 'carrera' || modelId === 'carrera-s' || modelId === 'carrera-4s';

  // Models that show the configurator image block (Carrera family + Turbo + GT3 + GTS)
  const hasConfigImages = usesCarreraImages || modelId === 'turbo' || modelId === 'gt3' || modelId === 'gts';

  // Carrera S and Carrera 4S: Exclusive instead of standard; Turbo: Exclusive, Sport Classic, Turbo; GT3: Sport Classic, Forged Magnesium only; GTS: Sport Classic, Exclusive, RS Spyder only
  const usesCarreraSWheels = modelId === 'carrera-s' || modelId === 'carrera-4s';
  const usesTurboWheels = modelId === 'turbo';
  const usesGT3Wheels = modelId === 'gt3';
  const usesGTSWheels = modelId === 'gts';
  const wheelOptions = usesGT3Wheels
    ? options.wheels.filter((w) => ['sport', 'forged-mag'].includes(w.id))
    : usesGTSWheels
      ? options.wheels.filter((w) => ['sport', 'exclusive', 'rs-spyder'].includes(w.id))
      : usesTurboWheels
        ? options.wheels.filter((w) => ['exclusive', 'sport', 'turbo'].includes(w.id))
        : usesCarreraSWheels
          ? options.wheels.filter((w) => w.id !== 'standard' && w.id !== 'forged-mag')
          : options.wheels.filter((w) => w.id !== 'exclusive' && w.id !== 'forged-mag');

  // GT3: no Carmine Red
  const colorOptions = modelId === 'gt3'
    ? options.colors.filter((c) => c.id !== 'carmine-red')
    : options.colors;

  // GTS: no Full Leather Black
  const interiorOptions = modelId === 'gts'
    ? options.interiors.filter((i) => i.id !== 'black-leather')
    : options.interiors;

  // Keep wheel selection valid when switching models (Forged Magnesium only on GT3)
  useEffect(() => {
    if (usesCarreraSWheels && wheelId === 'standard') setWheelId('exclusive');
    if (usesTurboWheels && ['standard', 'rs-spyder', 'forged-mag'].includes(wheelId)) setWheelId('exclusive');
    if (usesGT3Wheels && !['sport', 'forged-mag'].includes(wheelId)) setWheelId('sport');
    if (usesGTSWheels && ['standard', 'turbo', 'forged-mag'].includes(wheelId)) setWheelId('exclusive');
    if (!usesCarreraSWheels && !usesTurboWheels && !usesGTSWheels && wheelId === 'exclusive') setWheelId('standard');
    if (!usesGT3Wheels && wheelId === 'forged-mag') {
      setWheelId(usesGTSWheels || usesCarreraSWheels || usesTurboWheels ? 'exclusive' : 'standard');
    }
  }, [modelId, wheelId, setWheelId]);

  // Keep color selection valid when switching models (GT3 has no Carmine Red)
  useEffect(() => {
    if (modelId === 'gt3' && colorId === 'carmine-red') setColorId('white');
  }, [modelId, colorId, setColorId]);

  // Keep interior selection valid when switching models (GTS has no Full Leather Black)
  useEffect(() => {
    if (modelId === 'gts' && interiorId === 'black-leather') setInteriorId('standard-black');
  }, [modelId, interiorId, setInteriorId]);

  // Three images: current color, current (color+wheel) combo, current interior (only these three are shown)
  const currentConfigImages = useMemo(() => {
    if (modelId === 'gt3') {
      const colorImg = GT3_COLOR_IMAGES[colorId] ?? GT3_COLOR_IMAGES.white;
      const wheelImg = getGT3WheelImageForColor(colorId, wheelId);
      const interiorImg = GT3_INTERIOR_IMAGES[interiorId] ?? GT3_INTERIOR_IMAGES['standard-black'];
      return [colorImg, wheelImg, interiorImg];
    }
    if (modelId === 'gts') {
      const colorImg = GTS_COLOR_IMAGES[colorId] ?? GTS_COLOR_IMAGES.white;
      const wheelImg = getGTSWheelImageForColor(colorId, wheelId);
      const interiorImg = GTS_INTERIOR_IMAGES[interiorId] ?? GTS_INTERIOR_IMAGES['standard-black'];
      return [colorImg, wheelImg, interiorImg];
    }
    if (modelId === 'turbo') {
      const colorImg = TURBO_COLOR_IMAGES[colorId] ?? TURBO_COLOR_IMAGES.white;
      const wheelImg = getTurboWheelImageForColor(colorId, wheelId);
      const interiorImg = TURBO_INTERIOR_IMAGES[interiorId] ?? TURBO_INTERIOR_IMAGES['standard-black'];
      return [colorImg, wheelImg, interiorImg];
    }
    if (!usesCarreraImages) return [];
    const colorImg = CARRERA_COLOR_IMAGES[colorId] ?? CARRERA_COLOR_IMAGES.white;
    const wheelImg =
      usesCarreraSWheels
        ? getCarreraSWheelImageForColor(colorId, wheelId)
        : getWheelImageForColor(colorId, wheelId);
    const interiorImg = CARRERA_INTERIOR_IMAGES[interiorId] ?? CARRERA_INTERIOR_IMAGES['standard-black'];
    return [colorImg, wheelImg, interiorImg];
  }, [modelId, usesCarreraImages, usesCarreraSWheels, colorId, wheelId, interiorId]);

  // Keep index in range when the three-image set is in use
  const displayIndex = currentConfigImages.length > 0
    ? Math.min(carreraImageIndex, currentConfigImages.length - 1)
    : 0;

  // Pre-select model when navigated with state (e.g. double-click from main page or edit config); then hide dropdown
  useEffect(() => {
    const fromState = location.state?.modelId;
    if (fromState && options.models.some((m) => m.id === fromState)) {
      setModelId(fromState);
      setShowModelDropdown(false);
    }
    if (editConfig) setShowModelDropdown(false);
  }, [location.state?.modelId, editConfig, options.models, setModelId]);

  const handleCarreraPreviewDoubleClick = () => {
    if (hasConfigImages) setLightboxOpen(true);
  };

  const handleCarreraPrev = (e) => {
    e.stopPropagation();
    setCarreraImageIndex((i) => (i + currentConfigImages.length - 1) % currentConfigImages.length);
  };

  const handleCarreraNext = (e) => {
    e.stopPropagation();
    setCarreraImageIndex((i) => (i + 1) % currentConfigImages.length);
  };

  const handleColorChange = (e) => {
    const value = e.target.value;
    setColorId(value);
    if (hasConfigImages) setCarreraImageIndex(0);
  };

  const handleWheelChange = (e) => {
    const value = e.target.value;
    setWheelId(value);
    if (hasConfigImages) setCarreraImageIndex(1);
  };

  const handleInteriorChange = (e) => {
    const value = e.target.value;
    setInteriorId(value);
    if (hasConfigImages) setCarreraImageIndex(2);
  };

  const handlePay = () => {
    setModalOpen(true);
  };

  const hasEditChanges = initialEditState.current && (
    modelId !== initialEditState.current.modelId ||
    colorId !== initialEditState.current.colorId ||
    wheelId !== initialEditState.current.wheelId ||
    interiorId !== initialEditState.current.interiorId
  );

  const buildConfigPayload = () => ({
    modelId,
    modelName: configurationData.modelName,
    exteriorColor: configurationData.colorName,
    wheels: configurationData.wheelName,
    interior: configurationData.interiorName,
    totalPrice: total,
    previewImage: getPreviewImageForModel(modelId, colorId),
    configurationData: {
      modelId,
      colorId,
      wheelId,
      interiorId,
      modelName: configurationData.modelName,
      colorName: configurationData.colorName,
      wheelName: configurationData.wheelName,
      interiorName: configurationData.interiorName,
    },
  });

  const performSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveMessage('');
    try {
      await saveConfig(buildConfigPayload());
      setSaveMessage('Configuration saved.');
    } catch (err) {
      if (err.message?.includes('3 configurations')) {
        setLimitModalOpen(true);
      } else {
        setSaveMessage(err.message || 'Failed to save.');
      }
    } finally {
      setSaving(false);
    }
  };

  const performUpdate = async () => {
    if (!user || !editConfig?.id) return;
    setSaving(true);
    setSaveMessage('');
    try {
      await updateConfig(editConfig.id, buildConfigPayload());
      setSaveMessage('Configuration updated.');
      initialEditState.current = { modelId, colorId, wheelId, interiorId };
    } catch (err) {
      setSaveMessage(err.message || 'Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    if (editConfig?.id && hasEditChanges) {
      setSaveChangesModalOpen(true);
      return;
    }
    if (editConfig?.id && !hasEditChanges) {
      setSaveMessage('No changes to save.');
      return;
    }
    await performSave();
  };

  const handleSaveChangesYes = async () => {
    setSaveChangesModalOpen(false);
    await performUpdate();
  };

  const handleSaveChangesNo = () => {
    setSaveChangesModalOpen(false);
  };

  return (
    <div className="configurator-page">
      <section className="section">
        <div className="container">
          <div className="configurator-layout">
            <h1 className="page-title">Configure your 911</h1>
            <p className="page-intro">Build the car you&apos;ll earn.</p>
            <div className="config-options">
              <div className="config-group">
                {showModelDropdown ? (
                  <>
                    <label className="config-label">Model</label>
                    <select
                      value={modelId}
                      onChange={(e) => {
                        setModelId(e.target.value);
                        setShowModelDropdown(false);
                      }}
                      className="config-select"
                    >
                      {options.models.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} — ${m.basePrice.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </>
                ) : (
                  <h2 className="config-model-title">{configurationData.modelName}</h2>
                )}
              </div>
              <div className="config-group">
                <label className="config-label">Exterior color</label>
                <select
                  value={colorId}
                  onChange={handleColorChange}
                  className="config-select"
                >
                  {colorOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.price ? `+$${c.price.toLocaleString()}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="config-group">
                <label className="config-label">Wheels</label>
                <select
                  value={wheelId}
                  onChange={handleWheelChange}
                  className="config-select"
                >
                  {wheelOptions.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} {w.price ? `+$${w.price.toLocaleString()}` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div className="config-group">
                <label className="config-label">Interior</label>
                <select
                  value={interiorId}
                  onChange={handleInteriorChange}
                  className="config-select"
                >
                  {interiorOptions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.name} {i.price ? `+$${i.price.toLocaleString()}` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div
              className={`config-preview${hasConfigImages ? ' config-preview--clickable' : ''}`}
              aria-label="Car image preview"
              onDoubleClick={hasConfigImages ? handleCarreraPreviewDoubleClick : undefined}
              role={hasConfigImages ? 'button' : undefined}
              tabIndex={hasConfigImages ? 0 : undefined}
            >
              {hasConfigImages && currentConfigImages.length > 0 && (
                <>
                  <img
                    src={currentConfigImages[displayIndex]}
                    alt="911 Carrera configuration"
                  />
                  <button
                    type="button"
                    className="config-preview-nav config-preview-prev"
                    onClick={handleCarreraPrev}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="config-preview-nav config-preview-next"
                    onClick={handleCarreraNext}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="config-summary">
            <div className="summary-box">
              <p className="summary-label">Total</p>
              <p className="summary-price">${total.toLocaleString()}</p>
              <button type="button" className="btn-pay" onClick={handlePay}>
                Pay
              </button>
              {user && (
                <button
                  type="button"
                  className="btn-save"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save configuration'}
                </button>
              )}
              {saveMessage && <p className="save-message">{saveMessage}</p>}
            </div>
          </div>
        </div>
      </section>
      <MotivationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <LimitModal open={limitModalOpen} onClose={() => setLimitModalOpen(false)} />
      <SaveChangesModal
        open={saveChangesModalOpen}
        onYes={handleSaveChangesYes}
        onNo={handleSaveChangesNo}
      />
      <ConfiguratorLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={hasConfigImages ? currentConfigImages : []}
        initialIndex={displayIndex}
      />
    </div>
  );
}
