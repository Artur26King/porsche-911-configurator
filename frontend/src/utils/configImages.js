/**
 * Returns the exterior color preview image URL for a given model and color.
 * Used when saving configuration (preview image = exterior color only).
 */
const CARRERA_COLOR_IMAGES = {
  black: '/images/carreraCon1B.jpg',
  white: '/images/carreraCon1.jpg',
  'gt-silver': '/images/carreraCon1S.jpg',
  'guards-red': '/images/carreraCon1R.jpg',
  'racing-yellow': '/images/carreraCon1Y.jpg',
  'miami-blue': '/images/carreraCon1Bu.jpg',
  'carmine-red': '/images/carreraCon1CR.jpg',
};
const TURBO_COLOR_IMAGES = {
  white: '/images/Turbo/ColorW.jpg',
  black: '/images/Turbo/ColorB.jpg',
  'gt-silver': '/images/Turbo/ColorS.jpg',
  'guards-red': '/images/Turbo/ColorR.jpg',
  'racing-yellow': '/images/Turbo/ColorY.jpg',
  'miami-blue': '/images/Turbo/ColorBu.jpg',
  'carmine-red': '/images/Turbo/ColorCR.jpg',
};
const GT3_COLOR_IMAGES = {
  white: '/images/GT3/W.jpg',
  black: '/images/GT3/B.jpg',
  'gt-silver': '/images/GT3/S.jpg',
  'guards-red': '/images/GT3/R.jpg',
  'racing-yellow': '/images/GT3/Y.jpg',
  'miami-blue': '/images/GT3/Bu.jpg',
};
const GTS_COLOR_IMAGES = {
  black: '/images/GTS/B.jpg',
  white: '/images/GTS/W.jpg',
  'gt-silver': '/images/GTS/S.jpg',
  'guards-red': '/images/GTS/R.jpg',
  'racing-yellow': '/images/GTS/Y.jpg',
  'miami-blue': '/images/GTS/Bu.jpg',
  'carmine-red': '/images/GTS/CR.jpg',
};

export function getPreviewImageForModel(modelId, colorId) {
  const maps = {
    carrera: CARRERA_COLOR_IMAGES,
    'carrera-s': CARRERA_COLOR_IMAGES,
    'carrera-4s': CARRERA_COLOR_IMAGES,
    turbo: TURBO_COLOR_IMAGES,
    gt3: GT3_COLOR_IMAGES,
    gts: GTS_COLOR_IMAGES,
  };
  const map = maps[modelId] ?? CARRERA_COLOR_IMAGES;
  return map[colorId] ?? map.white ?? map.black ?? '/images/carreraCon1.jpg';
}
