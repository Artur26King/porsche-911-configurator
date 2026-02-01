import mongoose from 'mongoose';

const savedConfigurationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  modelId: { type: String, required: true },
  modelName: { type: String, required: true },
  exteriorColor: { type: String, required: true },
  wheels: { type: String, required: true },
  interior: { type: String, required: true },
  totalPrice: { type: Number, required: true },
  previewImage: { type: String, required: true },
  configurationData: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.model('SavedConfiguration', savedConfigurationSchema);
