<template>
  <div class="container">
    <h1 class="title has-text-centered">Content Manager</h1>
    <div class="container settings">
      <BaseDropdown label="Season" v-model="season" :options="seasons" :disabled="seasons.length < 2" />
      <BaseDropdown label="Events" v-model="event" :options="events" :disabled="events.length < 2" />
      <BaseDropdown label="Session" v-model="session" :options="sessions" :disabled="sessions.length < 2" />
    </div>
  </div>
</template>

<script>
  import BaseDropdown from "@/components/BaseDropdown";

  export default {
    name: "FeedManager",
    components: {
      BaseDropdown
    },
    data() {
      return {
        season: "",
        event: "",
        session: "",
        seasons: [{ text: "Select season", value: "", disabled: true }],
        events: [{ text: "Select event", value: "", disabled: true }],
        sessions: [{ text: "Select session", value: "", disabled: true }]
      };
    },
    mounted() {
      //Load seasons
    }
  };
</script>

<style lang="scss">
  .settings {
    padding: 1em;
  }
</style>
