const createStore = require('../src/createStore');
const combineReducers = require('../src/combineReducers');
const { authReducer, initialState: initialAuthState } = require('./fixture/authReducer');
const { countReducer, initialState: initialCountState } = require('./fixture/countReducer');

describe('createStore', () => {
  it('exposes the public API', () => {
    const store = createStore(countReducer);
    expect(store).toHaveProperty('dispatch');
    expect(store).toHaveProperty('getState');
  });

  it('creates store with undefined as initial state', () => {
    const store = createStore(countReducer);
    const initialState = store.getState();
    expect(initialState).toBeUndefined();
  });

  it('creates store with null as initial state', () => {
    const store = createStore(countReducer, null);
    const initialState = store.getState();
    expect(initialState).toBe(null);
  });

  it('creates store with an empty array as initial state', () => {
    const store = createStore(countReducer, []);
    const initialState = store.getState();
    expect(initialState).toEqual([]);
  });

  it('creates store with an empty object as initial state', () => {
    const store = createStore(countReducer, {});
    const initialState = store.getState();
    expect(initialState).toEqual({});
  });

  it('creates store with a non-empty array as initial state', () => {
    const array = [1, 2, 'str'];
    const store = createStore(countReducer, array);
    const initialState = store.getState();
    expect(initialState).toEqual(array);
  });

  it('creates store with a non-empty object as initial state', () => {
    const object = { bar: 'hello', foo: 10 };
    const store = createStore(countReducer, object);
    const initialState = store.getState();
    expect(initialState).toEqual(object);
  });

  it('creates store with a number as initial state', () => {
    const store = createStore(countReducer, 10);
    const initialState = store.getState();
    expect(initialState).toEqual(10);
  });

  it('creates store with a string as initial state', () => {
    const store = createStore(countReducer, 'bar:foo');
    const initialState = store.getState();
    expect(initialState).toEqual('bar:foo');
  });

  it('throws if reducer is not a function', () => {
    expect(() => createStore())
      .toThrow(/^Redux/);
    expect(() => createStore('reducer'))
      .toThrow(/^Redux/);
    expect(() => createStore({ reducer: i => i }))
      .toThrow(/^Redux/);
    expect(() => createStore(i => i))
      .not.toThrow();
  });

});

describe('createStore with enhancer', () => {
  it('creates store with an identity enhancer', () => {
    const enhancer = (createStore) => createStore;
    const store = createStore(countReducer, 99, enhancer);

    expect(store).toHaveProperty('getState');
    expect(store).toHaveProperty('dispatch');

    expect(store.getState()).toBe(99);
    store.dispatch({ type: 'DECREMENT' });
    expect(store.getState()).toBe(98);
  });

  it('creates store with an enhancer', () => {
    expect.assertions(9);

    let spyDispatch;
    let spyGetState;
    const initialCount = 99;
    const spyEnhancer = (createStore) => {
      return (...args) => {
        expect(args[0]).toEqual(countReducer);
        expect(args[1]).toBe(initialCount);
        expect(args).toHaveLength(2);

        const store = createStore(...args);
        spyDispatch = jest.fn(store.dispatch);
        spyGetState = jest.fn(store.getState);

        return {
          ...store,
          dispatch: spyDispatch,
          getState: spyGetState,
        };
      };
    };

    const store = createStore(countReducer, initialCount, spyEnhancer);
    const action = { type: 'INCREMENT' };

    expect(store.getState()).toBe(initialCount);
    expect(spyGetState).toHaveBeenCalledTimes(1);

    store.dispatch(action);
    expect(spyDispatch).toHaveBeenCalledTimes(1);
    expect(spyDispatch).toHaveBeenLastCalledWith(action);

    expect(store.getState()).toBe(initialCount + 1);
    expect(spyGetState).toHaveBeenCalledTimes(2);
  });

  it('accepts enhancer as the second argument if initial state is missing', () => {
    expect.assertions(3);

    const spyEnhancer = (createStore) => {
      return (...args) => {
        expect(args[0]).toEqual(countReducer);
        expect(args[1]).toBe(undefined);
        expect(args).toHaveLength(2);
        return createStore(...args);
      };
    };
    createStore(countReducer, spyEnhancer);
  });

});

describe('createStore - store.dispatch - single reducer', () => {
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
    store = createStore(reducer, initialState);
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

describe('createStore - store.dispatch - combined reducer', () => {
  let store;

  beforeEach(() => {
    store = createStore(combineReducers({
      auth: authReducer,
      count: countReducer,
    }));
  });

  it('dispatches action in first reducer', () => {
    store.dispatch({ type: 'LOGIN', userName: 'tester' });
    expect(store.getState().auth).toEqual({ loggedIn: true, userName: 'tester' });
    expect(store.getState().count).toEqual(initialCountState);
  });

  it('dispatches action in second reducer', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState().auth).toEqual(initialAuthState);
    expect(store.getState().count).toEqual(1);
  });

});

describe('createStore - store.subscribe', () => {
  let store;

  beforeEach(() => {
    store = createStore(countReducer);
  });

  it('subscribes and unsubscribes one listener', () => {
    const spyListener = jest.fn();
    const unsubscribe = store.subscribe(spyListener);
    store.dispatch({});
    expect(spyListener).toHaveBeenCalledTimes(1);
    store.dispatch({});
    expect(spyListener).toHaveBeenCalledTimes(2);
    unsubscribe();
    store.dispatch({});
    expect(spyListener).toHaveBeenCalledTimes(2);
  });

  it('subscribes more than one listeners and listeners are called in correct order', () => {
    expect.assertions(6);

    const spyListener1 = jest.fn(() => {
      expect(spyListener2).toHaveBeenCalledTimes(0);
      expect(spyListener3).toHaveBeenCalledTimes(0);
    });
    const spyListener2 = jest.fn(() => {
      expect(spyListener1).toHaveBeenCalledTimes(1);
      expect(spyListener3).toHaveBeenCalledTimes(0);
    });
    const spyListener3 = jest.fn(() => {
      expect(spyListener1).toHaveBeenCalledTimes(1);
      expect(spyListener3).toHaveBeenCalledTimes(1);
    });

    store.subscribe(spyListener1);
    store.subscribe(spyListener2);
    store.subscribe(spyListener3);

    store.dispatch({});
  });

  it('unsubscribes listeners when there are more than one listeners', () => {
    const spyListener1 = jest.fn();
    const spyListener2 = jest.fn();
    const spyListener3 = jest.fn();

    const unsubscribe1 = store.subscribe(spyListener1);
    const unsubscribe2 = store.subscribe(spyListener2);
    const unsubscribe3 = store.subscribe(spyListener3);

    unsubscribe2();
    store.dispatch({});
    expect(spyListener1).toHaveBeenCalledTimes(1);
    expect(spyListener2).toHaveBeenCalledTimes(0);
    expect(spyListener3).toHaveBeenCalledTimes(1);

    unsubscribe1();
    store.dispatch({});
    expect(spyListener1).toHaveBeenCalledTimes(1);
    expect(spyListener2).toHaveBeenCalledTimes(0);
    expect(spyListener3).toHaveBeenCalledTimes(2);

    unsubscribe3();
    store.dispatch({});
    expect(spyListener1).toHaveBeenCalledTimes(1);
    expect(spyListener2).toHaveBeenCalledTimes(0);
    expect(spyListener3).toHaveBeenCalledTimes(2);
  });

  it('unsubscribes an already unsubscribed listener', () => {
    const spyListener = jest.fn();
    const unsubscribe = store.subscribe(spyListener);
    expect(() => {
      unsubscribe();
      unsubscribe();
    }).not.toThrow();
  });
});
