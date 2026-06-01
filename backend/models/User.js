const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User — guests and hosts who log in and make or receive reservations.
 * Why: The brief uses JWT login (email + password) and roles (user vs host).
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "host"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Hash password before saving — never store plain text in the database.
// Mongoose 7+: async hooks do not use next() — calling next() causes "next is not a function".
userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Used on login (Day 4): compare typed password with the hash in MongoDB.
userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("User", userSchema);
