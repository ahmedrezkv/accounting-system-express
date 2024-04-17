import { Schema, model } from "mongoose";
import { IAccount } from "./account.model.types";

const accountSchema = new Schema<IAccount>({
  /* #1 */
  accountNo: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
    minLength: [1, "This field must be at least 1 character"],
    maxLength: [20, "This field must be at most 20 characters"],
  },
  /* #2 */
  debits: {
    type: Number,
    required: [true, "This field is required"],
    default: 0,
  },
  /* #3 */
  credits: {
    type: Number,
    required: [true, "This field is required"],
    default: 0,
  },
  /* #4 */
  category: {
    type: String,
    required: [true, "This field is required"],
    trim: true,
    minLength: [2, "This field must be at least 2 characters"],
    maxLength: [100, "This field must be at most 100 characters"],
  },
});

const Account = model("Account", accountSchema);

export default Account;
