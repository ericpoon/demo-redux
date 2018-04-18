function timestamper(createStore) {
  function enhancedCreateStore(initialState, reducer, enhancer) {
    if (enhancer) {
      return enhancer(enhancedCreateStore)(initialState, reducer);
    }
    const store = createStore(initialState, reducer);

    return {
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
