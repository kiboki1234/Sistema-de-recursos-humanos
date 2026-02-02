const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['strategic_coordinator', 'president', 'vice_president', 'leader', 'member'],
    required: true
  },
  student_id: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  assignedLeader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }, // Referencia al líder asignado
  isActive: { type: Boolean, default: true },
  period: { type: String, required: false }, // E.g., "2025-2026"
  profilePicture: { type: String, default: "" } // URL de Cloudinary
}, { timestamps: true });

// Encriptar contraseña antes de guardar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
