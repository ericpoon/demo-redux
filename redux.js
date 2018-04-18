let _state;
let _reducers;
let _middleware;

const _reduce = (action) => {
  if (typeof _reducers === 'function') {
    _state = _reducers(_state, action);
    return;
  }

  Object.keys(_reducers).forEach(key => {
    const reducer = _reducers[key];
    if (_state === null || _state === undefined) _state = {};
    _state[key] = reducer(_state[key], action);
  });
};

function createStore(initialState) {
  _state = initialState;

  return {
    dispatch(action) {
      if (_middleware) {
        _middleware(action, _reduce, this.getState);
        return;
      }

      if (typeof action === 'object' && !Array.isArray(action)) {
        _reduce(action);
      } else {
        throw new Error('Redux: Action must be an object');
      }
    },
    getState() {
      if (typeof _state === 'object' && _state !== null) {
        if (Array.isArray(_state)) return [..._state];
        else return { ..._state };
      } else {
        return _state;
      }
    },
  };
}

function setReducer(reducer) {
  if (typeof reducer !== 'function') {
    throw new Error('Redux: Reducer must be a function');
  }
  _reducers = reducer;
}

function combineReducers(reducers) {
  if (!reducers) {
    throw new Error('Redux: Invalid reducers, ' + reducers);
  }

  if (typeof reducers !== 'object' || Array.isArray(reducers)) {
    throw new Error('Redux: Combined reducers must be an object of {name: reducer} as key-value pairs');
  }

  for (const name in reducers) {
    if (typeof reducers[name] !== 'function') {
      throw new Error('Redux: Each reducer in Combined reducers must be a function\nInvalid reducer:\n' + reducers[name]);
    }
  }

  if (_state === undefined || _state === null || typeof _state === 'object') {
    _reducers = reducers;
  } else {
    throw new Error('Redux: State must be an object and have the same shape of reducers\nCurrent state:\n' + _state);
  }
}

function applyMiddleware(middleware) {
  _middleware = middleware;
}

module.exports = {
  createStore,
  setReducer,
  combineReducers,
  applyMiddleware,
};
