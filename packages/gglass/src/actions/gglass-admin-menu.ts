import { Action, ActionProcessor } from "actionhero";
import { gglassMenu, inputs } from "../modules/gglass-menu";

const commandPrefix = "admin:menu:";

// Base action
abstract class AdminAction extends Action {
  user_groups = ["admin"];

  run(data: ActionProcessor<Action>): Promise<void> {
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
    data.response.menu = !!data.params.id
      ? await gglassMenu.listAll(data.params.id)
      : await gglassMenu.listAll();
  }
}

export class AdminMenuCreate extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "create";
    this.description = "create a menu item";
    this.inputs = inputs.menu("create");
    this.outputExample = {};
  }

  async run(data) {
    let payload = {};
    Object.keys(this.inputs).forEach((attr) => {
      if (attr !== "id" && data.params[attr] !== undefined) {
        payload[attr] = data.params[attr];
      }
    });
    let entry = await gglassMenu.create(payload);
    data.response.created = !!entry.id;
    if (data.response.created) {
      data.response.entry = entry;
    }
  }
}

export class AdminMenuUpdate extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "update";
    this.description = "Replace a menu item configuration";
    this.inputs = {
      id: { required: true },
      ...inputs.menu("update"),
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
    if (!!payload["parent"] && payload["parent"] === data.params.id) {
      delete payload["parent"];
    }
    let entry = await gglassMenu.replace(data.params.id, payload);
    data.response.updated = !!entry.id;
    if (data.response.updated) {
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
    data.response.deleted = await gglassMenu.delete(data.params.id);
  }
}
