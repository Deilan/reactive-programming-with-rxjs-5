/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { run } from "@cycle/run";
import { makeDOMDriver, div, h1, input, hr, a } from "@cycle/dom";
import Rx from "rxjs";
import makeJSONPDriver from "@cycle/jsonp";

const MAIN_URL = "https://en.wikipedia.org";
const WIKI_URL = `${MAIN_URL}/wiki/`;
const API_URL = `${MAIN_URL}/w/api.php?action=query&list=search&format=json&srsearch=`;

function searchRequest(responses) {
  return responses.DOM
    .map(".search-field")
    .events("input")
    .debounceTime(300)
    .map(e => e.target.value)
    .filter(value => value.length > 2)
    .map(search => API_URL + search);
}

function vtreeElements(results) {
  results = results.map(result => {
    const link = WIKI_URL + result.title;
    return (
      <div>
        <a href={link}>{result.title}</a>
      </div>
    );
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
const main = sources => {
  const vtree$ = sources.JSONP
    .filter(res$ => res$.request.indexOf(API_URL) === 0) //(1)
    .mergeAll() //(2)
    .pluck("query", "search") //(3)
    .startWith([]) //(4)
    .map(vtreeElements); //(5)

  const sinks = {
    DOM: vtree$,
    JSONP: searchRequest(sources)
  };
  return sinks;
};
const drivers = {
  DOM: makeDOMDriver("#app"),
  JSONP: makeJSONPDriver()
};

run(main, drivers);
