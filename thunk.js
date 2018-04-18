module.exports = function (action, dispatch, getState) {
  if (typeof action === 'object') {
    dispatch(action);
    return;
  }
  if (typeof action !== 'function') {
    throw new Error('Thunk: action is not a function.');
  }

  action(dispatch, getState);
};
