import axios from "axios";

const CORS_PROXY = "https://damp-mouse-7bce.f1webviewer.workers.dev?";
const API_URL = "https://f1tv.formula1.com";

const http = axios.create({
  baseURL: process.env.VUE_APP_NETLIFY ? CORS_PROXY + API_URL : API_URL
});

const production = process.env.VUE_APP_NODE_ENV === "production";

http.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    if (err.response) {
      return Promise.reject(err.response);
    } else if (err.request && !production) {
      console.error(err.request);
    } else {
      console.error("Error", err);
    }

    if (!production) {
      console.error(err.config);
    }

    return Promise.reject(err);
  }
);

export default http;
