//TODO: Split ah-session-plugin off as it's own npm module
import { Initializer, log, action, api } from "actionhero";
import { middleware } from "../modules/ah-session-plugin";

export class AhSessionPlugin extends Initializer {
  constructor() {
    super();
    this.name = "ah-session-plugin";
    this.loadPriority = 1000;
    this.startPriority = 1000;
    this.stopPriority = 1000;
  }

  async initialize(config) {
    log("[" + this.loadPriority + "] " + this.name + ": Initializing");
    action.addMiddleware(middleware["session:inject"]);
    api.params.globalSafeParams.push("csrfToken");
  }
}
