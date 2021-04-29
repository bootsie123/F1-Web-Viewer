<template>
  <div class="group">
    <div class="vue-draggable-handle modifier">
      <BaseIconButton icon="ri-drag-move-line" />
    </div>
    <div @click="clicked" class="delete-handle modifier">
      <BaseIconButton icon="ri-close-line" />
    </div>
    <video ref="videoPlayer" class="video-js vjs-fill no-drag" :class="{ hide: !initialized }" />
  </div>
</template>

<script>
  //TODO: Add pin button to make the grid item static

  import videojs from "video.js";

  import "videojs-contrib-quality-levels";
  import "videojs-http-source-selector";

  import F1TV_API from "@/lib/F1TV_API";

  import BaseIconButton from "@/components/BaseIconButton";

  export default {
    name: "Feed",
    components: {
      BaseIconButton
    },
    props: {
      options: Object,
      playbackUrl: String
    },
    data() {
      return {
        initialized: false
      };
    },
    watch: {
      options() {
        if (!this.player) {
          this.initPlayer();
        }
      }
    },
    methods: {
      clicked(event) {
        this.$emit("click", event.target);
      },
      async initPlayer() {
        this.player = videojs(this.$refs.videoPlayer, this.options);
        this.player.httpSourceSelector();

        this.initialized = true;

        try {
          let token = this.$store.getters.token;

          if (!token) {
            const res = await this.$store.dispatch("authenticate");

            token = res.data.subscriptionToken;
          }

          const res = await F1TV_API.getAuthenticatedUrl(this.playbackUrl, token);

          if (res.data?.resultObj?.url) {
            this.player.src(res.data.resultObj.url);
          }
        } catch (err) {
          console.error(err);
        }
      }
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

  .hide {
    background: transparent !important;
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
