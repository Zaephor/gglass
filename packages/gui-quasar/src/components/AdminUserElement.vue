<template>
  <div>
    <q-btn round size="sm" icon="settings" @click="editing = true" />
    <q-dialog v-model="editing" @before-show="loadUser">
      <q-card style="width: 700px; max-width: 80vw;" class="q-pt-none">
        <q-form @submit="saveUser">
          <q-card-section>
            <div class="text-h6">{{ element.id }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-gutter-md">
              <q-input filled dense v-model="element.id" label="id" disable />

              <q-input
                filled
                dense
                v-model="update.email"
                label="Email"
                :rules="[
                  (val) => (val && val.length > 0) || 'Please enter something.',
                  (val) =>
                    /\S+@\S+\.\S+/.test(val) || 'Please enter a valid email.',
                ]"
              />

              <!-- TODO: Add back the validation here, allow null OR >8 chars -->
              <q-input
                filled
                dense
                v-model="update.password"
                label="Password"
                type="password"
                :rules="[
                  (val) =>
                    !val ||
                    (!!val && val.length === 0) ||
                    (val && val.length >= 8) ||
                    'Please use a password longer than 8 characters',
                ]"
              />

              <q-select
                filled
                dense
                v-model="update.groups"
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
            <div align="left">
              <q-btn
                flat
                color="red"
                label="Delete"
                @click="deleteUser"
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
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "AdminUserElement",
  props: ["element"],
  components: {},
  data() {
    return {
      editing: false,
      update: {
        email: null,
        password: null,
        groups: [],
      },
    };
  },
  computed: {
    ...mapState({
      groups: (state) => state.admin.groups,
    }),
  },
  methods: {
    ...mapActions("admin", ["syncUsers", "syncGroups"]),
    async something(val) {
      console.log({ val });
    },
    async loadUser() {
      this.syncGroups();
      this.update.email = this.element.email;
      this.update.password = null;
      this.update.groups = this.element.groups;
    },
    async saveUser() {
      let updateData = {
        id: this.element.id,
      };
      Object.keys(this.update).forEach((k) => {
        if (this.update[k] !== null) {
          updateData[k] = this.update[k];
        }
      });
      await this.$actionhero.action("admin:user:update", updateData);
      this.syncUsers();
    },
    async deleteUser() {
      await this.$actionhero.action("admin:user:delete", {
        id: this.element.id,
      });
      this.syncUsers();
    },
  },
};
</script>
