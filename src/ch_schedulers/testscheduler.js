/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
var onNext = Rx.ReactiveTest.next; // (1)
var onCompleted = Rx.ReactiveTest.complete;
var subscribe = Rx.ReactiveTest.subscribe;

var scheduler = new Rx.TestScheduler(); // (2)

var quakes = scheduler
  .createHotObservable( // (3)
    onNext(100, { properties: 1 }),
    onNext(300, { properties: 2 }),
    onNext(550, { properties: 3 }),
    onNext(750, { properties: 4 }),
    onNext(1000, { properties: 5 }),
    onCompleted(1100)
  );

QUnit.test('Test quake buffering', assert => {
  // (4)
  var results = scheduler.startScheduler(
    () => // (5)
    quakeBatches(scheduler),
    {
      created: 0,
      subscribed: 0,
      disposed: 1200
    }
  );

  var messages = results.messages; // (6)
  console.log(results.scheduler === scheduler);

  assert.equal(messages[0], onNext(501, [1, 2])); // (7)

  assert.equal(messages[1], onNext(1001, [3, 4, 5]));

  assert.equal(messages[2], onCompleted(1100));
});
function quakeBatches(scheduler) {
  return quakes
    .pluck('properties')
    .bufferTime(500, null, scheduler || null)
    .filter(rows => rows.length > 0);
}

var onNext = Rx.ReactiveTest.next;
QUnit.test('Test value order', assert => {
  var scheduler = new Rx.TestScheduler();
  var subject = scheduler.createColdObservable(
    onNext(100, 'first'),
    onNext(200, 'second'),
    onNext(300, 'third')
  );

  var result = '';
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
    var fragment = document.createDocumentFragment();
    rows.forEach(function(row) {
      fragment.appendChild(row);
    });
    return fragment;
  })
  .subscribe(function(fragment) {
    table.appendChild(fragment);
  });
*/
