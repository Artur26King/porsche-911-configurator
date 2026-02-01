/**
 * Porsche 911 models — stored in code for configurator and models page.
 * Expand with more variants and image paths as needed.
 */
export const porscheModels = [
  {
    id: 'carrera',
    name: '911 Carrera',
    tagline: 'The essence of the sports car.',
    description: 'The 911 Carrera is where the legend begins. Its philosophy is purity: a rear engine, a flat six, and nothing between you and the road. This is the 911 that proves you don’t need excess to feel alive—every drive is balanced, responsive, and deeply satisfying. It’s the soul of the range: approachable yet unmistakably Porsche, built for those who believe the journey matters as much as the destination.',
    engine: '3.0L',
    acceleration: '4.2',
    horsepower: 385,
    basePrice: 114400,
    image: '/images/picture3.avif',
  },
  {
    id: 'carrera-s',
    name: '911 Carrera S',
    tagline: 'More power. More presence.',
    description: 'The Carrera S answers a different question: what if the base 911 had more fire in its heart? Same character, sharper reflexes and a voice that pushes you to lean in. It’s for the driver who wants that extra edge—more power under the foot, quicker responses, and a presence that turns every stretch of tarmac into a stage. The Carrera S doesn’t shout; it simply delivers, with a driving feel that rewards commitment and never feels anonymous.',
    engine: '3.0L',
    acceleration: '3.7',
    horsepower: 450,
    basePrice: 128300,
    image: '/images/carreraS.avif',
  },
  {
    id: 'carrera-4s',
    name: '911 Carrera 4S',
    tagline: 'All-wheel drive. All the thrill.',
    description: 'The Carrera 4S is the 911 that refuses to choose between grip and soul. All-wheel drive adds confidence in every condition, but the rear-engine character remains front and centre—you still feel the weight behind you, the pivot, the playfulness. Rain or shine, it’s the 911 for those who want maximum traction without losing the classic 911 dialogue between car and driver. Purpose-built for the ambitious: go further, stay in control, never compromise on feel.',
    engine: '3.0L',
    acceleration: '3.6',
    horsepower: 450,
    basePrice: 136100,
    image: '/images/carrera4S.avif',
  },
  {
    id: 'turbo',
    name: '911 Turbo',
    tagline: 'Maximum performance. Zero compromise.',
    description: 'The Turbo is the 911 that rewrites the rules. Twin-turbo power and all-wheel drive create a machine that can devour distance or explode out of a corner with barely a whisper of drama—yet the moment you push, the personality is unmistakable. It’s the 911 for those who demand the pinnacle: devastating acceleration, unshakeable stability, and a kind of confidence that makes the impossible feel routine. Not the loudest 911, but the one that makes you believe anything is possible.',
    engine: '3.8L',
    acceleration: '2.8',
    horsepower: 580,
    basePrice: 173800,
    image: '/images/carreraT.avif',
  },
  {
    id: 'gt3',
    name: '911 GT3',
    tagline: 'Born on the track.',
    description: 'The GT3 is the 911 with racing in its DNA. Naturally aspirated, high-revving, and built for those who live for the red line and the next apex. There’s no turbo to soften the edges—just raw response, a spine-tingling exhaust note, and a driving experience that feels like the track came to the road. Its purpose is clear: maximum connection, maximum feedback, maximum emotion. For the purist who believes that the best 911 is the one that never stops talking to you.',
    engine: '4.0L',
    acceleration: '3.4',
    horsepower: 502,
    basePrice: 161100,
    image: '/images/GT3.avif',
  },
  {
    id: 'gts',
    name: '911 GTS',
    tagline: 'The perfect balance of performance and luxury.',
    description: 'The GTS is the 911 that refuses to compromise. It sits between the Carrera and the GT models—more focused than the former, more usable than the latter. Its philosophy is balance: enough power and response to thrill on a back road or a track day, enough refinement to make every journey a pleasure. The GTS has its own soul: assertive, precise, and endlessly engaging. For those who want one car that does it all, with character to spare.',
    engine: '3.0L',
    acceleration: '3.5',
    horsepower: 480,
    basePrice: 142400,
    image: '/images/GTS.avif',
  },
];

export const colors = [
  { id: 'black', name: 'Black', price: 0 },
  { id: 'white', name: 'White', price: 0 },
  { id: 'gt-silver', name: 'GT Silver', price: 3500 },
  { id: 'guards-red', name: 'Guards Red', price: 3100 },
  { id: 'racing-yellow', name: 'Racing Yellow', price: 3100 },
  { id: 'miami-blue', name: 'Miami Blue', price: 3100 },
  { id: 'carmine-red', name: 'Carmine Red', price: 3100 },
];

export const wheels = [
  { id: 'standard', name: '19" Carrera', price: 0 },
  { id: 'exclusive', name: '20" Exclusive', price: 6920 },
  { id: 'sport', name: '20" Sport Classic', price: 2100 },
  { id: 'turbo', name: '20" Turbo', price: 2400 },
  { id: 'rs-spyder', name: '20" RS Spyder', price: 3650 },
  { id: 'forged-mag', name: '20" Forged Magnesium', price: 4500 },
];

export const interiors = [
  { id: 'standard-black', name: 'Standard Black', price: 0 },
  { id: 'black-leather', name: 'Full Leather Black', price: 5200 },
  { id: 'red-leather', name: 'Full Leather Carmine Red', price: 6200 },
  { id: 'white-leather', name: 'Full Leather White', price: 2100 },
];

export function getModelById(id) {
  return porscheModels.find((m) => m.id === id) ?? porscheModels[0];
}

export function getColorById(id) {
  return colors.find((c) => c.id === id) ?? colors[0];
}

export function getWheelById(id) {
  return wheels.find((w) => w.id === id) ?? wheels[0];
}

export function getInteriorById(id) {
  return interiors.find((i) => i.id === id) ?? interiors[0];
}

export function computeTotal(modelId, colorId, wheelId, interiorId) {
  const model = getModelById(modelId);
  const color = getColorById(colorId);
  const wheel = getWheelById(wheelId);
  const interior = getInteriorById(interiorId);
  if (modelId === 'gt3') {
    return model.basePrice + color.price * 2 + wheel.price * 2 + interior.price * 3;
  }
  return model.basePrice + color.price + wheel.price + interior.price;
}
