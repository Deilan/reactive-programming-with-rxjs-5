/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";
Observable.from(["Adrià", "Julian", "Jen", "Sergi"]).subscribe(
  x => console.log(`Next: ${x}`),
  err => console.log("Error:", err),
  () => console.log("Completed")
);

const names = Observable.from(["Adrià", "Julian", "Jen", "Sergi"]);

names.subscribe(value => console.log(`Next: ${value}`));
