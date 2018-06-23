/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";
function getJSON(arr) {
  return Observable.from(arr).map(JSON.parse);
}

getJSON([
  '{"1": 1, "2": 2}',
  '{"success: true}', // Invalid JSON string
  '{"enabled": true}'
]).subscribe(
  json => console.log("Parsed JSON: ", json),
  err => console.log(err.message)
);
{
function getJSON(arr) {
  if (!arr) {
    return Observable.throw(new Error("A parameter was expected."));
  }

  return Observable.from(arr).map(JSON.parse);
}

getJSON().subscribe(
  json => console.log("Parsed JSON: ", json),
  err => console.log(err.message)
);
}
{
function getJSON(arr) {
  return Observable.from(arr).map(JSON.parse);
}

const caught$ = getJSON(['{"1": 1, "2": 2}', '{"1: 1}']).catch(
  Observable.of({
    error: "There was an error parsing JSON"
  })
);

caught$.subscribe(
  json => console.log("Parsed JSON: ", json),
  err => console.log(err.message)
);
}

// This will try to retrieve the remote URL up to five times.
Observable.ajax("/products")
  .retry(5)
  .subscribe(
    xhr => console.log(xhr),
    err => console.error("ERROR: ", err)
  );
