// server/models/User.js
//
// Stores both applicants and processors.
// Role is enforced server-side — the client never trusts itself on this.
//
// Passwords are NEVER stored in plain text.
// bcryptjs hashes happen in authController before save.

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ── Identity ─────────────────────────────────────────────────────────────
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },

    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please provide a valid email address",
      ],
    },

    // ── Auth ─────────────────────────────────────────────────────────────────
    // bcrypt hash — never the raw password.
    // select: false means this field is excluded from query results by default.
    // You must explicitly do .select("+passwordHash") to read it.
    passwordHash: {
      type:     String,
      required: true,
      select:   false,
    },

    // ── Role ─────────────────────────────────────────────────────────────────
    // "applicant" — regular user who submits visa cases
    // "processor" — internal staff who review and action cases
    role: {
      type:    String,
      enum:    ["applicant", "processor"],
      default: "applicant",
    },

    // ── Account state ─────────────────────────────────────────────────────────
    isActive: {
      type:    Boolean,
      default: true,
    },
  },
  {
    // Adds createdAt and updatedAt automatically
    timestamps: true,
  }
);

// ── Index ─────────────────────────────────────────────────────────────────────
// email is already indexed by `unique: true` above.
// This compound index speeds up processor queries (role + createdAt ordering).
userSchema.index({ role: 1, createdAt: -1 });

// ── Safe serialization ────────────────────────────────────────────────────────
// Strips passwordHash from any JSON output automatically.
// Runs when res.json() serializes the document.
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;