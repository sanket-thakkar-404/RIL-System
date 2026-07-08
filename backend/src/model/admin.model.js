import mongoose from "mongoose";
import bcrypt from "bcrypt"

const AdminSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "user"],
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);


// password hash before saving

AdminSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

// compare password
AdminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const adminModel = mongoose.model("Admin", AdminSchema);

export default adminModel;