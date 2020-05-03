import { Action, ActionProcessor, api } from "actionhero";
import { gglassMenu, model } from "../modules/gglass-menu";
import { v4 as uuidv4 } from "uuid";

const commandPrefix = "admin:menu:";

// Base action
abstract class AdminAction extends Action {
  user_groups = ["admin"];

  run(data: ActionProcessor): Promise<void> {
    return Promise.resolve(undefined);
  }
}

// Admin Menu actions
export class AdminMenuList extends AdminAction {
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

  async run(data) {
    data.response.menu = await gglassMenu.listAll();
  }
}

export class AdminMenuCreate extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "create";
    this.description = "create a menu item";
    this.inputs = {
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

  async run(data) {
    let { created, entry } = await gglassMenu.create(
      data.params.label,
      data.params.order || undefined,
      data.params.icon || undefined,
      data.params.url || undefined,
      data.params.target || undefined,
      data.params.parent || undefined,
      data.params.groups || undefined
    );
    data.response.created = created;
    if (created) {
      data.response.entry = entry;
    }
  }
}

export class AdminMenuUpdate extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "update";
    this.description = "Update a menu item";
    this.inputs = {
      id: { required: true },
      label: { required: false },
      order: { required: false },
      icon: { required: false },
      url: { required: false },
      target: { required: false },
      parent: { required: false },
      groups: { required: false },
    };
    this.outputExample = {};
  }

  async run(data) {
    let payload = {};
    Object.keys(this.inputs).forEach((attr) => {
      if (attr !== "id" && data.params[attr] !== undefined) {
        payload[attr] = data.params[attr];
      }
    });
    let { updated, entry } = await gglassMenu.update(data.params.id, payload);
    data.response.updated = updated;
    if (updated) {
      data.response.entry = entry;
    }
  }
}

export class AdminMenuDelete extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a menu item";
    this.inputs = {
      id: { required: true },
    };
    this.outputExample = {};
  }

  async run(data) {
    data.response.deleted = false;
    await api.lowdb["menu"].read(); // Sync DB

    let { deleted } = await gglassMenu.delete(data.params.id);
    data.response.deleted = deleted;
  }
}
