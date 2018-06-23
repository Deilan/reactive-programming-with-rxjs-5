/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
var Cycle = require('@cycle/core');
var Rx = Cycle.Rx;
var CycleDOM = require('@cycle/dom');
var CycleJSONP = require('@cycle/jsonp');

var makeJSONPDriver = CycleJSONP.makeJSONPDriver;
var makeDOMDriver = CycleDOM.makeDOMDriver;

var MAIN_URL = 'https://en.wikipedia.org';
var WIKI_URL = `${MAIN_URL}/wiki/`;
var API_URL = `${MAIN_URL}/w/api.php?action=query&list=search&format=json&srsearch=`;

function searchRequest(responses) {
  return responses.DOM
    .map('.search-field')
    .events('input')
    .debounceTime(300) //(1)
    .map(e => e.target.value) //(2)
    .filter(value => value.length > 2) //(3)
    .map(search => API_URL + search); //(4)
}

function vtreeElements(results) {
  var h = CycleDOM.h;
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

function vtreeElementsJSX(results) {
  results = results.map(result => {
    var link = WIKI_URL + result.title;
    return <div><a href={link}>{result.title}</a></div>;
  });

  return (
    <div>
      <h1>Wikipedia Search</h1>
      <input className="search-field" type="text" />
      <hr />
      <div>{results}</div>
    </div>
  );
}

function main(responses) {
  var vtree$ = responses.JSONP
    .filter(res$ => res$.request.indexOf(API_URL) === 0)
    .flatMap(Rx.helpers.identity)
    .pluck('query', 'search')
    .startWith([])
    .map(vtreeElements);

  return {
    DOM: vtree$,
    JSONP: searchRequest(responses)
  };
}

Cycle.run(main, {
  DOM: makeDOMDriver('#container'),
  JSONP: makeJSONPDriver()
});
