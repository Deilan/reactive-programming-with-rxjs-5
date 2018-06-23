/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
const next = Rx.ReactiveTest.next; // (1)
const complete = Rx.ReactiveTest.complete;
const subscribe = Rx.ReactiveTest.subscribe;

const scheduler = new Rx.TestScheduler(); // (2)

const quakes = scheduler
  .createHotObservable( // (3)
    next(100, { properties: 1 }),
    next(300, { properties: 2 }),
    next(550, { properties: 3 }),
    next(750, { properties: 4 }),
    next(1000, { properties: 5 }),
    complete(1100)
  );

QUnit.test('Test quake buffering', assert => {
  // (4)
  const results = scheduler.startScheduler(
    () => // (5)
    quakeBatches(scheduler),
    {
      created: 0,
      subscribed: 0,
      disposed: 1200
    }
  );

  const messages = results.messages; // (6)
  console.log(results.scheduler === scheduler);

  assert.equal(messages[0], next(501, [1, 2])); // (7)
  assert.equal(messages[1], next(1001, [3, 4, 5]));
  assert.equal(messages[2], complete(1100));
});
function quakeBatches(scheduler) {
  return quakes
    .pluck('properties')
    .bufferTime(500, null, scheduler || null)
    .filter(rows => rows.length > 0);
}

const next = Rx.ReactiveTest.next;
QUnit.test('Test value order', assert => {
  const scheduler = new Rx.TestScheduler();
  const subject = scheduler.createColdObservable(
    next(100, 'first'),
    next(200, 'second'),
    next(300, 'third')
  );

  const result = '';
  subject.subscribe(value => {
    result = value;
  });

  scheduler.advanceBy(100);
  assert.equal(result, 'first');

  scheduler.advanceBy(100);
  assert.equal(result, 'second');

  scheduler.advanceBy(100);
  assert.equal(result, 'third');
});
/*
quakes
  .pluck('properties')
  .map(makeRow)
  .bufferWithTime(500)
  .filter(function(rows) { return rows.length > 0; })
  .map(function(rows) {
    const fragment = document.createDocumentFragment();
    rows.forEach(function(row) {
      fragment.appendChild(row);
    });
    return fragment;
  })
  .subscribe(function(fragment) {
    table.appendChild(fragment);
  });
*/
