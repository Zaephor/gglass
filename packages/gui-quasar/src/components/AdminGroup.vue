<template>
  <q-expansion-item
    expand-separator
    icon="people"
    label="Groups"
    @before-show="syncGroups"
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
        <q-tree :nodes="groups" node-key="id" :filter="menuFilter">
          <template v-slot:default-header="prop">
            <q-icon :name="prop.node.icon" class="q-mr-sm" />
            <div>{{ prop.node.id }}</div>
            <q-space />

            <q-btn
              round
              size="sm"
              icon="settings"
              @click="entry.id = prop.node.id"
            />
          </template>
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
                  <q-input
                    filled
                    dense
                    v-model="entry.id"
                    label="id"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please enter something.',
                      (val) =>
                        /^[a-zA-Z0-9_-]*$/.test(val) ||
                        'Letters, Numbers or dashes only please',
                      (val) =>
                        (val && val.length <= 16) ||
                        'Could we make this short? Preferably under 16 characters.',
                    ]"
                  />

                  <!--                  <q-input filled dense v-model="entry.label" label="Label" />-->

                  <q-input filled dense v-model="entry.icon" label="Icon" />
                </div>
              </q-card-section>

              <q-card-actions align="right" class="text-primary">
                <div align="left" v-if="entry.id !== 'new' && entry.id !== ''">
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
  name: "AdminGroup",
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
      groups: (state) => state.admin.groups,
    }),
    editElement: {
      get: function () {
        return this.entry.id !== null;
      },
      set: function () {
        // this.entry.id = !this.entry.id;
        this.entry.id = null;
      },
    },
  },
  data() {
    return {
      menuFilter: "",
      entry: {},
      type: "",
    };
  },
  methods: {
    ...mapActions("admin", ["syncGroups"]),
    resetFilter() {
      this.menuFilter = "";
      this.$refs.menuFilter.focus();
    },
    resetEntry() {
      this.entry = {
        id: null,
        icon: null,
      };
    },
    async loadEntry() {
      if (!!this.entry.id) {
        let results = await this.$actionhero.action("admin:group:list", {
          id: this.entry.id,
        });
        if (results.groups && results.groups.length === 1) {
          Object.keys(this.entry).forEach((attr) => {
            if (results.groups[0][attr]) {
              this.entry[attr] = results.groups[0][attr];
            }
          });
        } else {
          //TODO: error case
          console.log("//TODO: error case");
        }
      }
    },
    async createEntry() {
      await this.$actionhero.action("admin:group:upsert", this.entry);
      await this.syncGroups();
    },
    async deleteEntry() {
      this.$actionhero
        .action("admin:group:delete", { id: this.entry.id })
        .then(() => {
          this.syncGroups();
        });
    },
  },
  created: function () {
    this.resetEntry();
  },
};
</script>
