<template>
  <div
    class="background"
    :class="{ forceBackground }"
    id="layoutParent"
    @dragover="preventDefault"
    @dragenter="preventDefault"
  >
    <grid-layout
      class="gridLayout"
      ref="gridLayout"
      :layout.sync="layout"
      isDraggable
      isResizable
      :margin="[0, 0]"
      :colNum="layoutColumns || 12"
      :rowHeight="layoutRowHeight || 150"
      @layout-updated="layoutUpdated"
    >
      <grid-item
        v-for="(item, i) in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        drag-allow-from=".vue-draggable-handle"
        drag-ignore-from=".no-drag"
      >
        <Feed
          @togglePin="setItemStatic(i)"
          @syncFeeds="syncFeeds"
          @delete="deleteItem(i)"
          @togglePlayback="togglePlayback"
          :playbackUrl="item.playbackUrl"
          :options="item.options"
          :static="item.static"
          :time="item.time"
          :live="item.live"
        />
      </grid-item>
    </grid-layout>
    <SlidePanel>
      <div class="container relative">
        <div v-if="authenticated">
          <BaseTabs :tabs="tabs" keepAlive>
            <template v-slot:right>
              <BaseIconButton
                @click="toggleBackground"
                icon="icon ri-contrast-2-line"
                iconHover="ri-contrast-2-fill"
                iconToggle="ri-contrast-2-fill"
                toggle
              />
              <BaseIconButton
                v-if="authenticated"
                @click="logout()"
                icon="ri-logout-box-line"
                iconHover="ri-logout-box-fill"
              />
            </template>
          </BaseTabs>
        </div>
        <template v-else>
          <h1 class="title has-text-centered">F1 Web Viewer - Login</h1>
          <Login />
        </template>
        <Info />
      </div>
    </SlidePanel>
  </div>
</template>

<script>
  import { GridLayout, GridItem } from "vue-grid-layout";
  import { mapGetters, mapActions, mapMutations } from "vuex";

  import Feed from "@/components/Feed";
  import SlidePanel from "@/components/SlidePanel";
  import Login from "@/components/Login";
  import Info from "@/components/Info";
  import BaseIconButton from "@/components/BaseIconButton";
  import BaseTabs from "@/components/BaseTabs";

  export default {
    name: "Main",
    components: {
      Feed,
      SlidePanel,
      Login,
      Info,
      GridLayout,
      GridItem,
      BaseIconButton,
      BaseTabs
    },
    data() {
      return {
        tabs: [
          { title: "Manage Feeds", component: "FeedManager", icon: "ri-movie-line" },
          { title: "Settings", component: "Settings", icon: "ri-settings-4-line" }
        ],
        forceBackground: false
      };
    },
    computed: {
      ...mapGetters(["authenticated", "layout", "layoutColumns", "layoutRowHeight"])
    },
    methods: {
      deleteItem(i) {
        this.layout.splice(i, 1);

        this.setLayout(this.layout);
      },
      layoutUpdated(layout) {
        this.saveLayout(layout);
      },
      syncFeeds(time, broadCast = true) {
        if (this.bc && broadCast) {
          this.bc.postMessage({
            type: "sync",
            time
          });
        }

        this.setLayout(
          this.layout.map(feed => {
            feed.time = time;

            return feed;
          })
        );
      },
      togglePlayback(toggled, broadCast = true) {
        if (this.bc && broadCast) {
          this.bc.postMessage({
            type: "playback",
            playback: toggled
          });
        }

        this.setPlayback(toggled);
      },
      toggleBackground(e, toggled) {
        this.forceBackground = toggled;
      },
      preventDefault(e) {
        e.preventDefault();
      },
      ...mapActions(["setLayout", "setItemStatic", "saveLayout"]),
      ...mapMutations(["logout", "setPlayback"])
    },
    mounted() {
      this.$root.$refs.gridLayout = this.$refs.gridLayout;

      if (window.BroadcastChannel) {
        this.bc = new BroadcastChannel("F1-Web-Viewer");

        this.bc.onmessage = e => {
          if (e.data?.type === "sync") {
            this.syncFeeds(e.data.time, false);
          } else if (e.data?.type === "playback") {
            this.togglePlayback(e.data.playback, false);
          }
        };
      }
    },
    beforeDestroy() {
      if (this.bc) {
        this.bc.close();
      }
    }
  };
</script>

<style lang="scss" scoped>
  .background {
    position: relative;
    min-height: 100vh;
    background: #fdfdfd;
  }

  .icon {
    font-size: 1.25em;
  }

  .gridLayout {
    z-index: 1;
  }

  .vue-grid-item {
    touch-action: none;
  }

  .relative {
    position: relative;
    min-height: 100%;
  }

  @media all and (display-mode: fullscreen) {
    .background {
      background: black;
    }
  }

  .forceBackground {
    background: black;
  }
</style>
