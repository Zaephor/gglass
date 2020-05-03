import { api } from "actionhero";

export namespace model {
  export interface entry {
    id: string;
    label: string;
    order?: number;
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
          .orderBy(["parent", "order", "label"], ["desc", "asc", "asc"])
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
          .orderBy(["parent", "order", "label"], ["desc", "asc", "asc"])
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
};
