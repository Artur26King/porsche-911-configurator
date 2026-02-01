import SavedConfiguration from '../models/SavedConfiguration.js';

const MAX_CONFIGS_PER_USER = 3;

export async function saveConfig(req, res) {
  try {
    const {
      modelId,
      modelName,
      exteriorColor,
      wheels,
      interior,
      totalPrice,
      previewImage,
      configurationData,
    } = req.body;

    if (!modelId || !modelName || !exteriorColor || !wheels || !interior || typeof totalPrice !== 'number' || !previewImage) {
      return res.status(400).json({
        error: 'modelId, modelName, exteriorColor, wheels, interior, totalPrice, and previewImage are required',
      });
    }

    const count = await SavedConfiguration.countDocuments({ userId: req.user._id });
    if (count >= MAX_CONFIGS_PER_USER) {
      return res.status(400).json({
        error: 'You can store only 3 configurations. Delete one to continue.',
      });
    }

    const doc = await SavedConfiguration.create({
      userId: req.user._id,
      modelId,
      modelName,
      exteriorColor,
      wheels,
      interior,
      totalPrice,
      previewImage,
      configurationData: configurationData || {},
    });

    res.status(201).json({
      id: doc._id,
      modelName: doc.modelName,
      exteriorColor: doc.exteriorColor,
      wheels: doc.wheels,
      interior: doc.interior,
      totalPrice: doc.totalPrice,
      previewImage: doc.previewImage,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error('Save config error:', err);
    res.status(500).json({ error: 'Failed to save configuration' });
  }
}

export async function getUserConfigs(req, res) {
  try {
    const list = await SavedConfiguration.find({ userId: req.user._id })
      .sort({ createdAt: 1 })
      .lean();

    res.json(list.map(({ _id, modelName, totalPrice, previewImage, createdAt, modelId, exteriorColor, wheels, interior, configurationData }) => ({
      id: _id.toString(),
      modelId,
      modelName,
      exteriorColor,
      wheels,
      interior,
      totalPrice,
      previewImage,
      createdAt,
      configurationData,
    })));
  } catch (err) {
    console.error('Get user configs error:', err);
    res.status(500).json({ error: 'Failed to load configurations' });
  }
}

export async function updateConfig(req, res) {
  try {
    const { id } = req.params;
    const {
      modelId,
      modelName,
      exteriorColor,
      wheels,
      interior,
      totalPrice,
      previewImage,
      configurationData,
    } = req.body;

    if (!modelId || !modelName || !exteriorColor || !wheels || !interior || typeof totalPrice !== 'number' || !previewImage) {
      return res.status(400).json({
        error: 'modelId, modelName, exteriorColor, wheels, interior, totalPrice, and previewImage are required',
      });
    }

    const doc = await SavedConfiguration.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      {
        modelId,
        modelName,
        exteriorColor,
        wheels,
        interior,
        totalPrice,
        previewImage,
        configurationData: configurationData || {},
      },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({
      id: doc._id,
      modelName: doc.modelName,
      exteriorColor: doc.exteriorColor,
      wheels: doc.wheels,
      interior: doc.interior,
      totalPrice: doc.totalPrice,
      previewImage: doc.previewImage,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    console.error('Update config error:', err);
    res.status(500).json({ error: 'Failed to update configuration' });
  }
}

export async function deleteConfig(req, res) {
  try {
    const { id } = req.params;

    const doc = await SavedConfiguration.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!doc) {
      return res.status(404).json({ error: 'Configuration not found' });
    }

    res.json({ message: 'Configuration deleted' });
  } catch (err) {
    console.error('Delete config error:', err);
    res.status(500).json({ error: 'Failed to delete configuration' });
  }
}
