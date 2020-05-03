<template>
  <q-layout view="hHh LpR fff">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="apps"
          @click="navBarDisplay = !navBarDisplay"
        />

        <q-toolbar-title @click="navBarDisplay = !navBarDisplay">
          gglass
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="navBarDisplay"
      side="left"
      overlay
      behavior="desktop"
      bordered
    >
      <navbar-layout />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapActions } from "vuex";
import NavbarLayout from "./NavbarLayout";

export default {
  components: {
    NavbarLayout,
  },
  data() {
    return {
      navBarDisplay: true,
    };
  },
  methods: {
    ...mapActions("gglass", []),
  },
};
</script>
