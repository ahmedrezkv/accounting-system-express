import mongoose, { Types } from "mongoose";

export interface IAccount extends mongoose.Document {
  _id: Types.ObjectId;
  accountNo: string;
  debits: number;
  credits: number;
  category: string;
}
