// MODULES MODE
// export const state = () => ({})


// export const state = () => ([])
//
export const state = () => ({
  vuexVariable: '',
  prefixes: [],
  selectedPrefix: '',
  selectedPostfix: '',
  selectedMidfix: '',
})

export const mutations = {
  updateSelectedPrefix(state, prefix) {
    state.selectedPrefix = prefix;
  },
  updateSelectedPostfix(state, postfix) {
    state.selectedPostfix = postfix;
  },
  updateSelectedMidfix(state, midfix) {
    state.selectedMidfix = midfix;
  },
  updateVuexVariable(state, textValue) {
    state.vuexVariable = textValue;
  },
  updatePrefixes(state, newPrefixes) {
    state.prefixes = newPrefixes;
  },
}

export const actions = {
  setSelectedPrefix({ commit }, selectedPrefix) {
    commit('updateSelectedPrefix', selectedPrefix)
  },
  setSelectedPostfix({ commit }, selectedPostfix) {
    commit('updateSelectedPostfix', selectedPostfix)
  },
  setPrefixes({ commit }, newPrefixes) {
    commit('updatePrefixes', newPrefixes);
  },
}

