const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      maxlength: [128, 'Password is too long'],
      select: false, // Never returned in queries by default
    },
    role: {
      type: String,
      enum: ['issuer'],
      default: 'issuer',
    },
    // Optional organization fields (can be filled in profile settings later)
    organizationName: {
      type: String,
      trim: true,
      default: null,
    },
    organizationType: {
      type: String,
      enum: ['College', 'University', 'Hospital', 'Company', 'Government', 'Other', null],
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save Hook: Hash password before storing ───────────────────────────────
// NOTE: In Mongoose 9, async middleware should NOT call next() — return the Promise.
userSchema.pre('save', async function () {
  // Only hash if password was modified (covers both create and update)
  if (!this.isModified('password')) return;

  const saltRounds = 12; // High enough to be secure, not too slow
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// ─── Instance Method: Compare password at login ────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance Method: Return safe public user object ──────────────────────────
userSchema.methods.toPublicJSON = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    organizationName: this.organizationName,
    organizationType: this.organizationType,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model('User', userSchema);
