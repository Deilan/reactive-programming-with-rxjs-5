/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from 'rxjs';

const counter$ = Observable.interval(1000);

const subscription1 = counter$.subscribe(i => {
  console.log('Subscription 1:', i);
});

const subscription2 = counter$.subscribe(i => {
  console.log('Subscription 2:', i);
});

setTimeout(
  () => {
    console.log('Canceling subscription2!');
    subscription2.unsubscribe();
  },
  2000
);
const p = new Promise((resolve, reject) => {
  window.setTimeout(resolve, 5000);
});

p.then(() => console.log('Potential side effect!'));

const subscription = Observable
  .fromPromise(p)
  .subscribe(msg => console.log('Observable resolved!'));

subscription.unsubscribe();
