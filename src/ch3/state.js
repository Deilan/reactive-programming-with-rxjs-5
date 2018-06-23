/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
let evenTicks = 0;

function updateDistance(i) {
  if (i % 2 === 0) {
    evenTicks += 1;
  }
  return evenTicks;
}
const ticksObservable = Observable.interval(1000).map(updateDistance);

ticksObservable.subscribe(() => {
  console.log(`Subscriber 1 - evenTicks: ${evenTicks} so far`);
});

ticksObservable.subscribe(() => {
  console.log(`Subscriber 2 - evenTicks: ${evenTicks} so far`);
});
function updateDistance(acc, i) {
  if (i % 2 === 0) {
    acc += 1;
  }
  return acc;
}

const ticksObservable = Observable.interval(1000).scan(updateDistance, 0);

ticksObservable.subscribe(evenTicks => {
  console.log(`Subscriber 1 - evenTicks: ${evenTicks} so far`);
});

ticksObservable.subscribe(evenTicks => {
  console.log(`Subscriber 2 - evenTicks: ${evenTicks} so far`);
});
