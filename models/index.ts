import mongoose from "mongoose";
import { setSchemaOptions, setUpdateQueryOptions } from "../lib/mongoose-custom-plugins";

mongoose.plugin(setSchemaOptions);
mongoose.plugin(setUpdateQueryOptions);

/* Import the models after setting schema options by a mongoose plugin */
import Account from "./account.model";
import Entry from "./entry.model";
import User from "./user.model";

export { Account, Entry, User };
