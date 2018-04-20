function createStore(reducer, initialState, enhancer) {
  const _listeners = [];
  let _state = initialState;

  if (typeof reducer !== 'function') {
    throw new Error('Redux: Reducer must be a function');
  }

  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, initialState);
  }

  return {
    dispatch(action) {
      if (typeof action === 'object' && !Array.isArray(action)) {
        for (const i in _listeners) {
          _listeners[i]();
        }
        _state = reducer(_state, action);
      } else {
        throw new Error('Redux: Action must be an object');
      }
    },
    getState() {
      return _state;
    },
    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('Redux: Listener must be a function');
      }
      _listeners.push(listener);
      return () => {
        const index = _listeners.indexOf(listener);
        _listeners.splice(index, 1);
      };
    },
  };
}

module.exports = createStore;
