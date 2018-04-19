function logger(createStore) {

  function enhancedCreateStore(initialState, reducer, enhancer) {
    if (enhancer) {
      return enhancer(enhancedCreateStore)(initialState, reducer);
    }
    const store = createStore(initialState, reducer);

    return {
      dispatch(action) {
        console.log('>>>>>>> DISPATCH:\n' + formatObject(action) + '\n<<<<<<<');
        store.dispatch(action);
      },
      getState() {
        const state = store.getState();
        console.log('>>>>>>> GET STATE:\n' + formatObject(state) + '\n<<<<<<<');
        return state;
      },
    };
  }

  return enhancedCreateStore;
}

const formatObject = (obj) => {
  return JSON.stringify(obj, null, 2);
};

module.exports = logger;
