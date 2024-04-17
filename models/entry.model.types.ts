import { Types } from "mongoose";

export interface ISingleEntry {
  accountNo: string;
  amount: number;
}

export interface IEntry {
  _id: Types.ObjectId;
  debit: ISingleEntry;
  credit: ISingleEntry;
  date: Date;
  user: Types.ObjectId;
}
