import { Initializer, log, action } from "actionhero";
import { db } from "../modules/ah-lowdb-plugin";
import { middleware, model } from "../modules/gglass-user";

export class GglassUser extends Initializer {
  constructor() {
    super();
    this.name = "gglass-user";
    this.loadPriority = 1100;
    this.startPriority = 1100;
    this.stopPriority = 1100;
  }

  async initialize() {
    log("[" + this.loadPriority + "] " + this.name + ": Initializing");
    let adminGroup: model.group = {
      id: "admin",
      // label: "Admin",
      icon: "fas fa-user-ninja",
    };
    let userGroup: model.group = {
      id: "user",
      // label: "User",
      icon: "fas fa-user-injured",
    };
    db.initialize("user", {
      users: [],
      groups: [adminGroup, userGroup],
    });
    action.addMiddleware(middleware["user:inject"]);
    action.addMiddleware(middleware["user:logged_in"]);
    action.addMiddleware(middleware["user:group_check"]);
  }
}
