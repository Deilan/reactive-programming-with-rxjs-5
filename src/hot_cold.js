/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs/Observable";
const onMove = Observable.fromEvent(document, "mousemove");
onMove.subscribe(e => {
  console.log(`Subscription 1: ${e.clientX} ${e.clientY}`);
});
onMove.subscribe(e => {
  console.log(`Subscription 2: ${e.clientX} ${e.clientY}`);
});

// Result:
// Subscription 1: 23 24
// Subscription 2: 23 24
// Subscription 1: 34 37
// Subscription 2: 34 37
// Subscription 1: 46 49
// Subscription 2: 46 49
// ...

function printValue(value) {
  console.log(value);
}

const rangeToFive = Observable.range(1, 5);
const obs1 = rangeToFive.subscribe(printValue); // 1, 2, 3, 4, 5
const obs2 = Observable.of().delay(2000).flatMap(() => {
  // Creates an empty Observable
  return rangeToFive.subscribe(printValue); // 1, 2, 3, 4, 5
});

const source = Observable.interval(2000);
source.subscribe(x => {
  console.log(`Subscription 1, next value: ${x}`);
});

source.subscribe(x => {
  console.log(`Subscription 2: next value: ${x}`);
});

const source = Observable.interval(1000);
source.subscribe(x => {
  console.log(`Subscription 1: ${x}`);
});

setTimeout(() => {
  source.subscribe(x => {
    console.log(`Subscription 2: ${x}`);
  });
}, 3000);

// Create an Observable that yields a value every second
const source = Observable.interval(1000);
const publisher = source.publish();

// Even if we are subscribing, no values are pushed yet.
publisher.subscribe(x => {
  console.log(`Subscription 1: ${x}`);
});

// publisher connects and starts publishing values
publisher.connect();

setTimeout(() => {
  // Five seconds later, we subscribe to it and start receiving
  // current values, not the whole sequence.
  publisher.subscribe(x => {
    console.log(`Subscription 2: ${x}`);
  });
}, 5000);
