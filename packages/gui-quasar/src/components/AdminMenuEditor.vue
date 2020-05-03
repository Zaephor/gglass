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
            <q-btn round size="sm" icon="add" @click="editing = true" />
          </template>
        </q-input>

        <!-- TODO: Figure out how the heck to get the accordion to quit changing when I hit Edit  -->
        <q-tree :nodes="menu" node-key="id" :filter="menuFilter">
          <template v-slot:default-header="prop">
            <q-icon :name="prop.node.icon" class="q-mr-sm" />
            <div>{{ prop.node.label }}</div>
            <q-space />

            <admin-menu-editor-element :element="prop.node" />
          </template>
        </q-tree>

        <!-- New entry dialog -->
        <q-dialog v-model="editing" @before-show="loadEntry">
          <q-card style="width: 700px; max-width: 80vw;" class="q-pt-none">
            <q-form @submit="createEntry">
              <q-card-section>
                <div class="text-h6">New Menu Entry</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="q-gutter-md">
                  <q-input filled dense v-model="create.label" label="Label" />
                  <q-input filled dense v-model="create.icon" label="Icon" />
                  <q-input filled dense v-model="create.url" label="URL" />

                  <q-select
                    clearable
                    filled
                    dense
                    v-model="create.target"
                    :options="['_blank']"
                    map-options
                    options-dense
                    label="Target"
                  />

                  <q-select
                    clearable
                    filled
                    dense
                    v-model="create.parent"
                    :options="menu"
                    option-value="id"
                    emit-value
                    map-options
                    options-dense
                    label="Parent"
                  />

                  <q-select
                    filled
                    dense
                    v-model="create.groups"
                    multiple
                    :options="groups"
                    option-label="id"
                    option-value="id"
                    emit-value
                    map-options
                    options-dense
                    counter
                    label="Groups"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <div align="right">
                  <q-btn flat type="submit" label="Save" v-close-popup />
                  <q-btn flat label="Cancel" v-close-popup />
                </div>
              </q-card-actions>
            </q-form>
          </q-card>
        </q-dialog>
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
      editing: false,
      create: {},
    };
  },
  computed: {
    ...mapState({
      groups: (state) => state.admin.groups,
      menu: (state) => state.admin.menu,
    }),
  },
  methods: {
    ...mapActions("admin", ["syncUsers", "syncGroups", "syncMenu"]),
    async createEntry() {
      let createData = {};
      Object.keys(this.create).forEach((k) => {
        if (this.create[k] !== null) {
          createData[k] = this.create[k];
        }
      });
      await this.$actionhero.action("admin:menu:create", createData);
      await this.syncMenu();
    },
    async loadEntry() {
      this.resetEntry();
      this.syncMenu();
      this.syncGroups();
    },
    async deleteEntry() {
      this.$actionhero
        .action("admin:menu:delete", { id: this.entry.id })
        .then(() => {
          this.syncMenu();
        });
    },
    resetEntry() {
      this.create = {
        id: null,
        label: null,
        order: null,
        icon: null,
        url: null,
        target: null,
        parent: "",
        groups: [],
      };
    },
    // q-tree filter reset
    resetFilter() {
      this.menuFilter = "";
      this.$refs.menuFilter.focus();
    },
  },
  created: function () {
    this.resetEntry();
  },
};
</script>
