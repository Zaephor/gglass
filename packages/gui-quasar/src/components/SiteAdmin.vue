<template>
  <div>
    <template
      v-if="
        gglass.user !== false &&
        gglass.groups !== false &&
        gglass.groups.includes('admin')
      "
    >
      <q-separator />

      <!--   TODO: Rework this for lazyloading   -->
      <q-expansion-item
        expand-separator
        icon="create"
        label="Menu Editor"
        @before-show="getSiteNav"
        @after-hide="clearSiteNav"
      >
        <q-card>
          <q-card-section>
            <q-input
              ref="filter"
              filled
              v-model="siteNavFilter"
              label="Filter"
              dense
              v-if="siteNav.length > 0"
            >
              <template v-slot:append>
                <q-icon
                  v-if="siteNavFilter !== ''"
                  name="clear"
                  class="cursor-pointer"
                  @click="siteNavFilter = ''"
                />
              </template>
            </q-input>

            <q-tree
              :nodes="siteNav"
              node-key="label"
              :filter="siteNavFilter"
              default-expand-all
              no-nodes-label="No links or link groups defined."
            >
              <template v-slot:default-header="prop">
                <div class="row items-center">
                  <q-icon
                    :name="prop.node.icon || 'star'"
                    color="orange"
                    size="28px"
                    class="q-mr-sm"
                  />
                  <div class="text-weight-bold text-primary">
                    {{ prop.node.label }}
                  </div>
                </div>
                <q-space />
                <q-btn round icon="settings" />
              </template>

              <template v-slot:default-body="prop">
                <div v-if="prop.node.groups">
                  <span class="text-weight-bold">Groups: </span>:
                  {{ prop.node.groups }}
                </div>
              </template>
            </q-tree>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item expand-separator icon="settings" label="Site Settings">
        <q-card>
          <q-card-section>
            TODO
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "SiteAdmin",
  computed: {
    ...mapState({
      gglass: (state) => state.gglass,
    }),
  },
  data() {
    return {
      siteNavFilter: "",
      siteNav: [],
    };
  },
  methods: {
    ...mapActions("gglass", []),
    getSiteNav: function () {
      // this.siteNav = [
      //   {
      //     label: 'Root A',
      //     icon: 'settings',
      //     groups: ['admin','user'],
      //     children: [
      //       {
      //         label: 'Child A-A',
      //         icon: 'settings'
      //       },
      //       {
      //         label: 'Child A-B',
      //       }
      //     ]
      //   },
      //   {
      //     label: 'Root B',
      //   }
      // ]
    },
    clearSiteNav: function () {
      this.siteNav = [];
    },
  },
  created: function () {},
};
</script>
