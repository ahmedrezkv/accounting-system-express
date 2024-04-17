import { NextFunction, Response } from "express";
import OperationalError from "../lib/operational-error";
import { Account } from "../models";
import { IAccount } from "../models/account.model.types";
import { CustomRequest } from "./controllers.types";

export const getAccounts = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authUser = req.locals?.authenticatedUser;
    if (!authUser) {
      return next(new OperationalError(404, "No authenticated user was found."));
    }
    const accounts = await Account.find();

    res.status(200).json({
      statusMessage: "Success",
      data: {
        accounts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createAccount = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authUser = req.locals?.authenticatedUser;
    if (!authUser) {
      return next(new OperationalError(404, "No authenticated user was found."));
    }
    const { accountNo, category } = req.body;
    if (!accountNo || !category) {
      return next(
        new OperationalError(400, "Account number, and category fields are required for creating a new account.")
      );
    }
    const newAccount = await Account.create({ accountNo, category });

    res.status(200).json({
      statusMessage: "Success",
      data: {
        newAccount,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authUser = req.locals?.authenticatedUser;
    if (!authUser) {
      return next(new OperationalError(404, "No authenticated user was found."));
    }
    const { accountId } = req.params;
    const account = await Account.findOne({ _id: accountId });
    if (!account) {
      return next(new OperationalError(404, `No account was found with this id "${accountId}".`));
    }
    const allowedFields: (keyof IAccount)[] = ["accountNo", "category", "debits", "credits"];
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        (account[field] as any) = req.body[field];
      }
    });
    await account.save();

    res.status(200).json({
      statusMessage: "Success",
      data: {
        account,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authUser = req.locals?.authenticatedUser;
    if (!authUser) {
      return next(new OperationalError(404, "No authenticated user was found."));
    }
    const { accountId } = req.params;
    await Account.deleteOne({ _id: accountId });

    res.status(204).json({
      statusMessage: "Success",
      message: "The account has been deleted.",
    });
  } catch (error) {
    next(error);
  }
};
