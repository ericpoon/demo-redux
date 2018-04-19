const createStore = require('../src/createStore');
const combineReducers = require('../src/combineReducers');
const { authReducer, initialState: initialAuthState } = require('./fixture/authReducer');
const { countReducer, initialState: initialCountState } = require('./fixture/countReducer');

describe('createStore', () => {
  it('exposes the public API', () => {
    const store = createStore(undefined, countReducer);
    expect(store).toHaveProperty('dispatch');
    expect(store).toHaveProperty('getState');
  });

  it('creates a new store with undefined as initial state', () => {
    const store = createStore(undefined, countReducer);
    const initialState = store.getState();
    expect(initialState).toBeUndefined();
  });

  it('creates a new store with null as initial state', () => {
    const store = createStore(null, countReducer);
    const initialState = store.getState();
    expect(initialState).toBe(null);
  });

  it('creates a new store with an empty array as initial state', () => {
    const store = createStore([], countReducer);
    const initialState = store.getState();
    expect(initialState).toEqual([]);
  });

  it('creates a new store with an empty object as initial state', () => {
    const store = createStore({}, countReducer);
    const initialState = store.getState();
    expect(initialState).toEqual({});
  });

  it('creates a new store with a non-empty array as initial state', () => {
    const array = [1, 2, 'str'];
    const store = createStore(array, countReducer);
    const initialState = store.getState();
    expect(initialState).toEqual(array);
  });

  it('creates a new store with a non-empty object as initial state', () => {
    const object = { bar: 'hello', foo: 10 };
    const store = createStore(object, countReducer);
    const initialState = store.getState();
    expect(initialState).toEqual(object);
  });

  it('creates a new store with a number as initial state', () => {
    const store = createStore(10, countReducer);
    const initialState = store.getState();
    expect(initialState).toEqual(10);
  });

  it('creates a new store with a string as initial state', () => {
    const store = createStore('bar:foo', countReducer);
    const initialState = store.getState();
    expect(initialState).toEqual('bar:foo');
  });

  it('creates a new store with a function as initial state', () => {
    const fn = jest.fn();
    const store = createStore(fn, countReducer);
    const initialState = store.getState();
    expect(initialState).toEqual(fn);
  });

  it('throws if reducer is not a function', () => {
    expect(() => createStore(undefined))
      .toThrow(/^Redux/);
    expect(() => createStore(undefined, 'reducer'))
      .toThrow(/^Redux/);
    expect(() => createStore(undefined, { reducer: i => i }))
      .toThrow(/^Redux/);
    expect(() => createStore(undefined, i => i))
      .not.toThrow();
  });

});

describe('createStore with enhancer', () => {
  it('creates a new store with an identity enhancer', () => {
    const enhancer = (createStore) => createStore;
    const store = createStore(99, countReducer, enhancer);

    expect(store).toHaveProperty('getState');
    expect(store).toHaveProperty('dispatch');

    expect(store.getState()).toBe(99);
    store.dispatch({ type: 'DECREMENT' });
    expect(store.getState()).toBe(98);
  });

  it('creates a new store with an enhancer', () => {
    expect.assertions(9);

    let spyDispatch;
    let spyGetState;
    const initialCount = 99;
    const spyEnhancer = (createStore) => {
      return (...args) => {
        expect(args[0]).toBe(initialCount);
        expect(args[1]).toEqual(countReducer);
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

    const store = createStore(initialCount, countReducer, spyEnhancer);
    const action = { type: 'INCREMENT' };

    expect(store.getState()).toBe(99);
    expect(spyGetState).toHaveBeenCalledTimes(1);

    store.dispatch(action);
    expect(spyDispatch).toHaveBeenCalledTimes(1);
    expect(spyDispatch).toHaveBeenLastCalledWith(action);

    expect(store.getState()).toBe(100);
    expect(spyGetState).toHaveBeenCalledTimes(2);
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
    store = createStore(initialState, reducer);
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
    store = createStore(undefined, combineReducers({
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
