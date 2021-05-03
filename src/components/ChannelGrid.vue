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
        const onBoards = [];
        const additional = [];

        for (let channel of this.channels) {
          if (channel.type !== "additional") {
            onBoards.push(channel);
          } else {
            additional.push(channel);
          }
        }

        this.sortByProp(onBoards, "driverLastName");
        this.sortByProp(additional, "title");

        return additional.concat(onBoards);
      }
    },
    methods: {
      sortByProp(array, prop) {
        array.sort((val1, val2) => {
          if (val1[prop] < val2[prop]) return -1;
          if (val1[prop] > val2[prop]) return 1;

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
