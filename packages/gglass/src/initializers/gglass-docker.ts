import { gglassDocker } from "../modules/gglass-docker";
import { Initializer, log } from "actionhero";

export class GglassDocker extends Initializer {
  constructor() {
    super();
    this.name = "gglass-docker";
    this.loadPriority = 1100;
    this.startPriority = 1100;
    this.stopPriority = 1100;
  }

  async initialize() {
    log("[" + this.loadPriority + "] " + this.name + ": Initializing");
  }
}
