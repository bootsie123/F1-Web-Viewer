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
  export default {
    name: "ChannelItem",
    props: {
      channel: {
        type: Object,
        required: true
      }
    },
    methods: {
      drag() {},
      dragEnd() {}
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
    box-shadow: 0 0 14px 0 #e4e4e4;
    background: #e6e6e6;
  }
</style>
