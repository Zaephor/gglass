<!-- Should Cover UserLogin/UserRegistration and User's Own Profile Management -->
<template>
  <div>
    <!-- Login -->
    <q-expansion-item
      expand-separator
      icon="lock"
      label="Login"
      v-if="gglass.user === false && enabled.login"
      @before-show="syncEnabled"
    >
      <q-card>
        <q-card-section>
          <q-form
            @submit="userLogin"
            @reset="login = { email: null, password: null }"
            class="q-gutter-sm"
            ref="loginForm"
          >
            <q-input
              filled
              dense
              bottom-slots
              v-model="login.email"
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
              v-model="login.password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
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
                <q-btn push label="Login" type="submit" size="sm" />
              </q-btn-group>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Register -->
    <q-expansion-item
      expand-separator
      icon="create"
      label="Register"
      v-if="gglass.user === false && enabled.register"
      @before-show="syncEnabled"
    >
      <q-card>
        <q-card-section>
          <q-form
            @submit="userRegister"
            @reset="register = { email: null, password: null }"
            class="q-gutter-sm"
            ref="registerForm"
          >
            <q-input
              filled
              dense
              bottom-slots
              v-model="register.email"
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
              v-model="register.password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
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
                <q-btn push label="Register" type="submit" size="sm" />
              </q-btn-group>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Gauth Button -->
    <q-item
      clickable
      v-ripple
      v-if="gglass.user === false && enabled.gauth_login"
      tag="a"
      href="/api?action=user:google:auth"
    >
      <q-item-section avatar>
        <!--        <q-avatar icon="lock" />-->
        <!-- TODO: Put in a proper Google icon here -->
      </q-item-section>

      <q-item-section>
        <q-item-label>Google</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon name="lock" />
      </q-item-section>
    </q-item>

    <!--  User Profile/etc section  -->
    <!-- TODO: Make prettier -->
    <!-- TODO: Add flow for user to delete self -->
    <template v-if="gglass.user !== false">
      <q-expansion-item
        expand-separator
        icon="face"
        label="User Profile"
        @before-show="gglassWhoami"
      >
        <user-profile :user="gglass.user" />
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
import UserProfile from "components/UserProfile";

export default {
  name: "Auth",
  components: {
    UserProfile,
  },
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
  },
  data() {
    return {
      isPwd: true,
      login: {
        email: null,
        password: null,
      },
      register: {
        email: null,
        password: null,
      },
      enabled: {
        login: false,
        register: false,
        gauth_login: false,
        gauth_register: false,
      },
    };
  },
  methods: {
    ...mapActions("gglass", [
      "gglassRegister",
      "gglassLogin",
      "gglassWhoami",
      "gglassLogout",
    ]),
    userRegister: async function (event) {
      let valid = await this.$refs.registerForm.validate();
      if (valid) {
        await this.gglassRegister({
          email: this.register.email,
          password: this.register.password,
        });

        if (this.gglass.user !== false) {
          this.register.email = null;
        }
        this.register.password = null;
      }
    },
    userLogin: async function () {
      let valid = await this.$refs.loginForm.validate();
      if (valid) {
        await this.gglassLogin({
          email: this.login.email,
          password: this.login.password,
        });
        if (this.gglass.user !== false) {
          this.login.email = null;
        }
        this.login.password = null;
      }
    },
    syncEnabled: async function () {
      let result = await this.$actionhero.action("user:enabled", {});
      Object.keys(this.enabled).forEach((k) => {
        this.enabled[k] = result[k];
      });
    },
  },
  created: function () {
    this.gglassWhoami();
    this.syncEnabled();
  },
};
</script>
