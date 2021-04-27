import axios from "@/store/axios";

const STREAM_TYPE = "BIG_SCREEN_HLS";
const VIDEO_QUERY = `2.0/R/ENG/${STREAM_TYPE}/ALL/PAGE/SEARCH/VOD/F1_TV_Pro_Annual/2`;

export default {
  getSeasons: () => {
    let seasons = [];

    for (let year = new Date().getFullYear(); year >= 2018; year--) {
      seasons.push({
        text: year,
        value: year
      });
    }

    return seasons;
  },
  getEventsFromSeason: year => {
    return axios.get(VIDEO_QUERY, {
      params: {
        filter_season: year,
        filter_objectSubtype: "Meeting",
        sortOrder: "asc",
        orderBy: "meeting_End_Date"
      }
    });
  },
  getSessionFromEvent: async eventId => {
    return axios.get(VIDEO_QUERY, {
      params: {
        filter_MeetingKey: eventId,
        sortOrder: "asc",
        orderBy: "meeting_End_Date"
      }
    });
  },
  getChannelsFromSession: async contentId => {
    return axios.get(`2.0/R/ENG/${STREAM_TYPE}/ALL/CONTENT/VIDEO/${contentId}/F1_TV_Pro_Annual/2`);
  }
};
