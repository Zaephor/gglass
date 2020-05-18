import { Action } from "actionhero";
import { gglassMenu } from "../modules/gglass-menu";

const commandPrefix = "menu:";

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
    // data.response.menu = await gglassMenu.listFiltered(data.user.groups);
    // TODO: Check GUI about lazyload and rewrite this for category+menu rather than recursive menu
    data.response.menu = await gglassMenu.list();
  }
}
