import mongoose, { Model, Types } from "mongoose";

export interface IPasswordChange extends mongoose.Document {
  changedAt: Date;
  resetToken: string | undefined;
  resetTokenExpiresIn: Date | undefined;
}

export interface IUser extends mongoose.Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  image: {
    path: string;
  };
  passwordChange: IPasswordChange;
}

export interface IUserMethods {
  isPasswordValid: (inputPassword: string) => Promise<boolean>;
  generatePasswordResetToken: () => string;
  isPasswordResetTokenValid: (inputToken: string) => boolean;
  resetPassword: (newPassword: string) => void;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
