<template>
  <div class="background" id="layoutParent" @dragover.prevent>
    <grid-layout ref="gridLayout" :layout.sync="layout" isDraggable isResizable :margin="[0, 0]">
      <grid-item
        v-for="(item, i) in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="String(i)"
        :key="i"
        drag-allow-from=".vue-draggable-handle"
        drag-ignore-from=".no-drag"
      >
        <Feed @click="deleteFeed(i)" :playbackUrl="item.playbackUrl" :options="item.options" />
      </grid-item>
    </grid-layout>
    <SlidePanel>
      <FeedManager />
    </SlidePanel>
  </div>
</template>

<script>
  //TODO: Ensure each item in the layout has a unique identifier (i)

  import { GridLayout, GridItem } from "vue-grid-layout";
  import { mapActions } from "vuex";

  import Feed from "@/components/Feed";
  import SlidePanel from "@/components/SlidePanel";
  import FeedManager from "@/components/FeedManager";

  export default {
    name: "Main",
    components: {
      Feed,
      SlidePanel,
      FeedManager,
      GridLayout,
      GridItem
    },
    computed: {
      layout: {
        get() {
          return this.$store.getters.layout;
        },
        set(val) {
          this.setLayout(val);
        }
      }
    },
    methods: {
      deleteFeed(i) {
        const newLayout = [...this.layout];

        newLayout.splice(i, 1);

        this.setLayout(newLayout);
      },
      ...mapActions(["setLayout"])
    },
    mounted() {
      this.$root.$refs.gridLayout = this.$refs.gridLayout;
    }
  };
</script>

<style lang="scss" scoped>
  .background {
    min-height: 100vh;
    background: #fdfdfd;
  }

  @media all and (display-mode: fullscreen) {
    .background {
      background: black;
    }
  }
</style>
