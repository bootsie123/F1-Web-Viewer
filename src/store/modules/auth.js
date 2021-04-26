import axios from "../axios";

const state = {
  status: "",
  error: null
};

const getters = {
  status: state => state.status,
  error: state => state.error
};

const actions = {
  async signup({ commit }, payload) {
    try {
      commit("auth_request");

      const res = await axios.post("users", payload);

      if (res.data.status === 200) {
        commit("auth_success", res.data);
      }

      return res;
    } catch (err) {
      commit("error", err);

      return Promise.reject(err);
    }
  }
};

const mutations = {
  auth_request(state) {
    state.error = null;
    state.status = "loading";
  },
  auth_success(state) {
    state.error = null;
    state.status = "success";
  },
  error(state, err) {
    state.error = err.error;
    state.status = "error";
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
