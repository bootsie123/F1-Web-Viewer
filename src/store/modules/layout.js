const state = {
  layout: []
};

const getters = {
  layout: state => state.layout
};

const actions = {
  setLayout({ commit }, layout) {
    commit("update_layout", layout);
  },
  addToLayout({ commit, state }, layout) {
    commit("update_layout", [...state.layout, ...layout]);
  }
};

const mutations = {
  update_layout(state, layout) {
    state.layout = layout;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
