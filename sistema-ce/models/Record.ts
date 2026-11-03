import mongoose, { Schema } from 'mongoose';
const AssetSchema = new Schema({ publicId: { type: String, default: '' }, format: { type: String, default: '' } }, { _id: false });
const RecordSchema = new Schema({
  documentType: { type: String, required: true, enum: ['Carné de extranjería', 'Pasaporte', 'Otro'] },
  documentNumber: { type: String, required: true, trim: true, uppercase: true, index: true },
  firstNames: { type: String, required: true, trim: true },
  surnames: { type: String, required: true, trim: true },
  nationality: { type: String, default: '' }, birthDate: { type: Date, required: true }, sex: { type: String, default: '' },
  migrationStatus: { type: String, default: '' }, certificateNumber: { type: String, default: '' },
  issueDate: { type: Date }, expiryDate: { type: Date }, residenceExpiry: { type: Date },
  photo: { type: AssetSchema, default: () => ({}) }, signature: { type: AssetSchema, default: () => ({}) }, biometricFile: { type: AssetSchema, default: () => ({}) },
  active: { type: Boolean, default: true }, createdBy: { type: String, default: 'admin' }
}, { timestamps: true });
RecordSchema.index({ documentNumber: 1, birthDate: 1 }, { unique: true });
export default mongoose.models.Record || mongoose.model('Record', RecordSchema);
