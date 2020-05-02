import { api } from "actionhero";

export namespace model {
  export interface config {
    id: string;
    type: string;
    value?: any;
    default_value?: any;
  }
}

export const gglassSettings = {
  list: async function (settingId?: string): Promise<Array<object>> {
    await api.lowdb["settings"].read(); // Sync DB
    if (!!settingId) {
      return [
        await api.lowdb["settings"]
          .get("entries")
          .find({ id: settingId })
          .value(),
      ];
    } else {
      return api.lowdb["settings"].get("entries").value();
    }
  },
  create: async function (
    id: string,
    type: string,
    value?: any,
    default_value?: any
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
    default_value?: any
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
    } else if (!!entryCheck && !entryCheck.default_value) {
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
