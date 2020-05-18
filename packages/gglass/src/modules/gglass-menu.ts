import { LowdbCrud } from "./lowdb-crud";

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
      category: { required: false },
      groups: { required: false },
    };
  },
  category(command) {
    return {
      label: { required: command === "create" },
      sortorder: { required: false },
      icon: { required: false },
      groups: { required: false },
    };
  },
};

export const gglassCategory = new LowdbCrud({ db: "menu", table: "category" });

export const gglassMenu = new LowdbCrud({ db: "menu", table: "menu" });
