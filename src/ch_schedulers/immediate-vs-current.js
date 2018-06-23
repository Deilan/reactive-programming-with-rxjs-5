/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
console.log('Before subscription');

Observable
  .range(1, 5)
  .do(a => {
    console.log('Processing value', a);
  })
  .map(value => value * value)
  .subscribe(value => {
    console.log('Emitted', value);
  });

console.log('After subscription');
console.log('Before subscription');
Observable
  .range(1, 5)
  .do(value => {
    console.log('Processing value', value);
  })
  .observeOn(Scheduler.default)
  .map(value => value * value)
  .subscribe(value => {
    console.log('Emitted', value);
  });
console.log('After subscription');

// Be careful: the code below will freeze your environment!
Observable.of(10).repeat().take(1).subscribe(value => {
  console.log(value);
});
var scheduler = Scheduler.currentThread;
Observable.of(10, scheduler).repeat().take(1).subscribe(value => {
  console.log(value);
});

function scheduleTasks(scheduler) {
  var leafAction = () => console.log('----leafAction.');
  var innerAction = () => {
    console.log('--innerAction start.');
    scheduler.schedule(leafAction);
    console.log('--innerAction end.');
  };
  var outerAction = () => {
    console.log('outer start.');
    scheduler.schedule(innerAction);
    console.log('outer end.');
  };
  scheduler.schedule(outerAction);
}

function CurrentThreadExample() {
  scheduleTasks(Scheduler.currentThread);
  /*Output:
    outer start.
    outer end.
    --innerAction start.
    --innerAction end.
    ----leafAction.
    */
}

function ImmediateExample() {
  scheduleTasks(Scheduler.immediate);
  /*Output:
    outer start.
    --innerAction start.
    ----leafAction.
    --innerAction end.
    outer end.
    */
}

CurrentThreadExample();
