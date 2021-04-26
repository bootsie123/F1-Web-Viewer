<template>
  <div class="group">
    <div class="vue-draggable-handle modifier">
      <BaseIconButton icon="ri-drag-move-line" />
    </div>
    <div @click="clicked" class="delete-handle modifier">
      <BaseIconButton icon="ri-close-line" />
    </div>
    <video ref="videoPlayer" class="video-js vjs-fill no-drag" />
  </div>
</template>

<script>
  import videojs from "video.js";

  import "videojs-contrib-quality-levels";
  import "videojs-http-source-selector";

  import BaseIconButton from "@/components/BaseIconButton";

  export default {
    name: "Feed",
    components: {
      BaseIconButton
    },
    props: {
      options: Object
    },
    methods: {
      clicked(event) {
        this.$emit("click", event.target);
      }
    },
    mounted() {
      this.player = videojs(this.$refs.videoPlayer, this.options);

      this.player.httpSourceSelector();
    },
    beforeDestroy() {
      if (this.player) {
        this.player.dispose();
      }
    }
  };
</script>

<style lang="scss">
  .group {
    width: 100%;
    height: 100%;
  }

  .modifier {
    display: none;
    position: absolute;
    height: 20px;
    width: 20px;
    z-index: 100;
    color: white;
  }

  .vue-grid-item:hover .modifier {
    display: block;
  }

  .delete-handle {
    right: 0;
  }

  .vue-resizable-handle {
    display: none;
    background: url("~@/assets/resize-icon.svg") !important;
    background-position: 100% 100% !important;
    background-repeat: no-repeat !important;
    background-origin: content-box !important;
    -webkit-box-sizing: border-box !important;
  }

  .vue-grid-item:hover .vue-resizable-handle {
    display: block !important;
  }
</style>
