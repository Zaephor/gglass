import { api } from "actionhero";

export namespace model {
  export interface config {
    id: string;
    group?: string;
    type: string;
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

export const gglassSettings = {
  list: async function (settingId?: string): Promise<Array<object>> {
    await api.lowdb["settings"].read(); // Sync DB
    // TODO: Think about how to best handle hiding sensitive information
    if (!!settingId) {
      // return util.omitValueIfPassword([
      //     await api.lowdb["settings"]
      //         .get("entries")
      //         .find({id: settingId})
      //         .value(),
      // ]);
      return [
        await api.lowdb["settings"]
          .get("entries")
          .find({ id: settingId })
          .value(),
      ];
    } else {
      // return util.omitValueIfPassword(api.lowdb["settings"].get("entries").sortBy(['group', 'order', 'id']).value());
      return api.lowdb["settings"]
        .get("entries")
        .sortBy(["group", "order", "id"])
        .value();
    }
  },
  create: async function (
    id: string,
    type: string,
    value?: any,
    default_value?: any,
    group?: string,
    order?: number
  ): Promise<{ created: boolean; setting?: object; error?: string }> {
    await api.lowdb["settings"].read(); // Sync DB
    let entryCheck = api.lowdb["settings"].get("entries").find({ id }).value();
    if (!!entryCheck) {
      return {
        created: false,
        error: "Setting ID is already used for something.",
      };
    } else {
      let newEntry: model.config = {
        id,
        type,
      };
      if (value !== undefined) {
        newEntry.value = value;
      }
      if (default_value !== undefined) {
        newEntry.default_value = default_value;
      }
      if (group !== undefined) {
        newEntry.group = group;
      }
      if (order !== undefined) {
        newEntry.order = order;
      }
      await api.lowdb["settings"].get("entries").push(newEntry).write();
      let entryCheck = api.lowdb["settings"]
        .get("entries")
        .find({ id })
        .value();
      if (!!entryCheck.id && entryCheck.id === id) {
        return {
          created: true,
          setting: entryCheck,
        };
      } else {
        // TODO: Better creation verification that the creation has failed
        return { created: false };
      }
    }
  },
  update: async function (
    id: string,
    value?: any,
    default_value?: any,
    group?: string,
    order?: number
  ): Promise<{ updated: boolean; setting?: object; error?: string }> {
    await api.lowdb["settings"].read(); // Sync DB
    let entryCheck = api.lowdb["settings"].get("entries").find({ id }).value();
    if (!entryCheck) {
      return { updated: false, error: "Setting ID does not exist." };
    } else {
      let updateEntry: any = {};
      if (value !== undefined) {
        updateEntry.value = value;
      }
      if (default_value !== undefined) {
        updateEntry.default_value = default_value;
      }
      if (group !== undefined) {
        updateEntry.group = group;
      }
      if (order !== undefined) {
        updateEntry.order = order;
      }
      let result = api.lowdb["settings"]
        .get("entries")
        .find({ id })
        .assign(updateEntry)
        .write();

      if (!!result.id && result.id === id) {
        return {
          updated: true,
          setting: result,
        };
      } else {
        // TODO: Better creation verification that the update has failed
        return { updated: false };
      }
    }
  },
  reset: async function (
    id: string
  ): Promise<{ reset: boolean; setting?: object; error?: string }> {
    await api.lowdb["settings"].read(); // Sync DB
    let entryCheck = api.lowdb["settings"].get("entries").find({ id }).value();
    if (!entryCheck) {
      return { reset: false, error: "Setting ID does not exist." };
    } else if (!!entryCheck && entryCheck.default_value === undefined) {
      return { reset: false, error: "No default defined for this setting." };
    } else {
      let result = api.lowdb["settings"]
        .get("entries")
        .find({ id })
        .assign({ value: entryCheck.default_value })
        .write();
      if (!!result.id && result.id === id) {
        return {
          reset: true,
          setting: result,
        };
      } else {
        // TODO: Better creation verification that the update has failed
        return { reset: false };
      }
    }
  },
  delete: async function (
    id: string
  ): Promise<{ deleted: boolean; setting?: object; error?: string }> {
    await api.lowdb["settings"].read(); // Sync DB
    let result = await api.lowdb["settings"]
      .get("entries")
      .remove({ id })
      .write()[0];
    if (!!result.entry) {
      return { deleted: true };
    } else {
      return { deleted: false };
    }
  },
};
