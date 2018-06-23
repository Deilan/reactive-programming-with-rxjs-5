/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";

const button = document.getElementById("retrieveDataBtn");
const source1 = Observable.ajax.getJSON("/resource1").pluck("name");
const source2 = Observable.ajax.getJSON("/resource2").pluck("props", "name");

const getResults = amount =>
  source1
    .merge(source2)
    .pluck("names")
    .flatMap(array => Observable.from(array))
    .distinct()
    .take(amount);

const clicks = Observable.fromEvent(button, "click");

clicks
  .debounceTime(1000)
  .flatMap(getResults(5))
  .subscribe(
    value => console.log("Received value", value),
    err => console.error(err),
    () => console.log("All values retrieved!")
  );
