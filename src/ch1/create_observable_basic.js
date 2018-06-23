/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable, Subscriber } from "rxjs";
const observable = Observable.create(observer => {
  observer.next("Simon");
  observer.next("Jen");
  observer.next("Sergi");
  observer.complete(); // We are done
});

const subscriber = Subscriber.create(
  value => console.log(`Next: ${value}`),
  error => console.log(`Error: ${error}`),
  () => console.log("Completed")
);

observable.subscribe(subscriber);
