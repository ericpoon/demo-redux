function createStore(initialState, reducer, enhancer) {
  let _state = initialState;

  if (typeof enhancer === 'function') {
    return enhancer(createStore)(initialState, reducer);
  }

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

function compose(...functions) {

  if (functions.length === 0) return arg => arg;
  if (functions.length === 1) return functions[0];

  const composeTwo = (f, g) => {
    return (...args) => f(g(...args));
  };

  return functions.reduce((accumulated, current) => composeTwo(accumulated, current), i => i);
}

module.exports = {
  createStore,
  combineReducers,
  compose,
};
