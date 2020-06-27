<template>
  <q-card>
    <q-card-section>
      <q-form
        @submit="userUpdate"
        @reset="userReset"
        class="q-gutter-sm"
        ref="updateForm"
      >
        <q-input
          color="teal"
          filled
          v-model="update.email"
          label="Email"
          :rules="[
            (val) => (val && val.length > 0) || 'Please enter something.',
            (val) => /\S+@\S+\.\S+/.test(val) || 'Please enter a valid email.',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input
          color="teal"
          filled
          v-model="update.password"
          label="Current Password"
          :rules="[(val) => !!val || 'Field is required']"
        >
          <template v-slot:prepend>
            <q-icon name="shield" />
          </template>
        </q-input>

        <q-input
          color="teal"
          filled
          v-model="update.new_password"
          label="New Password"
          :rules="[
            (val) =>
              (val && val.length >= 8) ||
              'Please use a password longer than 8 characters',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
        </q-input>

        <div align="right">
          <q-btn-group push>
            <q-btn push label="Reset" type="reset" size="sm" tabindex="-1" />
            <q-btn push label="Update" type="submit" size="sm" />
          </q-btn-group>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "UserProfile",
  props: ["user"],
  data() {
    return {
      update: {
        password: null,
        email: null,
        new_password: null,
      },
    };
  },
  computed: {},
  methods: {
    ...mapActions("gglass", ["gglassUpdate"]),
    userUpdate: async function (event) {
      let valid = await this.$refs.updateForm.validate();
      console.log({ valid });
      if (valid) {
        await this.gglassUpdate({
          email: this.update.email,
          password: this.update.password,
          new_password: this.update.new_password,
        });
        this.userReset();
      }
    },
    userReset() {
      this.update = {
        email: this.user.email,
        password: null,
        new_password: null,
      };
    },
  },
  created: function () {
    this.update.email = this.user.email;
  },
};
</script>
