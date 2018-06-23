/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
function wait(time, callback) {
  console.log("Starting async task");
  setTimeout(callback, time);
}

wait(1000, () => {
  console.log("Async task finished!");
});
const Rx = require("rxjs"); // Load RxJS
const fs = require("fs"); // Load Node.js Filesystem module

const Observable = Rx.Observable;
// Create an Observable from the readdir method
const readdir$ = Observable.bindNodeCallback(fs.readdir);

const source$ = readdir$("/Users/sergi"); // Send a delayed message

const subscription = source$.subscribe(
  res => console.log(`List of directories: ${res}`),
  error => console.log(`Error: ${error}`),
  () => console.log("Done!")
);
