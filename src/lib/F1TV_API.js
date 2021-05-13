import api from "@/store/axios";
import axios from "axios";

const STREAM_TYPE = "BIG_SCREEN_HLS";
const VIDEO_QUERY = `2.0/R/ENG/${STREAM_TYPE}/ALL/PAGE/SEARCH/VOD/F1_TV_Pro_Annual/2?`;

export default {
  authenticate: (username, password) => {
    return axios.post(process.env.VUE_APP_NETLIFY ? "/.netlify/functions/server/authenticate" : "/authenticate", {
      Login: username,
      Password: password
    });
  },
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
    return api.get(VIDEO_QUERY, {
      params: {
        filter_season: year,
        filter_objectSubtype: "Meeting",
        filter_orderByFom: "Y",
        sortOrder: "asc",
        orderBy: "meeting_End_Date"
      }
    });
  },
  getSessionFromEvent: async eventId => {
    return api.get(VIDEO_QUERY, {
      params: {
        filter_MeetingKey: eventId,
        sortOrder: "asc",
        orderBy: "meeting_End_Date"
      }
    });
  },
  getChannelsFromSession: async contentId => {
    return api.get(`2.0/R/ENG/${STREAM_TYPE}/ALL/CONTENT/VIDEO/${contentId}/F1_TV_Pro_Annual/2`);
  },
  getAuthenticatedUrl: (url, token) => {
    return api.get(`1.0/R/ENG/${STREAM_TYPE}/ALL/${url}`, {
      headers: {
        ascendontoken: token
      }
    });
  }
};
