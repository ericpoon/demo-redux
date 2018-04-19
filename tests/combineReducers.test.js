const combineReducers = require('../src/combineReducers');
const { authReducer } = require('./fixture/authReducer');
const { countReducer } = require('./fixture/countReducer');

it('returns a composite reducer that maps state keys to given reducers', () => {
  const reducer = combineReducers({
    auth: authReducer,
    count: countReducer,
  });

  const s1 = reducer({}, { type: 'LOGIN', userName: 'Foo' });
  expect(s1.auth).toEqual({ loggedIn: true, userName: 'Foo' });
  const s2 = reducer(s1, { type: 'INCREMENT' });
  expect(s2.auth).toEqual(s1.auth);
  expect(s2.count).toEqual(1);
});

it('throws if combining reducers that have no initial state', () => {
  expect(() => {
    combineReducers({
      auth: state => state,
      count: state => state,
    });
  }).toThrow(/^Redux/);
});

it('throws if combining invalid reducers', () => {
  expect.assertions(5);

  expect(() => combineReducers())
    .toThrow(/^Redux/);

  expect(() => combineReducers(null))
    .toThrow(/^Redux/);

  expect(() => {
    combineReducers([authReducer, countReducer]);
  }).toThrow(/^Redux/);

  expect(() => {
    combineReducers({
      auth: authReducer({}, {}),
      count: countReducer({}, {}),
    });
  }).toThrow(/^Redux/);

  expect(() => {
    combineReducers({
      auth: authReducer,
      count: countReducer({}, {}),
    });
  }).toThrow(/^Redux/);
});
