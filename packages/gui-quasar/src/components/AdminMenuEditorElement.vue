<template>
  <div>
    <q-btn round size="sm" icon="settings" @click="editing = true" />
    <!-- TODO: Make dialog visually prettier/organized -->
    <q-dialog v-model="editing" @before-show="loadEntry">
      <q-card style="width: 700px; max-width: 80vw;" class="q-pt-none">
        <q-form @submit="saveEntry">
          <q-card-section>
            <div class="text-h6" v-if="!!element.id">
              Menu Element ({{ element.id }})
            </div>
            <div class="text-h6" v-if="!element.id">New Element</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-gutter-md">
              <q-input
                filled
                dense
                v-model="element.id"
                label="id"
                disable
                v-if="!!element.id"
              />
              <q-input filled dense v-model="update.label" label="Label" />
              <q-input filled dense v-model="update.icon" label="Icon" />
              <q-input filled dense v-model="update.url" label="URL" />
              <q-input
                filled
                dense
                v-model.number="update.sortorder"
                label="Sort Order"
                type="number"
              />

              <q-select
                filled
                dense
                v-model="update.target"
                :options="['iframe', '_blank']"
                map-options
                options-dense
                label="Target"
              />

              <q-select
                clearable
                filled
                dense
                v-model="update.parent"
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
                v-if="!!element.id"
                flat
                color="red"
                label="Delete"
                @click="deleteEntry"
                v-close-popup="2"
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
  name: "AdminMenuEditorElement",
  props: ["element", "preset"],
  components: {},
  data() {
    return {
      editing: false,
      update: {
        id: null,
        label: null,
        sortorder: null,
        icon: null,
        url: null,
        target: null,
        parent: null,
        groups: [],
      },
    };
  },
  computed: {
    ...mapState({
      menu: (state) => state.admin.menu,
      groups: (state) => state.admin.groups,
    }),
  },
  methods: {
    ...mapActions("admin", ["syncMenu", "syncGroups"]),
    resetEntry() {
      this.update = {
        id: null,
        label: null,
        sortorder: null,
        icon: null,
        url: null,
        target: null,
        parent: null,
        groups: [],
      };
    },
    async loadEntry() {
      this.syncGroups();
      Object.keys(this.element).forEach((k) => {
        this.update[k] = this.element[k];
      });
    },
    async saveEntry() {
      let payload = {};
      Object.keys(this.update).forEach((k) => {
        if (this.update[k] !== null) {
          payload[k] = this.update[k];
        }
      });
      if (!!this.element.id) {
        await this.$actionhero.action("admin:menu:update", payload);
      } else {
        await this.$actionhero.action("admin:menu:create", payload);
      }
      this.resetEntry();
      this.syncMenu();
    },
    async deleteEntry() {
      this.$actionhero
        .action("admin:menu:delete", { id: this.element.id })
        .then(() => {
          this.syncMenu();
        });
    },
  },
};
</script>
