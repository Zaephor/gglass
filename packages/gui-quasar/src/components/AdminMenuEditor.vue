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
            <q-btn round size="sm" icon="add" @click="entry.id = ''" />
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
          <!--          <template v-slot:default-body="prop">-->
          <!--            <span>{{ prop.node.groups }}</span>-->
          <!--            <q-badge :label="(!!prop.node.groups)?prop.node.groups.length:0"/>-->
          <!--          </template>-->
        </q-tree>

        <q-dialog
          v-model="editElement"
          @hide="resetEntry"
          @before-show="loadEntry"
        >
          <q-card style="width: 700px; max-width: 80vw;" class="q-pt-none">
            <q-form @submit="createEntry" @reset="resetEntry">
              <q-card-section>
                <div class="text-h6">Add/Edit</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="q-gutter-md">
                  <q-input filled dense v-model="entry.id" label="id" disable />

                  <q-input filled dense v-model="entry.label" label="Label" />

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
                    dense
                    v-model="entry.groups"
                    multiple
                    :options="groups"
                    option-label="label"
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
      entry: {},
    };
  },
  computed: {
    ...mapState({
      groups: (state) => state.admin.groups,
      menu: (state) => state.admin.menu,
    }),
    editElement: {
      get: function () {
        // if (!!this.entry.id) {
        //   this.syncGroups();
        //   if (this.entry.id !== "new") {
        //     this.loadEntry();
        //   }
        // }
        // return !!this.entry.id;
        return this.entry.id !== null;
      },
      set: function () {
        this.entry.id = null;
      },
    },
  },
  methods: {
    ...mapActions("admin", ["syncUsers", "syncGroups", "syncMenu"]),
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
    async deleteEntry() {
      this.$actionhero
        .action("admin:menu:delete", { id: this.entry.id })
        .then(() => {
          this.syncMenu();
        });
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
