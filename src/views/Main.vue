<template>
  <div class="background" id="layoutParent" @dragover.prevent>
    <grid-layout
      class="gridLayout"
      ref="gridLayout"
      :layout.sync="layout"
      isDraggable
      isResizable
      :margin="[0, 0]"
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
          @delete="deleteItem(i)"
          :playbackUrl="item.playbackUrl"
          :options="item.options"
          :static="item.static"
        />
      </grid-item>
    </grid-layout>
    <SlidePanel>
      <div class="container relative">
        <h1 class="title has-text-centered">{{ authenticated ? "Content Manager" : "Login" }}</h1>
        <BaseIconButton
          v-if="authenticated"
          class="logout"
          @click="logout()"
          icon="ri-logout-box-line"
          iconHover="ri-logout-box-fill"
        />
        <FeedManager v-if="authenticated" />
        <Login v-else />
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
  import FeedManager from "@/components/FeedManager";
  import Login from "@/components/Login";
  import Info from "@/components/Info";
  import BaseIconButton from "@/components/BaseIconButton";

  export default {
    name: "Main",
    components: {
      Feed,
      SlidePanel,
      FeedManager,
      Login,
      Info,
      GridLayout,
      GridItem,
      BaseIconButton
    },
    computed: {
      ...mapGetters(["authenticated", "layout"])
    },
    methods: {
      deleteItem(i) {
        this.layout.splice(i, 1);

        this.setLayout(this.layout);
      },
      layoutUpdated(layout) {
        this.saveLayout(layout);
      },
      ...mapActions(["setLayout", "setItemStatic", "saveLayout"]),
      ...mapMutations(["logout"])
    },
    mounted() {
      this.$root.$refs.gridLayout = this.$refs.gridLayout;
    }
  };
</script>

<style lang="scss" scoped>
  .background {
    position: relative;
    min-height: 100vh;
    background: #fdfdfd;
  }

  .logout {
    position: absolute;
    top: 6px;
    right: 0;
    font-size: 1.5em;
  }

  .gridLayout {
    z-index: 1;
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
</style>
