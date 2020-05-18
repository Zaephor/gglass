<template>
  <div>
    <q-btn round size="sm" icon="settings" @click="editing = true" />
    <!-- TODO: Make dialog visually prettier/organized -->
    <q-dialog v-model="editing" @before-show="loadEntry">
      <q-card style="width: 700px; max-width: 80vw;" class="q-pt-none">
        <q-form @submit="saveEntry">
          <q-card-section>
            <div class="text-h6">{{ element.id }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-gutter-md">
              <q-input filled dense v-model="element.id" label="id" disable />
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
                v-model="update.category"
                :options="menu"
                option-value="id"
                emit-value
                map-options
                options-dense
                label="Category"
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
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "AdminMenuEditorElement",
  props: ["element"],
  components: {},
  data() {
    return {
      editing: false,
      update: {
        label: null,
        order: null,
        icon: null,
        url: null,
        target: null,
        category: null,
        groups: [],
      },
    };
  },
  computed: {
    ...mapState({
      groups: (state) => state.admin.groups,
      menu: (state) => state.admin.menu,
    }),
  },
  methods: {
    ...mapActions("admin", ["syncMenu", "syncGroups"]),
    resetEntry() {
      this.update = {
        label: null,
        order: null,
        icon: null,
        url: null,
        target: null,
        category: null,
        groups: [],
      };
    },
    async loadEntry() {
      this.syncMenu();
      this.syncGroups();
      Object.keys(this.element).forEach((k) => {
        this.update[k] = this.element[k];
      });
    },
    async saveEntry() {
      let updateData = {
        id: this.element.id,
      };
      Object.keys(this.update).forEach((k) => {
        if (this.update[k] !== null) {
          updateData[k] = this.update[k];
        }
      });
      await this.$actionhero.action("admin:menu:update", updateData);
      this.syncMenu();
      this.resetEntry();
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
