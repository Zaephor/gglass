<template>
  <div>
    <!-- Single Element -->
    <q-item
      :clickable="!!(element.path || element.url)"
      :inset-level="type !== 'root' ? 0.3 : 0"
      :tag="element.url ? 'a' : 'div'"
      :href="element.url ? element.url : undefined"
      :target="element.target ? element.target : undefined"
      :to="element.path ? element.path : undefined"
    >
      <q-item-section avatar>
        <q-icon :name="element.icon" />
      </q-item-section>

      <q-item-section>{{ element.label }}</q-item-section>
    </q-item>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "MenuElement",
  props: ["element", "type"],
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
  },
  methods: {},
  created: function () {},
};
</script>
