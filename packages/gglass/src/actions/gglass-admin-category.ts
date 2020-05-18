import { Action, ActionProcessor } from "actionhero";
import { gglassCategory, inputs } from "../modules/gglass-menu";

const commandPrefix = "admin:category:";

// Base action
abstract class AdminAction extends Action {
  user_groups = ["admin"];

  run(data: ActionProcessor): Promise<void> {
    return Promise.resolve(undefined);
  }
}

// Admin category actions
export class AdminCategoryList extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "List nav categories";
    this.inputs = {
      id: { required: false },
    };
    this.outputExample = {
      categories: [
        {
          id: "6730b403-1d82-4617-94b9-605340198f3d",
          label: "Alpha",
          icon: "cloud",
        },
        {
          id: "bbc0accf-8b9b-4fce-8b04-0f0a6cc728f8",
          label: "Beta",
          icon: "security",
          groups: [],
        },
      ],
    };
  }

  async run(data) {
    data.response.categories = !!data.params.id
      ? await gglassCategory.list(data.params.id)
      : await gglassCategory.list();
  }
}

export class AdminCategoryCreate extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "create";
    this.description = "create a category";
    this.inputs = inputs.category("create");
    this.outputExample = {
      created: true,
      category: {
        id: "bbc0accf-8b9b-4fce-8b04-0f0a6cc728f8",
        label: "Beta",
        icon: "security",
        groups: [],
      },
    };
  }

  async run(data) {
    let payload = {};
    Object.keys(this.inputs).forEach((attr) => {
      if (attr !== "id" && data.params[attr] !== undefined) {
        payload[attr] = data.params[attr];
      }
    });
    let entry = await gglassCategory.create(payload);
    data.response.created = !!entry.id;
    if (data.response.created) {
      data.response.category = entry;
    }
  }
}

export class AdminCategoryUpdate extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "update";
    this.description = "Update a category";
    this.inputs = {
      id: { required: true },
      ...inputs.category("update"),
    };
    this.outputExample = {
      updated: true,
      category: {
        id: "bbc0accf-8b9b-4fce-8b04-0f0a6cc728f8",
        label: "Beta",
        icon: "security",
        groups: [],
      },
    };
  }

  async run(data) {
    let payload = {};
    Object.keys(this.inputs).forEach((attr) => {
      if (attr !== "id" && data.params[attr] !== undefined) {
        payload[attr] = data.params[attr];
      }
    });
    let entry = await gglassCategory.replace(data.params.id, payload);
    data.response.updated = !!entry.id;
    if (data.response.created) {
      data.response.category = entry;
    }
  }
}

export class AdminCategoryDelete extends AdminAction {
  constructor() {
    super();
    this.name = commandPrefix + "delete";
    this.description = "Delete a category";
    this.inputs = {
      id: { required: true },
    };
    this.outputExample = {};
  }

  async run(data) {
    data.response.deleted = await gglassCategory.delete(data.params.id);
  }
}
