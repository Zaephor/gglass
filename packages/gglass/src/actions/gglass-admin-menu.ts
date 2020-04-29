import { Action, api } from "actionhero";
import { model } from "../modules/gglass-menu";
import { v4 as uuidv4 } from "uuid";

// TODO: Require user is member of admin group for these API calls
const commandPrefix = "admin:menu:";

export class AdminMenuList extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "List the nav menu for editing";
    this.inputs = {
      id: { required: false },
    };
    this.outputExample = {
      menu: [
        {
          id: "6730b403-1d82-4617-94b9-605340198f3d",
          label: "A",
          icon: "cloud",
          children: [
            {
              id: "33b2a141-3bbe-4a24-b1db-3acfd610418e",
              label: "A-A",
              icon: "scanner",
              url: "/a/a",
            },
          ],
        },
        {
          id: "bbc0accf-8b9b-4fce-8b04-0f0a6cc728f8",
          label: "B",
          icon: "security",
          children: [],
        },
      ],
    };
  }
  //TODO: Add admin-level validation

  async run(data) {
    await api.lowdb["menu"].read(); // Sync DB
    data.response.menu = [];
    if (!!data.params.id) {
      data.response.menu = [
        api.lowdb["menu"].get("entries").find({ id: data.params.id }).value(),
      ];
    } else {
      let menuEntries = api.lowdb["menu"]
        .get("entries")
        .orderBy(["parent", "order", "label"], ["desc", "asc", "asc"])
        .value();
      menuEntries.forEach((ele) => {
        let parentIdx = null;
        if (!!ele.parent) {
          parentIdx = api.lowdb["menu"]._.findIndex(data.response.menu, {
            id: ele.parent,
          });
        }
        if (!ele.parent || parentIdx === -1 || parentIdx === null) {
          data.response.menu.push(ele);
        } else {
          if (!data.response.menu[parentIdx].children) {
            data.response.menu[parentIdx].children = [];
          }
          if (!!data.response.menu[parentIdx].children) {
            data.response.menu[parentIdx].children.push(ele);
          }
        }
      });
    }
  }
}

export class AdminMenuUpsert extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "upsert";
    this.description = "Create/update nav item";
    this.inputs = {
      id: { required: false },
      label: { required: true },
      order: { required: false },
      icon: { required: false },
      url: { required: false },
      target: { required: false },
      parent: { required: false },
      groups: { required: false },
    };
    this.outputExample = {};
  }
  //TODO: Add admin-level validation

  // async run(data) {
  async run(data) {
    await api.lowdb["menu"].read(); // Sync DB

    let newEntry: model.entry = {
      id:
        !!data.params.id && data.params.id !== "new" && data.params.id !== ""
          ? data.params.id
          : uuidv4(),
      label: data.params.label,
    };

    Object.keys(this.inputs).forEach((attr) => {
      if (attr !== "id" && attr !== "label" && !!data.params[attr]) {
        newEntry[attr] = data.params[attr];
      }
    });

    if (newEntry.id === newEntry.parent) {
      delete newEntry.parent;
    }

    // Can't seem to see a way to replace an object in a lowdb collection. Update=delete+insert, new=insert
    if (data.params.id !== "new") {
      await api.lowdb["menu"]
        .get("entries")
        .remove({ id: data.params.id })
        .write()[0];
    }
    data.response.entry = await api.lowdb["menu"]
      .get("entries")
      .push(newEntry)
      .write()[0];
    if (!!data.response.entry) {
      if (data.params.id !== "new") {
        data.response.updated = true;
      } else {
        data.response.created = true;
      }
    }
  }
}

export class AdminMenuDelete extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a menu item";
    this.inputs = {
      id: { required: true },
    };
    this.outputExample = {};
  }
  //TODO: Add admin-level validation

  async run(data) {
    data.response.deleted = false;
    await api.lowdb["menu"].read(); // Sync DB

    data.response.entry = await api.lowdb["menu"]
      .get("entries")
      .remove({ id: data.params.id })
      .write()[0];
    if (!!data.response.entry) {
      data.response.deleted = true;
    }
  }
}
