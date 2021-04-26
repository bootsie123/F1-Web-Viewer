import axios from "axios";

const http = axios.create({
  baseURL: process.env.VUE_APP_API_URL,
  headers: {
    common: {
      "X-Version": process.env.VUE_APP_VERSION
    }
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
      console.error("Error", err.message);
    }

    if (!production) {
      console.error(err.config);
    }

    return Promise.reject(err);
  }
);

http.interceptors.response.use(
  res => {
    return res;
  },
  err => {
    if (!err.data) {
      err.data = {
        error: {
          status: err.status,
          message: err.message || err.statusText
        }
      };
    }

    return Promise.reject(err.data);
  }
);

export default http;
