import { useState, useMemo } from 'react';
import {
  porscheModels,
  colors,
  wheels,
  interiors,
  getModelById,
  getColorById,
  getWheelById,
  getInteriorById,
  computeTotal,
} from '../data/models';

const defaultModel = porscheModels[0]?.id ?? 'carrera';
const defaultColor = defaultModel === 'carrera' ? 'white' : (colors[0]?.id ?? 'black');
const defaultWheel = wheels[0]?.id ?? 'standard';
const defaultInterior = interiors[0]?.id ?? 'standard-black';

/**
 * Configurator state and computed total. Use in Configurator page.
 * @param {object} [initialConfig] - Optional saved config to load: { modelId, colorId, wheelId, interiorId }
 */
export function useConfigurator(initialConfig) {
  const [modelId, setModelId] = useState(initialConfig?.modelId ?? defaultModel);
  const [colorId, setColorId] = useState(initialConfig?.colorId ?? defaultColor);
  const [wheelId, setWheelId] = useState(initialConfig?.wheelId ?? defaultWheel);
  const [interiorId, setInteriorId] = useState(initialConfig?.interiorId ?? defaultInterior);

  const total = useMemo(
    () => computeTotal(modelId, colorId, wheelId, interiorId),
    [modelId, colorId, wheelId, interiorId]
  );

  const configurationData = useMemo(
    () => ({
      modelId,
      colorId,
      wheelId,
      interiorId,
      modelName: getModelById(modelId).name,
      colorName: getColorById(colorId).name,
      wheelName: getWheelById(wheelId).name,
      interiorName: getInteriorById(interiorId).name,
    }),
    [modelId, colorId, wheelId, interiorId]
  );

  return {
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
    options: { models: porscheModels, colors, wheels, interiors },
  };
}
