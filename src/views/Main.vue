<template>
  <div class="background" id="layoutParent" @dragover.prevent>
    <grid-layout
      ref="gridLayout"
      :layout.sync="layout"
      is-draggable
      is-resizable
      :margin="[0, 0]"
      responsive
      useStyleCursor
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        drag-allow-from=".vue-draggable-handle"
        drag-ignore-from=".no-drag"
      >
        <Feed v-if="item.i !== 'drop'" @click="deleteFeed(item.i)" :options="item.options" />
      </grid-item>
    </grid-layout>
    <SlidePanel>
      <FeedManager />
    </SlidePanel>
  </div>
</template>

<script>
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
          return this.$store.getters["layout/layout"];
        },
        set(val) {
          this.$store.dispatch("layout/setLayout", val);
        }
      }
    },
    methods: {
      deleteFeed(i) {
        this.setLayout(this.layout.filter(item => item.i !== i));
      },
      ...mapActions("layout", ["setLayout"])
    },
    mounted() {
      this.$root.$refs.gridLayout = this.$refs.gridLayout;
      this.$store.dispatch("layout/setLayout", [{ x: 0, y: 0, w: 2, h: 2, i: "0" }]);
    }
  };
</script>

<style lang="scss" scoped>
  .background {
    min-height: 100vh;
    background: url("~@/assets/f1-logo.svg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 75%;
  }

  @media all and (display-mode: fullscreen) {
    .background {
      background: black;
    }
  }
</style>
