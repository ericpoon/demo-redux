function createStore(reducer, initialState, enhancer) {

  if (typeof initialState === 'function' && typeof enhancer === 'undefined') {
    // accept enhancer as the second argument is initial state is not provided
    enhancer = initialState;
    initialState = undefined;
  }

  const _listeners = [];
  let _state = initialState;
  let _isDispatching = false;

  if (typeof reducer !== 'function') {
    throw new Error('Redux: Reducer must be a function');
  }

  if (typeof enhancer === 'function') {
    return enhancer(createStore)(reducer, initialState);
  }

  return {
    dispatch(action) {
      if (typeof action === 'object' && !Array.isArray(action)) {
        _isDispatching = true;
        try {
          _state = reducer(_state, action);
          _isDispatching = false;
        } catch (e) {
          throw e;
        }

        for (const i in _listeners) {
          _listeners[i]();
        }

      } else {
        throw new Error('Redux: Action must be an object');
      }
    },
    getState() {
      if (_isDispatching) {
        throw new Error('Redux: Cannot get state when dispatching, last dispatch may throw exception, try re-dispatch again');
      }
      return _state;
    },
    subscribe(listener) {
      if (_isDispatching) {
        throw new Error('Redux: Cannot subscribe when dispatching, last dispatch may throw exception, try re-dispatch again');
      }
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
