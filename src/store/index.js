import Vue from "vue";
import Vuex from "vuex";

import F1TV_API from "@/lib/F1TV_API";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    layout: JSON.parse(localStorage.getItem("layout")) || [],
    token: localStorage.getItem("token") || "",
    username: "",
    password: "",
    authError: ""
  },
  getters: {
    layout: state => state.layout,
    token: state => state.token,
    authError: state => state.authError,
    authenticated: state => !!state.token
  },
  actions: {
    setLayout({ commit, dispatch }, layout) {
      commit("updateLayout", layout);
      dispatch("saveLayout", layout);
    },
    saveLayout({ commit }, layout) {
      commit(
        "saveLayout",
        layout.filter(item => item.i !== "drop")
      );
    },
    addToLayout({ commit, state }, layout) {
      commit("updateLayout", [...state.layout, ...layout]);
    },
    setItemStatic({ commit, state }, index) {
      commit("setItem", {
        index,
        key: "static",
        value: !state.layout[index].static
      });
    },
    async authenticate({ commit }, credentials) {
      try {
        const res = await F1TV_API.authenticate(credentials.username, credentials.password);

        if (res.status === 200) {
          commit("updateToken", res.data.data.subscriptionToken);
        }

        return res;
      } catch (err) {
        if (err.message.includes(401)) {
          err.message = "Username or password is incorrect";
        }

        commit("authError", err);

        return Promise.reject(err);
      }
    }
  },
  mutations: {
    updateLayout(state, layout) {
      state.layout = layout;
    },
    saveLayout(state, layout) {
      localStorage.setItem("layout", JSON.stringify(layout));
    },
    setItem(state, { index, key, value }) {
      state.layout[index][key] = value;

      localStorage.setItem("layout", JSON.stringify(state.layout));
    },
    updateToken(state, token) {
      localStorage.setItem("token", token);

      state.token = token;
    },
    authError(state, error) {
      state.authError = error;
    },
    logout(state) {
      localStorage.removeItem("token");

      state.token = "";
      state.authError = "";
    }
  }
});
