/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
{
  import { Subject, Observable } from 'rxjs/Observable';
  
  const subject$ = new Subject();
  const source$ = Observable
  .interval(300)
  .map(v => `Interval message #${v}`)
  .take(5);
  
  source$.subscribe(subject$);
  
  subject$.subscribe(
    next => console.log(`Next: ${next}`),
    error => console.log(`Error: ${error.message}`),
    () => console.log('Completed!')
  );
  
  subject$.next('Our message #1');
  subject$.next('Our message #2');
  
  setTimeout(subject$.complete, 1000);
}
{
  import { AsyncSubject, Observable } from 'rxjs/Observable';
  
  const delayedRange$ = Observable.range(0, 5).delay(1000);
  const subject$ = new AsyncSubject();
  
  delayedRange$.subscribe(subject$);
  
  subject$.subscribe(
    next => console.log('Value:', next),
    error => console.log('Error:', error),
    () => console.log('Completed.')
  );
}
{
  import { AsyncSubject, Observable } from 'rxjs/Observable';

  function getProducts(url) {
    let subject$;

    return Observable.create(observer$ => {
      //(1)
      if (!subject$) {
        subject$ = new AsyncSubject();
        Observable.ajax(url).subscribe(subject$); //(2)
      }
      return subject$.subscribe(observer$); //(3)
    });
  }

  const products$ = getProducts('/products'); //(4)
  // Will trigger request and receive the response when read
  products$
    .subscribe( //(5)
      next => console.log('Result 1:', next.response),
      error => console.log('ERROR', error)
    );

  // Will receive the result immediately because it's cached
  setTimeout(
    () => {
      //(6)
      products$.subscribe(
        next => console.log('Result 2:', next.response),
        error => console.log('ERROR', error)
      );
    },
    5000
  );
}
