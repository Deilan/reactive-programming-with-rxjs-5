/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";
const registerClicks = e => {
  console.log(e.clientX, e.clientY);
};
document.body.addEventListener("click", registerClicks);
let clicks = 0;
document.addEventListener("click", e => {
  if (clicks < 10) {
    if (e.clientX > window.innerWidth / 2) {
      console.log(e.clientX, e.clientY);
      clicks += 1;
    }
  } else {
    document.removeEventListener("click", registerClicks);
  }
});
Observable.fromEvent(document, "click")
  .filter(c => c.clientX > window.innerWidth / 2)
  .take(10)
  .subscribe(c => console.log(c.clientX, c.clientY));
