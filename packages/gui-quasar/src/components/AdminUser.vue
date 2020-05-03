<template>
  <!-- TODO: Cut out the create dialog from here, finish tinkering with AdminUserElement -->
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
            <q-btn round size="sm" icon="add" @click="editing = true" />
          </template>
        </q-input>

        <!-- TODO: Figure out how the heck to get the accordion to quit changing when I hit Edit  -->
        <q-tree :nodes="users" node-key="id" :filter="menuFilter">
          <template v-slot:default-header="prop">
            <!--            <q-icon :name="prop.node.icon" class="q-mr-sm" />-->
            <div>{{ prop.node.email }}</div>
            <q-space />
            <admin-user-element :element="prop.node" />
          </template>
        </q-tree>

        <!-- New user Dialog form -->
        <q-dialog v-model="editing" @before-show="syncGroups">
          <q-card style="width: 700px; max-width: 80vw;" class="q-pt-none">
            <q-form @submit="createUser">
              <q-card-section>
                <div class="text-h6">New User</div>
              </q-card-section>

              <q-card-section class="q-pt-none">
                <div class="q-gutter-md">
                  <q-input
                    filled
                    dense
                    v-model="create.email"
                    label="Email"
                    :rules="[
                      (val) =>
                        (val && val.length > 0) || 'Please enter something.',
                      (val) =>
                        /\S+@\S+\.\S+/.test(val) ||
                        'Please enter a valid email.',
                    ]"
                  />

                  <q-input
                    filled
                    dense
                    v-model="create.password"
                    label="Password"
                    type="password"
                    :rules="[
                      (val) =>
                        (val && val.length >= 8) ||
                        'Please use a password longer than 8 characters',
                    ]"
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
import AdminUserElement from "components/AdminUserElement";

export default {
  name: "AdminUser",
  components: { AdminUserElement },
  computed: {
    ...mapState({
      users: (state) => state.admin.users,
      groups: (state) => state.admin.groups,
    }),
  },
  data() {
    return {
      menuFilter: "",
      editing: false,
      create: {
        email: null,
        password: null,
        groups: [],
      },
    };
  },
  methods: {
    ...mapActions("admin", ["syncUsers", "syncGroups"]),
    resetFilter() {
      this.menuFilter = "";
      this.$refs.menuFilter.focus();
    },
    async createUser() {
      let createData = {};
      Object.keys(this.create).forEach((k) => {
        if (this.create[k] !== null) {
          createData[k] = this.create[k];
        }
      });
      await this.$actionhero.action("admin:user:create", createData);
      await this.syncUsers();
      await this.resetNewUser();
    },
    async resetNewUser() {
      this.create = {
        email: null,
        password: null,
        groups: [],
      };
    },
  },
  created: function () {
    this.resetNewUser();
  },
};
</script>
