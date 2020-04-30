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
      icon: "adb",
    };
    let userGroup: model.group = {
      id: "user",
      // label: "User",
      icon: "child_care",
    };
    let guestGroup: model.group = {
      id: "guest",
      // label: "Guest",
    };
    let anonGroup: model.group = {
      id: "anon",
      // label: "Anonymous",
    };
    db.initialize("user", {
      users: [],
      groups: [adminGroup, userGroup, guestGroup, anonGroup],
    });
    action.addMiddleware(middleware["user:inject"]);
  }
}
