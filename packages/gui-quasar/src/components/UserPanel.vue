<template>
  <q-list>
    <user-auth />
    <user-admin />
    <site-admin />
  </q-list>
</template>

<script>
import UserAuth from "components/UserAuth";
import UserAdmin from "components/UserAdmin";
import SiteAdmin from "components/SiteAdmin";

export default {
  name: "UserPanel",
  components: {
    UserAuth,
    UserAdmin,
    SiteAdmin,
  },
};
</script>
