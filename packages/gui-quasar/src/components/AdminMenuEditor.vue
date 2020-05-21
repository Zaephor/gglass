<template>
  <q-expansion-item
    expand-separator
    icon="create"
    label="Menu Editor"
    @before-show="syncMenu"
  >
    <q-card>
      <q-card-section>
        <q-input
          ref="menuFilter"
          filled
          v-model="menuFilter"
          label="Filter"
          dense
        >
          <template v-slot:append>
            <q-icon
              v-if="menuFilter !== ''"
              name="clear"
              class="cursor-pointer"
              @click="resetFilter"
            />
          </template>
          <template v-slot:after>
            <admin-menu-editor-element :element="{}" />
          </template>
        </q-input>

        <!-- TODO: Figure out how the heck to get the accordion to quit changing when I hit Edit buttons -->
        <q-tree :nodes="menu" node-key="id" :filter="menuFilter">
          <template v-slot:default-header="prop">
            <q-icon :name="prop.node.icon" class="q-mr-sm" />
            <div>{{ prop.node.label }}</div>
            <q-space />

            <admin-menu-editor-element :element="prop.node" />
          </template>
        </q-tree>
      </q-card-section>
    </q-card>
  </q-expansion-item>
</template>

<script>
import { mapActions, mapState } from "vuex";
import AdminMenuEditorElement from "components/AdminMenuEditorElement";

export default {
  name: "MenuEditor",
  components: {
    AdminMenuEditorElement,
  },
  data() {
    return {
      menuFilter: "",
    };
  },
  computed: {
    ...mapState({
      menu: (state) => state.admin.menu,
    }),
  },
  methods: {
    ...mapActions("admin", ["syncMenu"]),
    // q-tree filter reset
    resetFilter() {
      this.menuFilter = "";
      this.$refs.menuFilter.focus();
    },
  },
  created: function () {},
};
</script>
