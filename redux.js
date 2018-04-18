function createStore(initialState, reducer, enhancer) {
  let _state = initialState;

  return {
    dispatch(action) {
      if (typeof action === 'object' && !Array.isArray(action)) {
        _state = reducer(_state, action);
      } else {
        throw new Error('Redux: Action must be an object');
      }
    },
    getState() {
      return _state;
    },
  };
}

function combineReducers(reducers) {
  if (!reducers) {
    throw new Error('Redux: Invalid reducers: ' + reducers);
  }

  if (typeof reducers !== 'object' || Array.isArray(reducers)) {
    throw new Error('Redux: Combined reducers must be an object of {key: reducer} as key-value pairs');
  }

  for (const key in reducers) {
    if (typeof reducers[key] !== 'function') {
      throw new Error('Redux: Each reducer in Combined reducers must be a function\nInvalid reducer:\n' + reducers[key]);
    }

    const initialState = reducers[key](undefined, { type: '@@&&Redux/INIT' });
    if (typeof initialState === 'undefined') {
      throw new Error(`Redux: Initial state of reducer '${key}' is undefined`);
    }
  }

  return (state, action) => {
    const nextState = {};
    for (const key in reducers) {
      const reducer = reducers[key];
      nextState[key] = reducer(state ? state[key] : undefined, action);
    }
    return nextState;
  };
}

module.exports = {
  createStore,
  combineReducers,
};
