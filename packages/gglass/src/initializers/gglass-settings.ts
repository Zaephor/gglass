import { Initializer, log } from "actionhero";
import { db } from "../modules/ah-lowdb-plugin";
import { gglassSettings } from "../modules/gglass-settings";

let default_settings = [
  {
    id: "user_registration",
    group: "user",
    type: "boolean",
    default_value: false,
    order: 0,
  },
  {
    id: "user_gauth_login",
    group: "user_guath",
    type: "boolean",
    default_value: false,
    order: 0,
  },
  {
    id: "user_gauth_registration",
    group: "user_guath",
    type: "boolean",
    default_value: false,
    order: 1,
  },
  {
    id: "user_gauth_id",
    group: "user_guath",
    type: "string",
    default_value: "",
    order: 2,
  },
  {
    id: "user_gauth_secret",
    group: "user_guath",
    type: "password",
    default_value: "",
    order: 3,
  },
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
            setting.default_value,
            setting.group,
            setting.order
          );
        } else if (
          !!entry &&
          (entry.default_value !== setting.default_value ||
            entry.group !== setting.group ||
            entry.order !== setting.order)
        ) {
          // Exists but defaults are out of sync
          log(
            "[" +
              this.loadPriority +
              "] " +
              this.name +
              ": Updating defaults for " +
              setting.id
          );
          gglassSettings.update(
            setting.id,
            undefined,
            setting.default_value || undefined,
            setting.group || undefined,
            setting.order || undefined
          );
        }
      });
    });
  }
}
