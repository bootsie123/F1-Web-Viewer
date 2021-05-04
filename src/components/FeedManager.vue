<template>
  <div>
    <div class="container settings">
      <BaseDropdown
        label="Season"
        v-model="season"
        :options="seasons"
        :disabled="seasons.length < 2"
        :loading="seasonsLoading"
      />
      <BaseDropdown
        label="Events"
        v-model="event"
        :options="events"
        :disabled="events.length < 2"
        :loading="eventsLoading"
      />
      <BaseDropdown
        label="Session"
        v-model="session"
        :options="sessions"
        :disabled="sessions.length < 2"
        :loading="sessionsLoading"
      />
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
      seasons() {
        return [{ text: "Select season", ...this.defaultValues }, ...F1TV_API.getSeasons()];
      },
      ...mapGetters(["authenticated"])
    },
    watch: {
      async season(year) {
        if (!year) return;

        this.eventsLoading = true;

        this.events = [];
        this.sessions = [];

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

        this.eventsLoading = false;
      },
      async event(eventId) {
        if (!eventId) return;

        this.sessionsLoading = true;
        this.sessions = [];

        try {
          let sessions = await F1TV_API.getSessionFromEvent(eventId);

          this.sessions = [
            { text: "Select session", ...this.defaultValues },
            ...sessions.data.resultObj.containers
              .filter(session => {
                const metadata = session.metadata;

                return (
                  metadata.contentType === "VIDEO" &&
                  metadata.emfAttributes.Series === "FORMULA 1" &&
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

        this.sessionsLoading = false;
      },
      async session(contentId) {
        if (!contentId) return;

        try {
          const channels = await F1TV_API.getChannelsFromSession(contentId);

          const container = channels.data.resultObj.containers[0];

          if (container.metadata.additionalStreams) {
            const mappedChannels = channels.data.resultObj.containers[0].metadata.additionalStreams.map(channel => {
              return {
                driverFirstName: channel.driverFirstName,
                driverLastName: channel.driverLastName,
                title: channel.title,
                playbackUrl: channel.playbackUrl,
                hex: channel.hex,
                type: channel.type
              };
            });

            mappedChannels.push({
              title: "WORLD",
              type: "additional",
              playbackUrl: `CONTENT/PLAY?contentId=${container.contentId}`
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
</style>
