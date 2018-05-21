const thunk = require('../../src/enhancers/redux-thunk');
const createStore = require('../../src/createStore');
const { countReducer } = require('../fixture/countReducer');

describe('thunk', () => {
  let store;
  beforeEach(() => {
    store = thunk(createStore)(countReducer, 99);
  });

  it('creates an enhanced store with correct initial state', () => {
    expect(store).toHaveProperty('getState');
    expect(store).toHaveProperty('dispatch');
    expect(store.getState()).toBe(99);
  });

  it('dispatches plain object action', () => {
    store.dispatch({ type: 'INCREMENT' });
    expect(store.getState()).toBe(100);
  });

  it('dispatches non-existing action', () => {
    store.dispatch({ type: Math.random() });
    expect(store.getState()).toBe(99);
  });

  it('dispatches function as action', () => {
    store.dispatch(i => i);
    expect(store.getState()).toBe(99);
  });

  it('dispatches plain object action and gets state in callback', () => {
    expect.assertions(3);

    store.dispatch((dispatch, getState) => {
      expect(getState()).toBe(99);
      dispatch({ type: 'DECREMENT' });
      expect(getState()).toBe(98);
    });
    expect(store.getState()).toBe(98);
  });

});

describe('thunk - integration test with redux', () => {
  let store;
  beforeEach(() => {
    store = createStore(countReducer, 99, thunk);
  });

  it('integrates with redux', () => {
    expect.assertions(6);

    expect(store).toHaveProperty('getState');
    expect(store).toHaveProperty('dispatch');
    expect(store.getState()).toBe(99);

    store.dispatch({type: 'INCREMENT'});
    expect(store.getState()).toBe(100);

    store.dispatch((dispatch, getState) => {
      expect(getState()).toBe(100);
      dispatch({type: 'INCREMENT'});
      expect(getState()).toBe(101);
    })
  });
});
