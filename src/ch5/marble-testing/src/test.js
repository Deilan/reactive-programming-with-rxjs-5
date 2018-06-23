/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { TestScheduler } from "rxjs/testing/TestScheduler";
import { Observable } from "rxjs";
import assert from "assert";

describe("Marble Testing", function() {
  it("Same marble sequence should pass", () => {
    const testScheduler = new TestScheduler(assert.deepEqual.bind(assert)); // (1)
    const sequence = "--a--b--|"; // (2)
    const source = testScheduler.createHotObservable(sequence); // (3)

    testScheduler.expectObservable(source).toBe(sequence); // (4)
    testScheduler.flush(); // (5)
  });
  it("Should properly merge and exclude earthquakes with magnitude 0", () => {
    const testScheduler = new TestScheduler(assert.deepEqual.bind(assert));
    const quakeMarbles1 = "--b---c--e"; // (6)
    const quakeMarbles2 = "a------d--";

    const quake1$ = testScheduler.createHotObservable(quakeMarbles1); // (7)
    const quake2$ = testScheduler.createHotObservable(quakeMarbles2);

    const expectedValues = { // (8)
      a: { richterScale: 2.6 },
      b: { richterScale: 3.4 },
      c: { richterScale: 1.3 },
      d: { richterScale: 0 },
      e: { richterScale: 6.2 }
    };

    const expected = "a-b---c--e"; // (9)

    const mergedQuakes$ = Observable.merge(quake1$, quake2$) // (10)
      .filter(q => q.richterScale && q.richterScale > 0);

    testScheduler
      .expectObservable(mergedQuakes$)
      .toBe(expected, expectedValues); // (11)

    testScheduler.flush();
  });
});
