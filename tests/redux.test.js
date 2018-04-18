const { createStore, setReducer, combineReducers } = require('../redux');

describe('createStore', () => {
  it('creates a new store with no initial state', () => {
    const store = createStore();
    const initialState = store.getState();
    expect(initialState).toBeUndefined();
  });

  it('creates a new store with null as initial state', () => {
    const store = createStore(null);
    const initialState = store.getState();
    expect(initialState).toBe(null);
  });

  it('creates a new store with an empty array as initial state', () => {
    const store = createStore([]);
    const initialState = store.getState();
    expect(initialState).toEqual([]);
  });

  it('creates a new store with an empty object as initial state', () => {
    const store = createStore({});
    const initialState = store.getState();
    expect(initialState).toEqual({});
  });

  it('creates a new store with a non-empty array as initial state', () => {
    const array = [1, 2, 'str'];
    const store = createStore(array);
    const initialState = store.getState();
    expect(initialState).toEqual(array);
  });

  it('creates a new store with a non-empty object as initial state', () => {
    const object = { bar: 'hello', foo: 10 };
    const store = createStore(object);
    const initialState = store.getState();
    expect(initialState).toEqual(object);
  });

  it('creates a new store with a number as initial state', () => {
    const store = createStore(10);
    const initialState = store.getState();
    expect(initialState).toEqual(10);
  });

  it('creates a new store with a string as initial state', () => {
    const store = createStore('bar:foo');
    const initialState = store.getState();
    expect(initialState).toEqual('bar:foo');
  });

  it('creates a new store with a function as initial state', () => {
    const fn = jest.fn();
    const store = createStore(fn);
    const initialState = store.getState();
    expect(initialState).toEqual(fn);
  });
});

describe('store.dispatch - single reducer', () => {
  let store;
  const initialState = { count: 0 };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return { ...state, count: state.count + 1 };
      default:
        return state;
    }
  };

  beforeEach(() => {
    store = createStore(initialState);
    setReducer(reducer);
  });

  it('dispatches valid action', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toEqual({ count: 1 });
  });

  it('dispatches empty action', () => {
    store.dispatch({});
    const state = store.getState();
    expect(state).toEqual(initialState);
  });

  it('dispatches undefined action', () => {
    expect(() => {
      store.dispatch();
    }).toThrow(/^Redux/);
  });

  it('dispatches action - non-object', () => {
    expect(() => {
      store.dispatch(12345);
    }).toThrow(/^Redux/);

    expect(() => {
      store.dispatch('hello world');
    }).toThrow(/^Redux/);
  });

  it('dispatches action - array', () => {
    expect.assertions(2);

    expect(() => {
      store.dispatch([]);
    }).toThrow(/^Redux/);

    expect(() => {
      store.dispatch([1, 2, 3]);
    }).toThrow(/^Redux/);
  });

});

describe('store.dispatch - combined reducers', () => {
  const authReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN':
        return { loggedIn: true, userName: action.userName };
      case 'LOGOUT':
        return { loggedIn: false };
      default:
        return state;
    }
  };
  const countReducer = (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      default:
        return state;
    }
  };

  combineReducers({ auth: authReducer, count: countReducer });

  const initialState = { auth: { loggedIn: false }, count: 0 };
  let store;

  beforeEach(() => {
    store = createStore(initialState);
  });

  it('dispatches valid action in first reducer', () => {
    store.dispatch({ type: 'LOGIN', userName: 'tester' });
    expect(store.getState().auth).toEqual({ loggedIn: true, userName: 'tester'});
    expect(store.getState().count).toEqual(initialState.count);
  });

  it('dispatches valid action in first reducer', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().auth).toEqual(initialState.auth);
    expect(store.getState().count).toEqual(1);
  });

  it('dispatches empty action', () => {
    store.dispatch({});
    const state = store.getState();
    expect(state).toEqual(initialState);
  });

  it('dispatches undefined action', () => {
    expect(() => {
      store.dispatch();
    }).toThrow(/^Redux/);
  });

  it('dispatches action - non-object', () => {
    expect(() => {
      store.dispatch(12345);
    }).toThrow(/^Redux/);

    expect(() => {
      store.dispatch('hello world');
    }).toThrow(/^Redux/);
  });

  it('dispatches action - array', () => {
    expect.assertions(2);

    expect(() => {
      store.dispatch([]);
    }).toThrow(/^Redux/);

    expect(() => {
      store.dispatch([1, 2, 3]);
    }).toThrow(/^Redux/);
  });

});

describe('setReducer', () => {

  it('sets valid reducer', () => {
    const reducer = (state, action) => {
      switch (action.type) {
        case 'INCREMENT':
          return state + 1;
        case 'DECREMENT':
          return state - 1;
        default:
          return state;
      }
    };
    setReducer(reducer);
  });

  it('throws when setting invalid reducer', () => {
    expect(() => {
      const reducer = {};
      setReducer(reducer);
    }).toThrow(/^Redux/);
  });

});

describe('combineReducers', () => {

  const authReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN':
        return { loggedIn: true, userName: action.userName };
      case 'LOGOUT':
        return { loggedIn: false };
      default:
        return state;
    }
  };
  const countReducer = (state, action) => {
    switch (action.type) {
      case 'INCREMENT':
        return state + 1;
      case 'DECREMENT':
        return state - 1;
      default:
        return state;
    }
  };

  it('combines valid reducers', () => {
    combineReducers({
      auth: authReducer,
      count: countReducer,
    });
  });

  it('combines valid reducers with invalid state', () => {
    createStore('this is invalid state');
    expect(() => {
      combineReducers({
        auth: authReducer,
        count: countReducer,
      });
    }).toThrow(/^Redux/);
  });

  it('combines invalid reducers', () => {
    expect.assertions(4);

    expect(() => {
      combineReducers();
    }).toThrow(/^Redux/);

    expect(() => {
      combineReducers(null);
    }).toThrow(/^Redux/);

    expect(() => {
      combineReducers([authReducer, countReducer]);
    }).toThrow(/^Redux/);

    expect(() => {
      combineReducers({
        auth: authReducer({}, {}),
        count: countReducer({}, {}),
      });
    }).toThrow(/^Redux/);
  });

});
