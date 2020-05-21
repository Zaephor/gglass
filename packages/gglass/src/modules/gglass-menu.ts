import { LowdbCrud } from "./lowdb-crud";
import { api } from "actionhero";

// TODO: Should probably give up on using Typescript interfaces, I seem to be relying on actionhero to enforce them anyhow
export namespace model {
  export interface category {
    id: string;
    label: string;
    sortorder?: number;
    icon?: string;
    groups?: string[];
  }

  export interface entry {
    id: string;
    label: string;
    category: string;
    url: string;
    sortorder?: number;
    icon?: string;
    target?: string;
    groups?: string[];
  }
}

export const inputs = {
  menu(command) {
    return {
      label: { required: command === "create" },
      sortorder: { required: false },
      icon: { required: false },
      url: { required: false },
      target: { required: false },
      parent: { required: false },
      groups: { required: false },
    };
  },
};

export const util = {
  groupFilter(elementGroups, userGroups) {
    if (elementGroups.length === 0) {
      return true;
    }
    if (userGroups.length === 0 && elementGroups.length > 0) {
      return false;
    }
    return elementGroups.some((x) => userGroups.indexOf(x) != -1);
  },
  async sortedListAll(id?: string) {
    await api.lowdb["menu"].read(); // Sync DB
    return !!id
      ? [api.lowdb["menu"].get("menu").find({ id }).value()]
      : api.lowdb["menu"]
          .get("menu")
          .orderBy(["parent", "sortorder", "label"], ["desc", "asc", "asc"])
          .value();
  },
  buildMenu(rawElements) {
    let responseElements = [];
    rawElements.forEach((ele) => {
      let parentIdx = null;
      if (!!ele.parent) {
        parentIdx = api.lowdb["menu"]._.findIndex(responseElements, {
          id: ele.parent,
        });
      }
      if (!ele.parent || parentIdx === -1 || parentIdx === null) {
        responseElements.push(ele);
      } else if (parentIdx >= 0) {
        if (!responseElements[parentIdx].children) {
          responseElements[parentIdx].children = [];
        }
        if (!!responseElements[parentIdx].children) {
          responseElements[parentIdx].children.push(ele);
        }
      }
    });
    return responseElements;
  },
};

class menuCrud extends LowdbCrud {
  async listAll(id?: string) {
    // Get raw elements, presorted on parent idx and sortorder, then by label
    let rawElements = await util.sortedListAll(id);
    return util.buildMenu(rawElements);
  }

  async listFiltered(groupFilter: Array<string> = [], id?: string) {
    // Get raw elements, presorted on parent idx and sortorder, then by label
    let rawElements = await util.sortedListAll(id);
    return util.buildMenu(rawElements).filter((ele) => {
      if (!!ele.parent) {
        return false;
      }
      return util.groupFilter(ele.groups || [], groupFilter);
    });
  }
}

export const gglassMenu = new menuCrud({ db: "menu", table: "menu" });
