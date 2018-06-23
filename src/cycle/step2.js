/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
var Cycle = require('@cycle/core');
var CycleDOM = require('@cycle/dom');
var CycleJSONP = require('@cycle/jsonp');
var Rx = Cycle.Rx;
var h = CycleDOM.h;

function searchRequest(responses) {
  return responses.DOM
    .map('.search-field')
    .events('input')
    .debounceTime(300)
    .map(e => e.target.value)
    .filter(value => value.length > 2)
    .map(search => API_URL + search);
}

function vtreeElements(results) {
  return h('div', [
    h('h1', 'Wikipedia Search '),
    h('input', {
      className: 'search-field',
      attributes: { type: 'text' }
    }),
    h('hr'),
    h(
      'div',
      results.map(result =>
        h('div', [
          h('a', { href: WIKI_URL + result.title }, result.title)
        ]))
    )
  ]);
}

function main(responses) {
  return {
    DOM: Observable.of(CycleDOM.h('span', 'Hey there!')),
    JSONP: searchRequest(responses)
  };
}

var drivers = {
  DOM: CycleDOM.makeDOMDriver('#container'),
  JSONP: CycleJSONP.makeJSONPDriver()
};

Cycle.run(main, drivers);
