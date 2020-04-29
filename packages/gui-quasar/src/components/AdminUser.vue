<template>
  <q-expansion-item
    expand-separator
    icon="person"
    label="Users"
    @before-show="syncUsers"
  >
    <q-card>
      <q-card-section>
        <!-- Tree display -->
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
        <q-tree :nodes="users" node-key="id" :filter="menuFilter">
          <template v-slot:default-header="prop">
            <!--            <q-icon :name="prop.node.icon" class="q-mr-sm" />-->
            <div>{{ prop.node.email }}</div>
            <q-space />

            <q-btn
              round
              size="sm"
              icon="settings"
              @click="entry.id = prop.node.id"
            />
          </template>
        </q-tree>

        <!-- Dialog form -->
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
                    disabled
                  />

                  <q-input
                    filled
                    dense
                    v-model="entry.email"
                    label="Email"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please enter something.',
                      (val) =>
                        /\S+@\S+\.\S+/.test(val) ||
                        'Please enter a valid email.',
                    ]"
                  />

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
                <div align="left">
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
  name: "AdminUser",
  computed: {
    ...mapState({
      users: (state) => state.admin.users,
      groups: (state) => state.admin.groups,
    }),
    editElement: {
      get: function () {
        return this.entry.id !== null;
      },
      set: function () {
        this.entry.id = null;
      },
    },
  },
  data() {
    return {
      menuFilter: "",
      entry: {},
    };
  },
  methods: {
    ...mapActions("admin", ["syncUsers", "syncGroups"]),
    resetFilter() {
      this.menuFilter = "";
      this.$refs.menuFilter.focus();
    },
    resetEntry() {
      this.entry = {
        id: null,
        email: null,
        groups: [],
      };
    },
    async loadEntry() {
      this.syncGroups();
      if (!!this.entry.id) {
        let results = await this.$actionhero.action("admin:user:list", {
          id: this.entry.id,
        });
        if (results.users && results.users.length === 1) {
          Object.keys(this.entry).forEach((attr) => {
            if (results.users[0][attr]) {
              this.entry[attr] = results.users[0][attr];
            }
          });
        } else {
          //TODO: error case
          console.log("//TODO: error case");
        }
      }
    },
    async createEntry() {
      await this.$actionhero.action("admin:user:upsert", this.entry);
      await this.syncUsers();
    },
    async deleteEntry() {
      this.$actionhero
        .action("admin:user:delete", { id: this.entry.id })
        .then(() => {
          this.syncUsers();
        });
    },
  },
  created: function () {
    this.resetEntry();
  },
};
</script>
