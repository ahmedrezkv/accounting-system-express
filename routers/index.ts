import express from "express";
import accountsRouter from "./accounts.router";
import entriesRouter from "./entries.router";
import usersRouter from "./users.router";

const mainRouter = express.Router();

mainRouter.use("/users", usersRouter);
mainRouter.use("/accounts", accountsRouter);
mainRouter.use("/entries", entriesRouter);

export default mainRouter;
