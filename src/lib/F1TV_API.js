import api from "@/store/axios";
import axios from "axios";

import store from "@/store";

const getStreamType = () => {
  return store.getters.streamType;
};

const getVideoQuery = () => {
  return `2.0/R/ENG/${getStreamType()}/ALL/PAGE/SEARCH/VOD/F1_TV_Pro_Annual/2?`;
};

export default {
  authenticate: (username, password) => {
    if (process.env.IS_ELECTRON) {
      return axios.post(
        "https://api.formula1.com/v2/account/subscriber/authenticate/by-password",
        {
          Login: username,
          Password: password
        },
        {
          headers: {
            apiKey: "fCUCjWrKPu9ylJwRAv8BpGLEgiAuThx7",
            "Content-Type": "application/json"
          }
        }
      );
    } else {
      return axios.post(process.env.VUE_APP_NETLIFY ? "/.netlify/functions/server/authenticate" : "/authenticate", {
        Login: username,
        Password: password
      });
    }
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
  getSeries: () => {
    const seriesNames = ["Formula 1", "Formula 2", "Formula 3", "Porsche"];

    return seriesNames.map(series => {
      return {
        text: series,
        value: series.toUpperCase()
      };
    });
  },
  getEventsFromSeason: year => {
    return api.get(getVideoQuery(), {
      params: {
        filter_season: year,
        filter_objectSubtype: "Meeting",
        filter_orderByFom: "Y",
        sortOrder: "desc",
        orderBy: "meeting_End_Date"
      }
    });
  },
  getSessionFromEvent: async eventId => {
    return api.get(getVideoQuery(), {
      params: {
        filter_MeetingKey: eventId,
        sortOrder: "asc",
        orderBy: "meeting_End_Date"
      }
    });
  },
  getChannelsFromSession: async contentId => {
    return api.get(`2.0/R/ENG/${getStreamType()}/ALL/CONTENT/VIDEO/${contentId}/F1_TV_Pro_Annual/2`);
  },
  getAuthenticatedUrl: (url, token) => {
    return api.get(`1.0/R/ENG/${getStreamType()}/ALL/${url}`, {
      headers: {
        ascendontoken: token
      }
    });
  },
  playTokenCookie: url => {
    return axios.get("/playTokenCookie", {
      params: { url }
    });
  }
};
