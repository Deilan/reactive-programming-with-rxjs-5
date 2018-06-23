/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";
Observable.range(1, 3);
const a$ = Observable.interval(200).map(i => `A${i}`);
const b$ = Observable.interval(100).map(i => `B${i}`);

Observable.merge(a$, b$).subscribe(x => {
  console.log(x);
});

// Item:  0
// Item:  1
// Item:  2
// Item:  1
// Item:  3
// Item:  2
// ...
//
//
const average$ = Observable
  .range(0, 5)
  .reduce(
    (previous, current) => {
      return {
        sum: previous.sum + current,
        count: previous.count + 1
      };
    },
    { sum: 0, count: 0 }
  )
  .map(result => result.sum / result.count);

average$.subscribe(x => console.log("Average is: ", x));
{
const average$ = Observable.interval(1000)
  .scan(
    (previous, current) => {
      return {
        sum: previous.sum + current,
        count: previous.count + 1
      };
    },
    { sum: 0, count: 0 }
  )
  .map(result => result.sum / result.count);
}
