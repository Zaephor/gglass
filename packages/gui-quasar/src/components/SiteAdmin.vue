<template>
  <div>
    <template
      v-if="
        gglass.user !== false &&
        gglass.groups !== false &&
        gglass.groups.includes('admin')
      "
    >
      <q-separator />

      <q-expansion-item
        expand-separator
        default-opened
        icon="create"
        label="Menu Editor"
      >
        <q-card>
          <q-card-section>
            <admin-menu-editor />
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item expand-separator icon="settings" label="Site Settings">
        <q-card>
          <q-card-section>
            TODO
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AdminMenuEditor from "components/AdminMenuEditor";

export default {
  name: "SiteAdmin",
  components: {
    AdminMenuEditor,
  },
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions("gglass", []),
  },
  created: function () {},
};
</script>
