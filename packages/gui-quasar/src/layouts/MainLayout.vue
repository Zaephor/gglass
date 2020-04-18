<template>
  <q-layout view="hHh LpR fff">
    <q-header class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="apps" @click="toggleGlassNav" />

        <q-toolbar-title @click="toggleGlassNav">
          gglass
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <navbar-layout />

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
  methods: {
    ...mapActions("gglass", [
      "toggleGlassNav", // -> this.toggleGlassNav()
    ]),
  },
};
</script>
