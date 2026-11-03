import Audit from '@/models/Audit';
export async function audit(actor: string, action: string, recordId = '', details = '') { try { await Audit.create({ actor, action, recordId, details }); } catch { /* audit failure must not expose internal details */ } }
