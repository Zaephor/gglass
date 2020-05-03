<template>
  <q-drawer
    v-model="gglass.navDisplay"
    side="left"
    overlay
    behavior="desktop"
    bordered
  >
    <q-tabs v-model="navTab" align="justify">
      <q-tab
        name="menu"
        :icon="gglass.menuEditor ? 'settings' : 'home'"
        v-if="gglass.user !== false"
      />
      <q-tab name="profile" icon="person" />
    </q-tabs>
    <q-tab-panels v-model="navTab" animated>
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

          <template
            v-if="
              gglass.user !== false &&
              gglass.groups !== false &&
              gglass.groups.includes('admin')
            "
          >
            <q-separator />
            <admin-user />
            <admin-group />
            <q-separator />
            <admin-menu-editor />
            <admin-site-settings />
          </template>
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
  </q-drawer>
</template>

<script>
import { mapState, mapActions } from "vuex";
import MenuPanel from "../components/MenuPanel";
import UserAuth from "components/UserAuth";
import AdminUser from "components/AdminUser";
import AdminGroup from "components/AdminGroup";
import AdminMenuEditor from "components/AdminMenuEditor";
import AdminSiteSettings from "components/AdminSiteSettings";

export default {
  components: {
    MenuPanel,
    UserAuth,
    AdminUser,
    AdminGroup,
    AdminMenuEditor,
    AdminSiteSettings,
  },
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
    navTab: {
      get: function () {
        if (this.gglass.user === false) {
          return "profile";
        } else {
          return this.gglass.navTab;
        }
      },
      set: function (a) {
        this.setNavTab(a);
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions("gglass", [
      "toggleGlassNav", // -> this.toggleGlassNav()
      "gglassWhoami",
      "setNavTab",
    ]),
  },
  created: function () {
    this.gglassWhoami();
  },
};
</script>
