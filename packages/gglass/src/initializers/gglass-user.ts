import { Initializer, log, action } from "actionhero";
import { db } from "../modules/ah-lowdb-plugin";
import { middleware, model } from "../modules/gglass-user";

export class GglassProfileInitializer extends Initializer {
  constructor() {
    super();
    this.name = "gglass-profile";
    this.loadPriority = 1100;
    this.startPriority = 1100;
    this.stopPriority = 1100;
  }

  async initialize() {
    log("[" + this.loadPriority + "] " + this.name + ": Initializing");
    let adminGroup: model.group = {
      name: "admin",
      display: "Admin",
    };
    db.initialize("user", { users: [], groups: [adminGroup] });
    action.addMiddleware(middleware["user:inject"]);
  }
}
