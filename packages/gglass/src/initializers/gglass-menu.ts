import { Initializer, log } from "actionhero";
import { db } from "../modules/ah-lowdb-plugin";

export class GglassMenu extends Initializer {
  constructor() {
    super();
    this.name = "gglass-menu";
    this.loadPriority = 1100;
    this.startPriority = 1100;
    this.stopPriority = 1100;
  }

  async initialize() {
    log("[" + this.loadPriority + "] " + this.name + ": Initializing");
    db.initialize("menu", { menu: [] });
  }
}
