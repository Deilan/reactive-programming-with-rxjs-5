/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable, BehaviorSubject } from "rxjs";

const subject$ = new BehaviorSubject('Waiting for content');

subject$.subscribe(
  next => {
    document.body.textContent = next.response || next;
  },
  error => {
    document.body.textContent = 'There was an error retrieving content';
  }
);

Observable.ajax('/remote/content').subscribe(subject$);
