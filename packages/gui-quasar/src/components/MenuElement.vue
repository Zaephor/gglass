<template>
  <div>
    <!-- Single Element -->
    <q-item
      :clickable="!!(element.path || element.href)"
      :inset-level="type !== 'root' ? 0.3 : 0"
      :tag="href ? 'a' : 'div'"
      :to="to"
      :href="href"
      :target="element.target ? element.target : 'iframe'"
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
    href() {
      return this.element.target === "_blank" ? this.element.url : undefined;
    },
    to() {
      if (this.target === "_blank") {
        return undefined;
      } else {
        return !!this.element.parent
          ? "/" + this.element.parent + "/" + this.element.id
          : "/" + this.element.id;
      }
    },
  },
  methods: {},
  created: function () {},
};
</script>
