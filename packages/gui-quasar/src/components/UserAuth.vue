<!-- Should Cover UserLogin/UserRegistration and User's Own Profile Management -->
<template>
  <div>
    <!--  Registration and login section  -->
    <q-expansion-item
      expand-separator
      icon="create"
      label="Register/Login"
      v-if="gglass.user === false"
    >
      <q-card>
        <q-card-section>
          <q-form
            @submit="userLogin"
            @reset="userReset"
            class="q-gutter-sm"
            ref="loginForm"
          >
            <q-input
              filled
              dense
              bottom-slots
              name="userEmail"
              v-model="userEmail"
              label="Email"
              :rules="[
                (val) => (val && val.length > 0) || 'Please enter something.',
                (val) =>
                  /\S+@\S+\.\S+/.test(val) || 'Please enter a valid email.',
              ]"
            />

            <q-input
              filled
              dense
              name="userPassword"
              v-model="userPassword"
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              :rules="[
                (val) =>
                  (val && val.length >= 8) ||
                  'Please use a password longer than 8 characters',
              ]"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>

            <div align="right">
              <q-btn-group push>
                <q-btn
                  push
                  label="Reset"
                  type="reset"
                  size="sm"
                  tabindex="-1"
                />
                <q-btn
                  push
                  label="Register"
                  v-on:click="userRegister"
                  size="sm"
                  tabindex="-1"
                />
                <q-btn
                  push
                  label="Login"
                  type="submit"
                  name="login"
                  size="sm"
                />
              </q-btn-group>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!--  User Profile/etc section  -->
    <template v-if="gglass.user !== false">
      <q-expansion-item expand-separator icon="face" label="User Profile">
        <q-card>
          <q-card-section>
            {{ gglass.user.id }}
            {{ gglass.user.email }}
            {{ gglass.groups }}
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-item clickable v-ripple v-on:click="gglassLogout">
        <q-item-section avatar>
          <q-icon name="eject" />
        </q-item-section>
        <q-item-section>Logout</q-item-section>
      </q-item>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "UserPanel",
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
  },
  data() {
    return {
      isPwd: true,
      userEmail: null,
      userPassword: null,
    };
  },
  methods: {
    ...mapActions("gglass", [
      "toggleGlassNav", // -> this.toggleGlassNav()
      "setNavTab",
      "gglassRegister",
      "gglassLogin",
      "gglassWhoami",
      "gglassLogout",
    ]),
    userRegister: async function (event) {
      let valid = await this.$refs.loginForm.validate();
      if (valid) {
        await this.gglassRegister({
          email: this.userEmail,
          password: this.userPassword,
        });

        if (this.gglass.user !== false) {
          this.userEmail = null;
        }
        this.userPassword = null;
      }
    },
    userLogin: async function () {
      await this.gglassLogin({
        email: this.userEmail,
        password: this.userPassword,
      });
      if (this.gglass.user !== false) {
        this.userEmail = null;
      }
      this.userPassword = null;
    },
    userReset: function () {
      this.userEmail = null;
      this.userPassword = null;
    },
  },
  created: function () {
    this.gglassWhoami();
  },
};
</script>
