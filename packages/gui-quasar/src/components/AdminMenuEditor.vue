<template>
  <q-expansion-item expand-separator icon="create" label="Menu Editor">
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
            <q-btn round size="sm" icon="add" @click="entry.id = 'new'" />
          </template>
        </q-input>

        <!-- TODO: Figure out how the heck to get the accordion to quit changing when I hit Edit  -->
        <q-tree :nodes="menu" node-key="id" :filter="menuFilter">
          <template v-slot:default-header="prop">
            <q-icon :name="prop.node.icon" class="q-mr-sm" />
            <div>{{ prop.node.label }}</div>
            <q-space />
            <q-btn
              round
              size="sm"
              icon="settings"
              @click="entry.id = prop.node.id"
            />
          </template>

          <!-- TODO: Make this prettier/more useful. Maybe a badge or something instead? -->
          <template v-slot:default-body="prop">
            <span>{{ prop.node.groups }}</span>
          </template>
        </q-tree>

        <q-dialog v-model="editElement" @hide="resetEntry">
          <q-card style="width: 700px; max-width: 80vw;" class="q-pt-none">
            <q-form @submit="createEntry" @reset="resetEntry">
              <q-card-section>
                <div class="text-h6">Add/Edit</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="q-gutter-md">
                  <q-input filled dense v-model="entry.id" label="id" disable />

                  <q-input filled dense v-model="entry.label" label="Name" />

                  <q-input filled dense v-model="entry.icon" label="Icon" />

                  <q-input filled dense v-model="entry.url" label="URL" />

                  <q-select
                    clearable
                    filled
                    dense
                    v-model="entry.target"
                    :options="['_blank']"
                    map-options
                    options-dense
                    label="Target"
                  />

                  <q-select
                    clearable
                    filled
                    dense
                    v-model="entry.parent"
                    :options="menu"
                    option-value="id"
                    emit-value
                    map-options
                    options-dense
                    label="Parent"
                  />

                  <!-- TODO: map to actual groups -->
                  <q-select
                    filled
                    v-model="entry.groups"
                    multiple
                    :options="['admin', 'user', 'guest', 'anon']"
                    counter
                    label="Groups"
                  />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <div align="left" v-if="entry.id !== 'new'">
                  <q-btn
                    flat
                    color="red"
                    label="Delete"
                    @click="deleteEntry"
                    v-close-popup
                  />
                </div>
                <q-space />
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

export default {
  name: "MenuEditor",
  components: {},
  data() {
    return {
      menuFilter: "",
      menu: [],
      entry: {},
    };
  },
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
    editElement: {
      get: function () {
        if (!!this.entry.id && this.entry.id !== "new") {
          this.loadEntry();
        }
        return !!this.entry.id;
      },
      set: function () {
        this.entry.id = !this.entry.id;
      },
    },
  },
  methods: {
    ...mapActions("gglass", []),
    async createEntry() {
      await this.$actionhero.action("admin:menu:upsert", this.entry);
      await this.syncMenu();
    },
    async loadEntry() {
      let results = await this.$actionhero.action("admin:menu:list", {
        id: this.entry.id,
      });
      if (results.menu && results.menu.length === 1) {
        Object.keys(this.entry).forEach((attr) => {
          if (results.menu[0][attr]) {
            this.entry[attr] = results.menu[0][attr];
          }
        });
      } else {
        //TODO: error case
        console.log("//TODO: error case");
      }
    },
    resetEntry() {
      this.entry = {
        id: null,
        label: null,
        order: null,
        icon: null,
        url: null,
        target: null,
        parent: null,
        groups: [],
      };
    },
    async deleteEntry() {
      this.$actionhero
        .action("admin:menu:delete", { id: this.entry.id })
        .then(() => {
          this.syncMenu();
        });
    },
    // q-tree filter reset
    resetFilter() {
      this.menuFilter = "";
      this.$refs.menuFilter.focus();
    },
    async syncMenu() {
      let results = await this.$actionhero.action("admin:menu:list", {});
      this.menu = results.menu;
    },
  },
  created: function () {
    this.resetEntry();
    // Shift this to only occur when menu executes show
    this.syncMenu();
  },
};
</script>
