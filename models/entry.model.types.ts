import mongoose, { Types } from "mongoose";

export interface ISingleEntry extends mongoose.Document {
  accountNo: string;
  amount: number;
}

export interface IEntry extends mongoose.Document {
  _id: Types.ObjectId;
  debit: ISingleEntry;
  credit: ISingleEntry;
  date: Date;
  user: Types.ObjectId;
}
