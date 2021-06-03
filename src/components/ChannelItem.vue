<template>
  <div
    class="channel"
    draggable="true"
    unselectable="on"
    :style="{ 'border-color': channel.hex }"
    @drag="drag"
    @dragend="dragEnd"
  >
    {{ channel.type === "additional" ? channel.title : channel.driverFirstName + " " + channel.driverLastName }}
  </div>
</template>

<script>
  import { v4 as uuidv4 } from "uuid";
  import { mapGetters, mapActions } from "vuex";

  export default {
    name: "ChannelItem",
    props: {
      channel: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        mousePos: {},
        dragPos: {}
      };
    },
    computed: {
      ...mapGetters(["layout"])
    },
    methods: {
      drag() {
        const layoutRect = document.getElementById("layoutParent").getBoundingClientRect();
        const mousePos = this.mousePos;
        const mouseInGrid = this.mouseInGrid(mousePos, layoutRect);

        if (mouseInGrid === true && this.layout.findIndex(item => item.i === "drop") === -1) {
          this.addToLayout([
            {
              x: (this.layout.length * 2) % 12,
              y: this.layout.length + 12,
              w: 1,
              h: 1,
              i: "drop"
            }
          ]);
        }

        const index = this.layout.findIndex(item => item.i === "drop");

        if (index !== -1) {
          const gridLayout = this.$root.$refs.gridLayout;

          const el = gridLayout.$children[index];

          el.dragging = {
            top: mousePos.y - layoutRect.top,
            left: mousePos.x - layoutRect.left
          };

          const newPos = el.calcXY(mousePos.y - layoutRect.top, mousePos.x - layoutRect.left);

          if (mouseInGrid) {
            gridLayout.dragEvent("dragstart", "drop", newPos.x, newPos.y, 1, 1);

            this.dragPos = {
              x: this.layout[index].x,
              y: this.layout[index].y,
              i: uuidv4()
            };
          } else {
            gridLayout.dragEvent("dragend", "drop", newPos.x, newPos.y, 1, 1);

            this.setLayout(this.layout.filter(item => item.i !== "drop"));
          }
        }
      },
      dragEnd() {
        const layoutRect = document.getElementById("layoutParent").getBoundingClientRect();
        const mousePos = this.mousePos;
        const mouseInGrid = this.mouseInGrid(mousePos, layoutRect);

        if (mouseInGrid) {
          const newLayout = this.layout.filter(item => item.i !== "drop");

          newLayout.push({
            x: this.dragPos.x,
            y: this.dragPos.y,
            w: 1,
            h: 1,
            i: this.dragPos.i,
            options: {
              controls: true,
              muted: true,
              liveui: true,
              preload: "auto",
              width: 50,
              height: 50
            },
            playbackUrl: this.channel.playbackUrl,
            title: this.channel.title,
            live: this.channel.live
          });

          this.setLayout(newLayout);

          this.$root.$refs.gridLayout.dragEvent("dragend", this.dragPos.x, this.dragPos.y, 1, 1);
        }
      },
      dragOver(e) {
        this.mousePos.x = e.clientX;
        this.mousePos.y = e.clientY;
      },
      mouseInGrid(mouse, rect) {
        return mouse.x > rect.left && mouse.x < rect.right && mouse.y > rect.top && mouse.y < rect.bottom;
      },
      ...mapActions(["addToLayout", "setLayout"])
    },
    mounted() {
      document.addEventListener("dragover", this.dragOver);
    }
  };
</script>

<style lang="scss" scoped>
  .channel {
    margin-bottom: 0.5em;
    padding: 5px;
    padding-left: 0.5em;
    border-left: 3px solid;
  }

  .channel:hover {
    background: #f8f8f8;
    cursor: grab;
  }

  .channel:active {
    cursor: grabbing;
  }
</style>
