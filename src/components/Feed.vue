<template>
  <div class="group">
    <div class="vue-draggable-handle modifier">
      <BaseIconButton icon="ri-drag-move-line" />
    </div>
    <div class="right-handle modifier">
      <BaseIconButton
        icon="ri-pushpin-line"
        iconToggle="ri-pushpin-2-fill"
        iconHover="ri-pushpin-2-line"
        iconToggleHover="ri-pushpin-2-fill"
        toggle
        :initValue="this.static"
        @click="$emit('togglePin')"
      />
      <BaseIconButton icon="ri-close-line" @click="$emit('delete')" />
    </div>
    <video ref="videoPlayer" class="video-js vjs-fill no-drag" :class="{ hide: !initialized }" />
  </div>
</template>

<script>
  import videojs from "video.js";
  import { mapGetters } from "vuex";

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
      playbackUrl: String,
      static: Boolean
    },
    data() {
      return {
        initialized: false,
        player: null
      };
    },
    computed: {
      ...mapGetters(["token"])
    },
    watch: {
      options() {
        if (!this.player) {
          this.initPlayer();
        }
      },
      async token() {
        this.updateSource();
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

        this.updateSource();
      },
      async updateSource() {
        if (!this.token) return;

        try {
          const res = await F1TV_API.getAuthenticatedUrl(this.playbackUrl, this.token);

          if (this.player && res.data?.resultObj?.url) {
            this.player.src(res.data.resultObj.url);
          }
        } catch (err) {
          console.error(err);
        }
      }
    },
    mounted() {
      if (this.options) {
        this.initPlayer();
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
    z-index: 100;
    color: white;
  }

  .vue-grid-item:hover .modifier {
    display: block;
  }

  .right-handle {
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
