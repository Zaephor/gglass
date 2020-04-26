<template>
  <q-expansion-item expand-separator icon="settings" label="Site Settings">
    <q-card>
      <q-card-section>
        TODO
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "SiteSettings",
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
