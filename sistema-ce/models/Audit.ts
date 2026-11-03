import mongoose, { Schema } from 'mongoose';
const AuditSchema = new Schema({ actor: { type: String, required: true }, action: { type: String, required: true }, recordId: { type: String, default: '' }, ip: { type: String, default: '' }, details: { type: String, default: '' } }, { timestamps: true });
export default mongoose.models.Audit || mongoose.model('Audit', AuditSchema);
