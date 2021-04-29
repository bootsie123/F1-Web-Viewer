import Vue from "vue";
import Vuex from "vuex";

import F1TV_API from "@/lib/F1TV_API";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    layout: [],
    subscriptionToken: "",
    username: "",
    password: ""
  },
  getters: {
    layout: state => state.layout,
    token: state => state.subscriptionToken
  },
  actions: {
    setLayout({ commit }, layout) {
      commit("update_layout", layout);
    },
    addToLayout({ commit, state }, layout) {
      commit("update_layout", [...state.layout, ...layout]);
    },
    async authenticate({ commit, state }) {
      try {
        const res = await F1TV_API.authenticate(state.username, state.password);

        if (res.status === 200) {
          commit("update_token", res.data.subscriptionToken);
        }

        return res;
      } catch (err) {
        console.error(err);
      }
    }
  },
  mutations: {
    update_layout(state, layout) {
      state.layout = layout;
    },
    update_token(state, token) {
      state.token = token;
    }
  }
});
