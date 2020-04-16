//TODO: Split ah-lowdb-plugin off as it's own npm module
import { Initializer, log, action, api } from "actionhero";
import { db } from "../modules/ah-lowdb-plugin";
import * as fs from "fs";

export class AhLowdbPlugin extends Initializer {
  constructor() {
    super();
    this.name = "ah-lowdb-plugin";
    this.loadPriority = 1000;
    this.startPriority = 1000;
    this.stopPriority = 1000;
  }

  async initialize(config) {
    log("[" + this.loadPriority + "] " + this.name + ": Initializing");
    try {
      fs.accessSync(db.configRoot, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      throw new Error(
        "Do not have read or write permission to " + db.configRoot
      );
    }
    api["lowdb"] = {};
  }
}
