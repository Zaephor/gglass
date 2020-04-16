//TODO: Split ah-lowdb-plugin off as it's own npm module
import { log, config, api } from "actionhero";
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
import * as path from "path";

export namespace db {
  export const configRoot: string = process.env.GGLASS_CONFIG || "/config";

  export async function initialize(
    database: string,
    defaults?: object
  ): Promise<boolean> {
    if (typeof api["lowdb"][database] === "undefined") {
      try {
        let adapter = new FileSync(path.join(configRoot, database + ".json"));
        api["lowdb"][database] = low(adapter);
        api["lowdb"][database].defaults(defaults || {}).write();
        return true;
      } catch (err) {
        log(err, "error");
        log(
          "Failed to create or load database '" +
            database +
            "' with " +
            path.join(configRoot, database + ".json"),
          "error"
        );
        throw new Error(err);
      }
    } else {
      return true;
    }
  }
}
