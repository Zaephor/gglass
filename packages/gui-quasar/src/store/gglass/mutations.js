// export function someMutation (/* state */) {
// }
export function toggleGlassNav(state) {
  state.navDisplay = !state.navDisplay;
}

export function updateProfile(state, data) {
  if (data.email && data.id) {
    state.user = {
      id: data.id,
      email: data.email,
    };
  }
  if (data.groups && data.groups.length > 0) {
    state.groups = data.groups;
  }
}

export function clearProfile(state) {
  state.user = false;
  state.groups = false;
}
