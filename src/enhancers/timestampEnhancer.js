function timestamper(createStore) {
  function enhancedCreateStore(reducer, initialState, enhancer) {
    if (enhancer) {
      return enhancer(enhancedCreateStore)(reducer, initialState);
    }
    const store = createStore(reducer, initialState);

    return {
      ...store,
      dispatch(action) {
        console.log(`***** ${(new Date()).toLocaleString()} *****`);
        store.dispatch(action);
      },
      getState() {
        console.log(`***** ${(new Date()).toLocaleString()} *****`);
        return store.getState();
      },
    }
  }

  return enhancedCreateStore;
}

module.exports = timestamper;
