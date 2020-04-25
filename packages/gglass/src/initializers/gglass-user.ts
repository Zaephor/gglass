import { Initializer, log, action } from "actionhero";
import { db } from "../modules/ah-lowdb-plugin";
import { middleware, model } from "../modules/gglass-user";

export class GglassUserInitializer extends Initializer {
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
      name: "admin",
      display: "Admin",
    };
    let userGroup: model.group = {
      name: "user",
      display: "User",
    };
    let guestGroup: model.group = {
      name: "guest",
      display: "Guest",
    };
    let anonGroup: model.group = {
      name: "anon",
      display: "Anonymous",
    };
    db.initialize("user", {
      users: [],
      groups: [adminGroup, userGroup, guestGroup, anonGroup],
    });
    action.addMiddleware(middleware["user:inject"]);
  }
}
