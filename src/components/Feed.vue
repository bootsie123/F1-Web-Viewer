<template>
  <div class="group">
    <div class="vue-draggable-handle modifier">
      <BaseIconButton icon="ri-drag-move-line" />
    </div>
    <div class="right-handle modifier">
      <BaseIconButton
        icon="ri-play-line"
        iconHover="ri-play-fill"
        iconToggle="ri-pause-line"
        :value="playback"
        toggle
        @click="(e, toggled) => $emit('togglePlayback', toggled)"
      />
      <BaseIconButton icon="ri-timer-line" iconHover="ri-timer-fill" @click="$emit('syncFeeds', playerTime)" />
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
  import "videojs-http-source-selector-2";

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
      static: Boolean,
      live: Boolean,
      time: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        initialized: false,
        player: null
      };
    },
    computed: {
      playerTime() {
        return this.player?.currentTime();
      },
      ...mapGetters(["token", "playback"])
    },
    watch: {
      options() {
        if (!this.player) {
          this.initPlayer();
        }
      },
      time(time) {
        this.player?.currentTime(time);
      },
      playbackUrl() {
        this.updateSource();
      },
      token() {
        this.updateSource();
      },
      playback(state) {
        if (!this.player) return;

        if (state) {
          this.player.play();
        } else {
          this.player.pause();
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

        this.player.on("loadeddata", () => {
          const tracks = this.player.remoteTextTracks();

          for (let i = 0; i < tracks.length; i++) {
            if (tracks[i].kind === "subtitles") {
              tracks[i].mode = "hidden";
            }
          }
        });

        this.initialized = true;

        this.updateSource();
      },
      async updateSource() {
        if (!this.token) return;

        try {
          const res = await F1TV_API.getAuthenticatedUrl(this.playbackUrl, this.token);

          if (this.player && res.data?.resultObj?.url) {
            let url = res.data.resultObj.url;

            if (process.env.VUE_APP_NETLIFY) {
              url = "https://cors.bridged.cc/" + url;
            } else if (!process.env.IS_ELECTRON) {
              const playTokenCookie = await F1TV_API.playTokenCookie(url);
              const cookie = playTokenCookie.data.cookie;

              document.cookie = `playToken=${cookie.playToken};path=${cookie.path};samesite=None;secure;`;

              url = "/proxy/" + url;
            }

            this.player.src({
              src: url,
              withCredentials: true
            });
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
