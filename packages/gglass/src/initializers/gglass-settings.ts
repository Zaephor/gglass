import { Initializer, log } from "actionhero";
import { db } from "../modules/ah-lowdb-plugin";
import { gglassSettings } from "../modules/gglass-settings";

let default_settings = [
  // User config group
  // Enable/Disable user registration
  {
    id: "user_registration",
    group: "user",
    type: "boolean",
    default_value: false,
    order: 0,
  },
  // User Gauth auth group
  // Enable/Disable gauth user login
  {
    id: "user_gauth_login",
    group: "user_guath",
    type: "boolean",
    default_value: false,
    order: 0,
  },
  // Enable/Disable gauth user registration
  {
    id: "user_gauth_registration",
    group: "user_guath",
    type: "boolean",
    default_value: false,
    order: 1,
  },
  // Enable/Disable gauth client_id
  {
    id: "user_gauth_id",
    group: "user_guath",
    type: "string",
    default_value: "",
    order: 2,
  },
  // Enable/Disable gauth client_secret
  {
    id: "user_gauth_secret",
    group: "user_guath",
    type: "password",
    default_value: "",
    order: 3,
  },
  // Gglass peer trust configuration
  // Parent IP: Used for gglass<->gglass communication
  {
    id: "gglass_parent_ip",
    group: "gglass_parent",
    type: "string",
    default_value: "",
    order: 0,
  },
  // TODO pub/priv key approach later?
  // PSK
  {
    id: "gglass_psk",
    group: "gglass_parent",
    type: "string",
    default_value: "",
    order: 1,
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
        if (setting["value"]) {
          // Value should never be defined from the above defaults, but clearing it here just in-case I forget
          delete setting["value"];
        }
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
          gglassSettings.create(setting);
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
          gglassSettings.replace(setting.id, { ...entry, ...setting });
        }
      });
    });
  }
}
