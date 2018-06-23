/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
var arr = [];
for (var i = 0; i < 1000; i++) {
  arr.push(i);
}
Observable.from(arr).subscribe();
var timeStart = Date.now();
Observable.from(arr).subscribe(
  function onNext() {},
  function onError() {},
  function onCompleted() {
    console.log(`Total time: ${Date.now() - timeStart}ms`);
  }
);
var timeStart = Date.now();
Observable.from(arr, null, null, Scheduler.default).subscribe(
  function onNext() {},
  function onError() {},
  function onCompleted() {
    console.log(`Total time: ${Date.now() - timeStart}ms`);
  }
);
arr
  .groupBy(value => value % 2 === 0)
  .map(groupedObservable => expensiveOperation(groupedObservable));
