import { NextFunction, Response } from "express";
import OperationalError from "../lib/operational-error";
import { Entry } from "../models";
import { IEntry } from "../models/entry.model.types";
import { CustomRequest } from "./controllers.types";

export const getEntries = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authUser = req.locals?.authenticatedUser;
    if (!authUser) {
      return next(new OperationalError(404, "No authenticated user was found."));
    }
    const entries = await Entry.find();

    res.status(200).json({
      statusMessage: "Success",
      data: {
        entries,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createEntry = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authUser = req.locals?.authenticatedUser;
    if (!authUser) {
      return next(new OperationalError(404, "No authenticated user was found."));
    }
    const { debit, credit, date } = req.body;
    if (!debit || !credit || !date) {
      return next(
        new OperationalError(400, "Debit, credit, date, and user fields are required for creating a new entry.")
      );
    }
    const entry = await Entry.create({ debit, credit, date, user: authUser._id });

    res.status(200).json({
      statusMessage: "Success",
      data: {
        entry,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateEntry = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authUser = req.locals?.authenticatedUser;
    if (!authUser) {
      return next(new OperationalError(404, "No authenticated user was found."));
    }
    const { entryId } = req.params;
    const entry = await Entry.findOne({ _id: entryId });
    if (!entry) {
      return next(new OperationalError(404, `No entry was found with this id "${entryId}".`));
    }
    const allowedFields: (keyof IEntry)[] = ["debit", "credit", "date"];
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        entry[field] = req.body[field];
      }
    });
    entry.user = authUser._id;
    await entry.save();

    res.status(200).json({
      statusMessage: "Success",
      data: {
        entry,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEntry = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authUser = req.locals?.authenticatedUser;
    if (!authUser) {
      return next(new OperationalError(404, "No authenticated user was found."));
    }
    const { entryId } = req.params;
    await Entry.deleteOne({ _id: entryId });

    res.status(204).json({
      statusMessage: "Success",
      message: "The entry has been deleted.",
    });
  } catch (error) {
    next(error);
  }
};
