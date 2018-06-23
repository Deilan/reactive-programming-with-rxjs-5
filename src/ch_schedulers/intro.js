/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
Scheduler.default.schedule(function sayHi(scheduler) {
  console.log('Hello (scheduled) World!');
});
Scheduler.default.scheduleWithRelative(
  2000 /* 2 seconds from now */,
  function sayDelayedHi() {
    console.log('Hello (delayed) World!');
  }
);
