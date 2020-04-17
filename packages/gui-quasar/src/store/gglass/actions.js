export function toggleGlassNav({ commit }) {
  commit("toggleGlassNav");
}

export async function gglassWhoami({ commit }) {
  let Vue = this._vm;
  let result = await Vue.$actionhero.action("user:whoami", {});
  if (
    result.session !== false &&
    result.user !== false &&
    result.user.id !== false
  ) {
    // commit('updateProfile', { email: result.user.email, id: result.user.id })
    commit("updateProfile", result.user);
  } else {
    //TODO: Error popup, clear local cookies/sessions
    //if (result.error){} // TODO: If we got an error, display it
  }
}

export async function gglassRegister({ commit }, { email, password }) {
  let Vue = this._vm;
  let result = await Vue.$actionhero.action("user:register", {
    email,
    password,
  });
  if (result.created === false || result.error) {
    //TODO: Error popup
  } else {
    commit("updateProfile", result.user);
  }
}

export async function gglassLogin({ commit }, { email, password }) {
  let Vue = this._vm;
  let result = await Vue.$actionhero.action("user:login", { email, password });
  if (result.user === false || result.error) {
    //TODO: Error popup
  } else {
    commit("updateProfile", result.user);
  }
}

export function gglassLogout({ commit }) {
  let Vue = this._vm;
  Vue.$actionhero.action("user:logout", {});
  commit("clearProfile");
}
