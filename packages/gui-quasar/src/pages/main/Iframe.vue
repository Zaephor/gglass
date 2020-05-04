<template>
  <q-page class="flex">
    <iframe
      allowfullscreen="true"
      frameborder="0"
      name="iframe"
      :id="iframe.id"
      :src="iframe.src"
      sandbox="allow-presentation allow-forms allow-same-origin allow-pointer-lock allow-scripts allow-popups allow-modals allow-top-navigation"
      scrolling="auto"
    />
  </q-page>
</template>

<style scoped>
iframe {
  position: relative;
  border: none;
  width: 100%;
  /*height: 100%;*/
}
</style>

<script>
import { mapState } from "vuex";

export default {
  name: "Iframe",
  data() {
    return {
      iframe: {
        id: null,
        src: null,
      },
    };
  },
  watch: {
    "$route.params.id": function () {
      this.updateIframe();
    },
    "$route.params.childId": function () {
      this.updateIframe();
    },
  },
  computed: {
    ...mapState({
      nav: (state) => state.gglass.nav,
    }),
  },
  methods: {
    updateIframe() {
      let entry = null;
      if (this.nav.length > 0) {
        if (this.$route.params.id) {
          entry = this.nav.find((ele) => ele.id === this.$route.params.id);
        }
        if (this.$route.params.childId && !!entry.children) {
          entry = entry.children.find(
            (ele) => ele.id === this.$route.params.childId
          );
        }
        this.iframe.id = entry.id;
        this.iframe.src = entry.url;
      } else {
        // TODO: Proper error case of iframe page when user is not logged in
        console.log({ nav: this.nav });
      }
    },
  },
  created: function () {
    this.updateIframe();
  },
};
</script>
