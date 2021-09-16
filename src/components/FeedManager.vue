<template>
  <div>
    <div class="container settings">
      <BaseDropdown
        label="Series"
        v-model="series"
        :options="seriesList"
        :disabled="seriesList.length < 2"
        :loading="seriesLoading"
        horizontal
      />
      <BaseDropdown
        label="Season"
        v-model="season"
        :options="seasons"
        :disabled="seasons.length < 2"
        :loading="seasonsLoading"
        horizontal
      />
      <BaseDropdown
        label="Events"
        v-model="event"
        :options="events"
        :disabled="events.length < 2"
        :loading="eventsLoading"
        horizontal
      />
      <BaseDropdown
        label="Session"
        v-model="session"
        :options="sessions"
        :disabled="sessions.length < 2"
        :loading="sessionsLoading"
        horizontal
      />
      <button class="button is-fullwidth" @click="updateSources" :disabled="channels.length < 1">
        Update Existing Feeds
      </button>
    </div>
    <ChannelGrid :channels="channels" />
  </div>
</template>

<script>
  import { mapGetters } from "vuex";

  import F1TV_API from "@/lib/F1TV_API";

  import ChannelGrid from "@/components/ChannelGrid";
  import BaseDropdown from "@/components/BaseDropdown";

  export default {
    name: "FeedManager",
    components: {
      ChannelGrid,
      BaseDropdown
    },
    data() {
      return {
        series: "FORMULA 1",
        season: "",
        event: "",
        session: "",
        eventsLoading: false,
        sessionsLoading: false,
        events: [],
        sessions: [],
        channels: [],
        defaultValues: {
          value: "",
          disabled: true,
          selected: true
        }
      };
    },
    computed: {
      seasonsLoading() {
        return this.seasons.length < 2;
      },
      seriesLoading() {
        return this.seriesList.length < 2;
      },
      seasons() {
        return [{ text: "Select season", ...this.defaultValues }, ...F1TV_API.getSeasons()];
      },
      seriesList() {
        return [{ text: "Select series", ...this.defaultValues }, ...F1TV_API.getSeries()];
      },
      ...mapGetters(["authenticated", "layout"])
    },
    watch: {
      async series(series) {
        if (!series || !this.event) return;

        this.sessionsLoading = true;

        this.session = "";

        await this.updateSessions(this.event);

        this.sessionsLoading = false;
      },
      async season(year) {
        if (!year) return;

        this.eventsLoading = true;

        this.event = "";
        this.session = "";

        this.events = [];
        this.sessions = [];
        this.channels = [];

        await this.updateEvents(year);

        this.eventsLoading = false;
      },
      async event(eventId) {
        if (!eventId) return;

        this.sessionsLoading = true;

        this.session = "";

        this.sessions = [];
        this.channels = [];

        await this.updateSessions(eventId);

        this.sessionsLoading = false;
      },
      session(contentId) {
        if (!contentId) return;

        this.channels = [];

        this.updateChannels(contentId);
      }
    },
    methods: {
      updateSources() {
        const layout = this.layout.map(item => {
          const channel = this.channels.find(channel => channel.title === item.title);

          if (channel) {
            item.playbackUrl = channel.playbackUrl;
            item.live = channel.live;
          }

          return item;
        });

        this.$store.dispatch("setLayout", layout);
      },
      async updateEvents(year) {
        try {
          let events = await F1TV_API.getEventsFromSeason(year);

          this.events = [
            { text: "Select event", ...this.defaultValues },
            ...events.data.resultObj.containers
              .filter(event => {
                return Date.now() > new Date(event.metadata.emfAttributes.Meeting_Start_Date);
              })
              .map(event => {
                return {
                  event,
                  text: event.metadata.emfAttributes.Meeting_Name,
                  value: event.metadata.emfAttributes.MeetingKey
                };
              })
          ];
        } catch (err) {
          console.error(err);
        }
      },
      async updateSessions(eventId) {
        try {
          let sessions = await F1TV_API.getSessionFromEvent(eventId);

          this.sessions = [
            { text: "Select session", ...this.defaultValues },
            ...sessions.data.resultObj.containers
              .filter(session => {
                const metadata = session.metadata;

                return (
                  metadata.contentType === "VIDEO" &&
                  metadata.emfAttributes.Series === this.series &&
                  (metadata.contentSubtype === "REPLAY" || metadata.contentSubtype === "LIVE")
                );
              })
              .map(session => {
                return {
                  session,
                  text: session.metadata.titleBrief,
                  value: session.metadata.contentId
                };
              })
          ];
        } catch (err) {
          console.error(err);
        }
      },
      async updateChannels(contentId) {
        try {
          const channels = await F1TV_API.getChannelsFromSession(contentId);

          const container = channels.data.resultObj.containers[0];

          if (container.metadata.additionalStreams) {
            const isLive = container.metadata.contentSubtype === "LIVE";

            const mappedChannels = channels.data.resultObj.containers[0].metadata.additionalStreams.map(channel => {
              return {
                driverFirstName: channel.driverFirstName,
                driverLastName: channel.driverLastName,
                title: channel.title,
                playbackUrl: channel.playbackUrl,
                hex: channel.hex,
                type: channel.type,
                live: isLive
              };
            });

            mappedChannels.push({
              title: "WORLD",
              type: "additional",
              playbackUrl: `CONTENT/PLAY?contentId=${container.contentId}`,
              live: isLive
            });

            this.channels = mappedChannels;
          } else {
            this.channels = [
              {
                title: container.metadata.titleBrief,
                type: "additional",
                playbackUrl: `CONTENT/PLAY?contentId=${container.metadata.contentId}`
              }
            ];
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  };
</script>

<style lang="scss">
  .settings {
    padding: 1em;
  }

  .settings .button {
    margin-top: 2em;
  }
</style>
