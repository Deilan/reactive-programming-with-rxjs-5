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

const observer = Subscriber.create(
  x => console.log(`Next: ${x}`),
  err => console.log(`Error: ${err}`),
  () => console.log("Completed")
);

observable.subscribe(observer);
function get(url) {
  return Observable.create(subscriber => {
    // Make a traditional Ajax request
    const req = new XMLHttpRequest();
    req.open("GET", url);

    req.onload = () => {
      if (req.status === 200) {
        // If the status is 200, meaning there have been no problems,
        // yield the result to listeners and complete the sequence
        subscriber.next(req.response);
        subscriber.complete();
      } else {
        // Otherwise, signal to listeners that there has been an error
        subscriber.error(new Error(req.statusText));
      }
    };

    req.onerror = () => {
      subscriber.error(new Error("Unknown Error"));
    };

    req.send();
  });
}

// Create an Ajax Observable
const test = get("/api/contents.json");
// Subscribe an Observer to it
test.subscribe(
  value => console.log(`Result: ${value}`),
  error => console.log(`Error: ${error}`),
  () => console.log("Completed")
);
