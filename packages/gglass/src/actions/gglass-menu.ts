import { Action, api } from "actionhero";

const commandPrefix = "menu:";

// TODO: Filter by user's group memberships

export class MenuList extends Action {
  constructor() {
    super();
    this.name = commandPrefix + "list";
    this.description = "List the nav menu";
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
        // Add element
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
