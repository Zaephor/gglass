export async function syncUsers({ commit }) {
  let Vue = this._vm;
  let result = await Vue.$actionhero.action("admin:user:list", {});
  if (!!result.users) {
    commit("syncUsers", result.users);
  } else {
    commit("syncUsers", []);
  }
}

export async function syncGroups({ commit }) {
  let Vue = this._vm;
  let result = await Vue.$actionhero.action("admin:group:list", {});
  if (!!result.groups) {
    commit("syncGroups", result.groups);
  } else {
    commit("syncGroups", []);
  }
}

export async function syncMenu({ commit }) {
  let Vue = this._vm;
  let result = await Vue.$actionhero.action("admin:menu:list", {});
  if (!!result.menu) {
    commit("syncMenu", result.menu);
  } else {
    commit("syncMenu", []);
  }
}
