const Observable = require('zen-observable');

Observable.of(1, 2, 3).subscribe(x => console.log(x));

let observable = new Observable(observer => {
  let count = 1;
  let timer = setInterval(() => {
    observer.next('hello ' + count++);
  }, 1000);
  let completionTimer = setTimeout(() => {
    observer.complete();
  }, 10000);

  return () => {
    clearTimeout(timer);
    clearInterval(completionTimer);
  };
});

let subscription = observable.subscribe({
  next(x) {
    console.log(x);
  },
  error(err) {
    console.log(`Finished with error: ${ err }`);
  },
  complete() {
    console.log('Finished');
  },
});
