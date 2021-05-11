import Vue from "vue";
import Vuex from "vuex";

import F1TV_API from "@/lib/F1TV_API";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    layouts: JSON.parse(localStorage.getItem("layouts")) || [],
    layout: JSON.parse(localStorage.getItem("layout")) || [],
    token: localStorage.getItem("token") || "",
    layoutColumns: parseInt(localStorage.getItem("layoutColumns")) || 12,
    layoutRowHeight: parseInt(localStorage.getItem("layoutRowHeight")) || 150,
    playback: true,
    username: "",
    password: "",
    authError: ""
  },
  getters: {
    layouts: state => state.layouts,
    layout: state => state.layout,
    layoutColumns: state => state.layoutColumns,
    layoutRowHeight: state => state.layoutRowHeight,
    playback: state => state.playback,
    token: state => state.token,
    authError: state => state.authError,
    authenticated: state => !!state.token
  },
  actions: {
    setLayout({ commit, dispatch }, layout) {
      commit("updateLayout", layout);
      dispatch("saveLayout", layout);
    },
    setActiveLayout({ commit, dispatch, state }, id) {
      const layouts = [];

      for (let layout of state.layouts) {
        if (layout.id === id) {
          layout.active = true;

          dispatch("setLayout", layout.layout);
          commit("setLayoutColumns", layout.columns);
          commit("setLayoutRowHeight", layout.rowHeight);
        } else {
          layout.active = false;
        }

        layouts.push(layout);
      }

      commit("updateLayouts", layouts);
    },
    addToLayout({ commit, state }, layout) {
      commit("updateLayout", [...state.layout, ...layout]);
    },
    addToLayouts({ commit, state }, layout) {
      commit("updateLayouts", [...state.layouts, ...layout]);
    },
    saveLayout({ commit }, layout) {
      commit(
        "saveLayout",
        layout.filter(item => item.i !== "drop")
      );
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
    updateLayouts(state, layouts) {
      state.layouts = layouts;

      localStorage.setItem("layouts", JSON.stringify(layouts));
    },
    saveLayout(state, layout) {
      localStorage.setItem("layout", JSON.stringify(layout));
    },
    setItem(state, { index, key, value }) {
      state.layout[index][key] = value;

      localStorage.setItem("layout", JSON.stringify(state.layout));
    },
    setLayoutColumns(state, columns) {
      state.layoutColumns = columns;

      localStorage.setItem("layoutColumns", columns);
    },
    setLayoutRowHeight(state, rowHeight) {
      state.layoutRowHeight = rowHeight;

      localStorage.setItem("layoutRowHeight", rowHeight);
    },
    setPlayback(state, playback) {
      state.playback = playback;
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
