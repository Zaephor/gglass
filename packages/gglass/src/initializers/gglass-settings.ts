import { Initializer, log } from "actionhero";
import { db } from "../modules/ah-lowdb-plugin";
import { gglassSettings } from "../modules/gglass-settings";

let default_settings = [
  { id: "user_registration", type: "boolean", default_value: false },
  { id: "user_gauth_id", type: "string", default_value: "" },
  { id: "user_gauth_secret", type: "password", default_value: "" },
];

export class GglassSettings extends Initializer {
  constructor() {
    super();
    this.name = "gglass-settings";
    this.loadPriority = 1100;
    this.startPriority = 1100;
    this.stopPriority = 1100;
  }

  async initialize() {
    log("[" + this.loadPriority + "] " + this.name + ": Initializing");
    db.initialize("settings", { entries: [] });
    log(
      "[" +
        this.loadPriority +
        "] " +
        this.name +
        ": Validating settings config"
    );
    default_settings.forEach((setting) => {
      gglassSettings.list(setting.id).then(([entry]) => {
        // TODO: Proper error checking in this section
        if (!entry) {
          // Doesn't exists
          log(
            "[" +
              this.loadPriority +
              "] " +
              this.name +
              ": Creating config " +
              setting.id
          );
          gglassSettings.create(
            setting.id,
            setting.type,
            undefined,
            setting.default_value
          );
        } else if (!!entry && entry.default_value !== setting.default_value) {
          // Exists but defaults are out of sync
          log(
            "[" +
              this.loadPriority +
              "] " +
              this.name +
              ": Updating default config " +
              setting.id
          );
          gglassSettings.update(setting.id, undefined, setting.default_value);
        }
      });
    });
  }
}
