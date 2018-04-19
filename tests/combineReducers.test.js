const combineReducers = require('../src/combineReducers');
const { authReducer } = require('./fixture/authReducer');
const { countReducer } = require('./fixture/countReducer');

it('combines valid reducers', () => {
  combineReducers({
    auth: authReducer,
    count: countReducer,
  });
});

it('combines reducers with no initial state', () => {
  expect(() => {
    combineReducers({
      auth: state => state,
      count: state => state,
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
