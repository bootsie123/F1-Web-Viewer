<template>
  <div class="container" v-if="channelsSorted.length > 0">
    <h2 class="subtitle has-text-centered">Channels</h2>
    <ChannelItem v-for="(channel, i) in channelsSorted" :key="i" :channel="channel" />
  </div>
</template>

<script>
  import ChannelItem from "@/components/ChannelItem";

  export default {
    name: "ChannelGrid",
    components: {
      ChannelItem
    },
    props: {
      channels: {
        type: Array,
        required: true
      }
    },
    computed: {
      channelsSorted() {
        const newArray = [...this.channels];

        return newArray.sort((chan1, chan2) => {
          const name1 = chan1.driverLastName ? chan1.driverLastName : chan1.title;
          const name2 = chan2.driverLastName ? chan2.driverLastName : chan2.title;

          if (name1 < name2) {
            return -1;
          }

          if (name1 > name2) {
            return 1;
          }

          return 0;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .container {
    padding-bottom: 2em;
  }

  .subtitle {
    padding-top: 0.5em;
  }
</style>
