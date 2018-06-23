/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
stringArray // Represents an array of 1,000 strings
  .map(str => str.toUpperCase()) //(1)
  .filter(/^[A-Z]+$/.test) //(2)
  .forEach(str => console.log(str)); //(3)
stringObservable$ // Represents an observable emitting 1,000 strings
  .map(str => str.toUpperCase()) //(4)
  .filter(/^[A-Z]+$/.test) //(5)
  .subscribe(str => console.log(str)); //(6)
stringObservable$
  .map(str => str.toUpperCase())
  .filter(/^[A-Z]+$/.test)
  .take(5)
  .subscribe(str => console.log(str));
