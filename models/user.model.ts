import bcrypt from "bcryptjs";
import { HydratedDocument, Schema, model } from "mongoose";
import validator from "validator";
import { createToken, encryptToken } from "../lib/crypto";
import { IPasswordChange, IUser, IUserMethods, UserModel } from "./user.model.types";

const passwordChangeSubSchema = new Schema<IPasswordChange>({
  /* #1 */
  changedAt: {
    type: Date,
  },
  /* #2 */
  resetToken: {
    type: String,
  },
  /* #3 */
  resetTokenExpiresIn: {
    type: Date,
  },
});

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    /* #1 */
    name: {
      type: String,
      required: [true, "This field is required"],
      trim: true,
      minLength: [4, "This field must be at least 4 characters"],
      maxLength: [40, "This field must be at most 40 characters"],
      validate: {
        validator: function (val: string) {
          return validator.isAlphanumeric(val, "en-US", { ignore: " .-" });
        },
        message: "This field can contain only alphanumeric characters, spaces, dots, and dashes",
      },
    },
    /* #2 */
    email: {
      type: String,
      unique: true,
      required: [true, "This field is required"],
      trim: true,
      lowercase: true,
      maxLength: [100, "This field must be at most 100 characters"],
      validate: {
        validator: function (val: string) {
          return validator.isEmail(val);
        },
        message: (props: { value: string }) => `${props.value} is not a valid email address`,
      },
    },
    /* #3 */
    password: {
      type: String,
      required: [true, "This field is required"],
      minLength: [8, "This field must be at least 8 characters"],
      maxLength: [100, "This field must be at most 100 characters"],
      select: false,
    },
    /* #4 */
    image: {
      path: {
        type: String,
        trim: true,
        minLength: [10, "This field must be at least 10 characters"],
        maxLength: [100, "This field must be at most 100 characters"],
      },
    },
    /* #5 */
    passwordChange: {
      type: passwordChangeSubSchema,
      default: {},
      select: false,
    },
  },
  {
    virtuals: {
      entries: {
        options: {
          ref: "Entry",
          localField: "_id",
          foreignField: "user",
        },
      },
    },
  }
);

/* Methods */
userSchema.methods.isPasswordValid = async function (this: HydratedDocument<IUser>, inputPassword: string) {
  const isValid = await bcrypt.compare(inputPassword, this.password);
  return isValid;
};
userSchema.methods.generatePasswordResetToken = function (this: HydratedDocument<IUser>) {
  const passwordResetToken = createToken();
  const hashedPasswordResetToken = encryptToken(passwordResetToken);
  this.passwordChange.resetToken = hashedPasswordResetToken;
  this.passwordChange.resetTokenExpiresIn = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return passwordResetToken;
};
userSchema.methods.isPasswordResetTokenValid = function (this: HydratedDocument<IUser>, inputToken: string) {
  const hashedPasswordResetToken = encryptToken(inputToken);
  if (!this.passwordChange.resetToken || !this.passwordChange.resetTokenExpiresIn) return false;
  return (
    hashedPasswordResetToken === this.passwordChange.resetToken && this.passwordChange.resetTokenExpiresIn > new Date()
  );
};
userSchema.methods.resetPassword = function (this: HydratedDocument<IUser>, newPassword) {
  this.password = newPassword;
  this.passwordChange.resetToken = undefined;
  this.passwordChange.resetTokenExpiresIn = undefined;
};

/* Middlewares */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const hashedPassword = await bcrypt.hash(this.password, 12);
  this.password = hashedPassword;
  if (!this.isNew) this.passwordChange.changedAt = new Date();
});

const User = model("User", userSchema);

export default User;
