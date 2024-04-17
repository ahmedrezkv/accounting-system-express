import { Router } from "express";
import { createEntry, deleteEntry, getEntries, updateEntry } from "../controllers/entries.controllers";
import { checkAuthentication } from "../middlewares/auth.middlewares";

const entriesRouter = Router();

entriesRouter.use(checkAuthentication);
entriesRouter.route("/").get(getEntries).post(createEntry);
entriesRouter.route("/:entryId").patch(updateEntry).delete(deleteEntry);

export default entriesRouter;
