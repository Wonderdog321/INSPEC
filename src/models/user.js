import { mongoose } from "mongoose";
import bcrypt from "bcrypt";
const user = {
  firstname: "",
  lastname: "",
  username: "",
  password: "",
};
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
userSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    bcrypt.hash(this.password, 8, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  }
});

userSchema.methods.comparePassword = async function (password) {
  if (!password) throw new Error("Password is missing, cannot compare!");
  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.log("Error while comparing password!", error.message);
  }
};
userSchema.statics.isInUseEmail = async function (username) {
  if (!username) throw new Error("No username was provided.");
  try {
    const user = await this.findOne({ username });
    if (user) return false;
    return true;
  } catch (error) {
    console.log("Error inside isThisEmailInUse method.", error.message);
    return false;
  }
};
export default mongoose.model("User", userSchema);
