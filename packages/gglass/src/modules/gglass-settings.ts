import { api } from "actionhero";
import { LowdbCrud } from "./lowdb-crud";

export namespace model {
  export interface config {
    id: string;
    type: string;
    group?: string;
    value?: any;
    default_value?: any;
    order?: number;
  }
}

export const util = {
  omitValueIfPassword: function (collection) {
    let weirdFilter = function (obj) {
      return typeof obj !== "object"
        ? obj
        : Object.keys(obj).reduce((o, k) => {
            if (!(k === "value" && obj["type"] === "password")) {
              o[k] = obj[k];
            }
            return o;
          }, {});
    };

    return collection.reduce((acc, cur) => {
      acc.push(weirdFilter(cur));
      return acc;
    }, []);
  },
};

export const gglassSettings = new LowdbCrud({
  db: "settings",
  table: "entries",
});
