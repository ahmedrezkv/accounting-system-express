import { Router } from "express";
import { createAccount, deleteAccount, getAccounts, updateAccount } from "../controllers/accounts.controllers";
import { checkAuthentication } from "../middlewares/auth.middlewares";

const accountsRouter = Router();

accountsRouter.use(checkAuthentication);
accountsRouter.route("/").get(getAccounts).post(createAccount);
accountsRouter.route("/:accountId").patch(updateAccount).delete(deleteAccount);

export default accountsRouter;
