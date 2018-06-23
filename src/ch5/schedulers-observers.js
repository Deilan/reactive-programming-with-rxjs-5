/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable, Scheduler } from "rxjs";
const itemArray = [];
for (let i = 0; i < 1000; i++) {
  itemArray.push(i);
}
Observable.from(itemArray).subscribe();
const timeStart = Date.now();
Observable.from(itemArray).subscribe(null, null, () => {
  console.log(`Total time: ${Date.now() - timeStart}ms`);
});
{
const timeStart = Date.now();
Observable.from(itemArray, Scheduler.asap).subscribe(null, null, () => {
  console.log(`Total time: ${Date.now() - timeStart}ms`);
});
}
Observable.from(itemArray)
  .groupBy(value => value % 2 === 0)
  .map(groupedObservable => expensiveOperation(groupedObservable));
