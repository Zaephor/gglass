<template>
  <q-expansion-item
    expand-separator
    icon="settings"
    label="Site Settings"
    @before-show="syncSettings"
  >
    <q-card>
      <q-card-section>
        <q-list>
          <template v-for="(element, idx) in settings">
            <admin-site-settings-element :key="idx" :element="element" />
          </template>
        </q-list>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AdminSiteSettingsElement from "components/AdminSiteSettingsElement";

export default {
  name: "SiteSettings",
  components: { AdminSiteSettingsElement },
  computed: {
    ...mapState({
      settings: (state) => state.admin.settings,
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions("admin", ["syncSettings"]),
  },
  created: function () {},
};
</script>
