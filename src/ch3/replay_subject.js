/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
const subject$ = new Rx.Subject();

subject$.next(1);

subject$.subscribe(n => {
  console.log('Received value:', n);
});

subject$.next(2);
subject$.next(3);
const subject$ = new Rx.ReplaySubject();

subject$.next(1);

subject$.subscribe(n => {
  console.log('Received value:', n);
});

subject$.next(2);
subject$.next(3);
const subject$ = new Rx.ReplaySubject(2); // Buffer size of 2

subject$.next(1);
subject$.next(2);
subject$.next(3);

subject$.subscribe(n => {
  console.log('Received value:', n);
});
const subject$ = new Rx.ReplaySubject(null, 200); // Buffer size of 200ms

setTimeout(() => subject$.next(1), 100);
setTimeout(() => subject$.next(2), 200);
setTimeout(() => subject$.next(3), 300);
setTimeout(
  () => {
    subject$.subscribe(n => {
      console.log('Received value:', n);
    });

    subject$.next(4);
  },
  350
);
