<template>
  <q-expansion-item expand-separator icon="people" label="Groups">
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
  name: "AdminGroup",
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
