/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { run } from "@cycle/run"; //(1)
import { makeDOMDriver, div } from "@cycle/dom";
import { Observable } from 'rxjs' //(2)

const main = sources => { //(3)
  const vtree$ = Observable.of( //(4)
    div('My Awesome Cycle.js app')
  )
  const sinks = { //(5)
    DOM: vtree$
  }
  return sinks
};

const drivers = { //(6)
  DOM: makeDOMDriver("#app")
};

run(main, drivers); //(7)
