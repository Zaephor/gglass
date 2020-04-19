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

      <q-item>
        <q-item-section avatar>
          <q-icon name="create" />
        </q-item-section>
        <q-item-section>Menu Editor</q-item-section>
        <q-item-section side>
          TODO
        </q-item-section>
      </q-item>

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

export default {
  name: "SiteAdmin",
  components: {},
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
