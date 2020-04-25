<template>
  <q-list>
    <template v-for="(element, idx) in gglass.nav">
      <!-- Single Element -->
      <menu-element
        v-if="(!element.children || element.children.length === 0)"
        :key="idx"
        :element="element"
        type="root"
      />

      <!-- Root element -->
      <q-expansion-item
        :key="idx"
        v-if="element.children && element.children.length > 0"
      >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon :name="element.icon" />
          </q-item-section>

          <q-item-section>
            {{ element.label }}
          </q-item-section>
        </template>

        <!-- Child elements -->
        <template v-for="(subElement, subIdx) in element.children">
          <menu-element :key="subIdx" :element="subElement" type="child" />
        </template>
      </q-expansion-item>
    </template>
  </q-list>
</template>

<script>
import MenuElement from "components/MenuElement";
import { mapActions, mapState } from "vuex";

export default {
  name: "MenuPanel",
  components: {
    MenuElement,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
  },
  methods: {
    ...mapActions("gglass", ["syncNav"]),
  },
  created: function () {
    this.syncNav();
  },
};
</script>
