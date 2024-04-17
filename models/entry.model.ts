import { Schema, model } from "mongoose";
import OperationalError from "../lib/operational-error";
import { IEntry, ISingleEntry } from "./entry.model.types";
import { Account } from "./index";

const singleEntrySchema = new Schema<ISingleEntry>({
  /* #1 */
  accountNo: {
    type: String,
    required: [true, "This field is required"],
  },
  /* #2 */
  amount: {
    type: Number,
    required: [true, "This field is required"],
  },
});

const entrySchema = new Schema<IEntry>({
  /* #1 */
  debit: {
    type: singleEntrySchema,
    required: [true, "This field is required"],
  },
  /* #2 */
  credit: {
    type: singleEntrySchema,
    required: [true, "This field is required"],
  },
  /* #3 */
  date: {
    type: Date,
    required: [true, "This field is required"],
    validate: {
      validator: function (val: Date) {
        return val <= new Date();
      },
      message: "This field must be less than or equal to the current date",
    },
  },
  /* #4 */
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "This field is required"],
  },
});

/* Middlewares */
entrySchema.pre("save", async function (next) {
  /* Check if accounts exist */
  const debitAccount = await Account.findOne({ accountNo: this.debit.accountNo });
  if (!debitAccount) {
    return next(new OperationalError(404, `No account was found with this number "${this.debit.accountNo}".`));
  }
  const creditAccount = await Account.findOne({ accountNo: this.credit.accountNo });
  if (!creditAccount) {
    return next(new OperationalError(404, `No account was found with this number "${this.credit.accountNo}".`));
  }
  /* Add debit and credit amounts to the related accounts */
  const prevDebitsValue = debitAccount.debits;
  debitAccount.debits = prevDebitsValue + this.debit.amount;
  await debitAccount.save();
  const prevCreditsValue = creditAccount.debits;
  creditAccount.credits = prevCreditsValue + this.credit.amount;
  await creditAccount.save();

  next();
});

entrySchema.index({ "debit.accountNo": 1 });
entrySchema.index({ "credit.accountNo": 1 });

const Entry = model("Entry", entrySchema);

export default Entry;
