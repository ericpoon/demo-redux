const compose = require('../src/compose');

it('composes 0 function', () => {
  expect(compose()(5)).toBe(5);
});

it('composes 1 function', () => {
  const f = x => x * 2;

  expect(compose(f)(5)).toBe(10);
});

it('composes 2 functions', () => {
  const f = x => x * 2;
  const g = x => x + 100;

  expect(compose(f, g)(5)).toBe(210);
});

it('composes more than 2 functions', () => {
  const double = x => x * 2;
  const plus100 = x => x + 100;
  const square = x => x * x;

  expect(compose(double, plus100, square, plus100)(5)).toBe(22250);
});
