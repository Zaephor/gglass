import { api } from "actionhero";
import { v4 as uuidv4 } from "uuid";
import { util } from "./gglass-user";

export namespace model {
  export interface entry {
    id: string;
    label: string;
    sortorder?: number;
    icon?: string;
    url?: string;
    target?: string;
    parent?: string;
    groups?: string[];
  }
}

// TODO: Shift the rest of the CRUD here from gglass-admin-menu
export const gglassMenu = {
  listAll: async function (menuId?: string): Promise<Array<object>> {
    await api.lowdb["menu"].read(); // Sync DB
    let menu = [];
    let menuEntries = !!menuId
      ? [api.lowdb["menu"].get("entries").find({ id: menuId }).value()]
      : api.lowdb["menu"]
          .get("entries")
          .orderBy(["parent", "sortorder", "label"], ["desc", "asc", "asc"])
          .value();
    menuEntries.forEach((ele) => {
      // Add element
      let parentIdx = null;
      if (!!ele.parent) {
        parentIdx = api.lowdb["menu"]._.findIndex(menu, {
          id: ele.parent,
        });
      }
      if (!ele.parent || parentIdx === -1 || parentIdx === null) {
        menu.push(ele);
      } else {
        if (!menu[parentIdx].children) {
          menu[parentIdx].children = [];
        }
        if (!!menu[parentIdx].children) {
          menu[parentIdx].children.push(ele);
        }
      }
    });
    return menu;
  },
  listFiltered: async function (
    groupFilter: Array<string> = [],
    menuId?: string
  ): Promise<Array<object>> {
    await api.lowdb["menu"].read(); // Sync DB
    let menu = [];
    let menuEntries = !!menuId
      ? [api.lowdb["menu"].get("entries").find({ id: menuId }).value()]
      : api.lowdb["menu"]
          .get("entries")
          .orderBy(["parent", "sortorder", "label"], ["desc", "asc", "asc"])
          .value();
    // Filter submenus furst, then filter root menus after
    menuEntries.forEach((ele) => {
      // Add element
      let parentIdx = null;
      if (!!ele.parent) {
        parentIdx = api.lowdb["menu"]._.findIndex(menu, {
          id: ele.parent,
        });
      }
      if (!ele.parent || parentIdx === -1 || parentIdx === null) {
        // Parentless entry
        menu.push(ele);
      } else {
        // Child entry
        if (!menu[parentIdx].children) {
          menu[parentIdx].children = [];
        }
        if (!!menu[parentIdx].children) {
          if (
            ele.groups === undefined ||
            (Array.isArray(ele.groups) &&
              (ele.groups.length === 0 ||
                (ele.groups.length > 0 &&
                  ele.groups.some((x) => groupFilter.indexOf(x) != -1))))
          ) {
            menu[parentIdx].children.push(ele);
          }
        }
      }
    });
    return menu.filter((ele) => {
      let noGroups = ele.groups === undefined;
      let emptyGroups = Array.isArray(ele.groups) && ele.groups.length === 0;
      let matchGroups =
        Array.isArray(ele.groups) &&
        ele.groups.length > 0 &&
        ele.groups.some((x) => groupFilter.indexOf(x) != -1);
      let noParents = !ele.parent;
      return noParents && (noGroups || emptyGroups || matchGroups);
    });
  },
  find: async function (url: string): Promise<[model.entry] | false> {
    await api.lowdb["menu"].read(); // Sync DB
    let menuEntry = api.lowdb["menu"].get("entries").find({ url }).value();
    if (!!menuEntry) {
      return menuEntry;
    }
    return false;
  },
  create: async function (
    label: string,
    sortorder?: number,
    icon?: string,
    url?: string,
    target?: string,
    parent?: string,
    groups?: Array<string>
  ): Promise<{ created: boolean; entry?: object; error?: string }> {
    await api.lowdb["menu"].read(); // Sync DB
    let newEntry: model.entry = {
      id: uuidv4(),
      label,
      sortorder,
      icon,
      url,
      target,
      parent,
      groups,
    };
    await api.lowdb["menu"].get("entries").push(newEntry).write();
    let entryCheck = api.lowdb["menu"]
      .get("entries")
      .find({ id: newEntry.id })
      .value();
    if (!!entryCheck.id) {
      return {
        created: true,
        entry: entryCheck,
      };
    } else {
      // TODO: Better creation verification that the creation has failed
      return { created: false };
    }
  },
  // TODO: update function doesn't enforce model.entry interface
  update: async function (
    id: string,
    payload: object
  ): Promise<{ updated: boolean; entry?: object; error?: string }> {
    await api.lowdb["menu"].read(); // Sync DB
    let menuEntry = api.lowdb["menu"].get("entries").find({ id }).value();
    if (!menuEntry) {
      return { updated: false, error: "Entry not found" };
    } else {
      // Assign only replaces declared values and ignores un-updated.
      // Follow delete+recreate approach instead
      await api.lowdb["menu"].get("entries").remove({ id }).write();
      let result = await api.lowdb["menu"]
        .get("entries")
        .push({ id, ...payload })
        .write();
      return {
        updated: true,
        entry: result,
      };
    }
  },
  delete: async function (id: string): Promise<{ deleted: boolean }> {
    await api.lowdb["menu"].read(); // Sync DB
    let result = await api.lowdb["menu"]
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
