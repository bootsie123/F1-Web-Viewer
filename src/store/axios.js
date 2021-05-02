import axios from "axios";

const API_URL = "https://f1tv.formula1.com";

const http = axios.create({
  baseURL: API_URL,
  proxy: {
    protocol: "https",
    host: "https://damp-mouse-7bce.f1webviewer.workers.dev"
  }
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
