<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ element.id }}</q-item-label>
      <q-item-label caption>{{ element.group }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-toggle v-if="element.type === 'boolean'" v-model="element_value" />

      <q-btn
        v-if="element.type !== 'boolean'"
        round
        size="sm"
        icon="settings"
        @click="editing = true"
      />
    </q-item-section>

    <q-dialog v-model="editing">
      <q-card style="width: 700px; max-width: 80vw;" class="q-pt-none">
        <q-form @submit="submitUpdate">
          <q-card-section>
            <div class="text-h6">{{ element.id }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div class="q-gutter-md">
              <q-input
                filled
                dense
                v-model="element_value"
                :label="element.id"
              />
            </div>
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn
              flat
              color="red"
              label="Reset to Default"
              @click="resetChange"
              v-close-popup
            />
            <q-space />
            <div align="right">
              <q-btn flat type="submit" label="Save" v-close-popup />
              <q-btn flat label="Cancel" v-close-popup />
            </div>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-item>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "SettingsElement",
  props: ["element"],
  components: {},
  data() {
    return {
      editing: false,
      new_value: undefined,
    };
  },
  computed: {
    element_value: {
      get() {
        return this.element.value !== undefined
          ? this.element.value
          : this.element.default_value;
      },
      set(value) {
        if (this.element.type === "boolean") {
          this.updateSetting({ id: this.element.id, value });
          this.syncSettings();
        } else {
          this.new_value = value;
        }
      },
    },
  },
  methods: {
    ...mapActions("admin", ["syncSettings", "updateSetting", "resetSetting"]),
    submitUpdate() {
      this.updateSetting({ id: this.element.id, value: this.new_value });
      this.new_value = undefined;
    },
    resetChange() {
      this.resetSetting({ id: this.element.id });
      this.syncSettings();
      this.new_value = undefined;
    },
  },
};
</script>
