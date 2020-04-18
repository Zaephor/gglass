<template>
  <q-drawer
    v-model="gglass.navDisplay"
    side="left"
    overlay
    behavior="desktop"
    bordered
  >
    <q-tabs v-model="tabNav" align="justify">
      <q-tab name="menu" icon="home" v-if="gglass.user !== false" />
      <q-tab name="profile" icon="person" />
    </q-tabs>
    <q-tab-panels v-model="tabNav" animated>
      <q-tab-panel
        name="menu"
        icon="home"
        class="q-pa-none"
        v-if="gglass.user !== false"
      >
        <menu-panel />
      </q-tab-panel>
      <q-tab-panel name="profile" icon="person" class="q-pa-none">
        <q-list>
          <user-auth />
          <user-admin />
          <site-admin />
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-drawer>
</template>

<script>
import MenuPanel from "../components/MenuPanel";
import { mapState, mapActions } from "vuex";
import UserAuth from "components/UserAuth";
import UserAdmin from "components/UserAdmin";
import SiteAdmin from "components/SiteAdmin";

export default {
  components: {
    MenuPanel,
    UserAuth,
    UserAdmin,
    SiteAdmin,
  },
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
  },
  data() {
    return {
      tabNav: "profile",
    };
  },
  methods: {
    ...mapActions("gglass", [
      "toggleGlassNav", // -> this.toggleGlassNav()
      "gglassWhoami",
    ]),
  },
  created: function () {
    this.gglassWhoami();
  },
};
</script>
