<template>
  <div>
    <!-- Single Element -->
    <q-item
      :clickable="!!(element.path || element.url)"
      :inset-level="type !== 'root' ? 0.3 : 0"
      :tag="url ? 'a' : 'div'"
      :to="to"
      :href="url"
      :target="element.target ? element.target : undefined"
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
    url() {
      return !(!!this.element.url && this.element.url.startsWith("/"))
        ? this.element.url
        : undefined;
    },
    to() {
      return !!this.element.url && this.element.url.startsWith("/")
        ? this.element.url
        : undefined;
    },
  },
  methods: {},
  created: function () {},
};
</script>
