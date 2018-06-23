/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from 'rxjs';
const values$ = Observable.from([
  Observable.of(1, 2, 3),
  Observable.of(4, 5, 6),
  Observable.of(7, 8, 9)
]);

// values$ is an Observable that emits three Observables

values$.flatMap(v => v).subscribe(v => console.log(v));
