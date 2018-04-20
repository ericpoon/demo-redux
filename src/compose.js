// Note: asynchronous enhancers should be on the leftmost side of the composition chain

function compose(...functions) {

  if (functions.length === 0) return arg => arg;
  if (functions.length === 1) return functions[0];

  const composeTwo = (f, g) => {
    return (...args) => f(g(...args));
  };

  return functions.reduce((accumulated, current) => composeTwo(accumulated, current), i => i);
}

module.exports = compose;
