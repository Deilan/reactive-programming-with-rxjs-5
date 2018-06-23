/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { run } from "@cycle/run"; //(1)
import { makeDOMDriver, div, h1, input, hr, a } from "@cycle/dom";
import {Observable} from "rxjs"; //(2)
import { html } from "snabbdom-jsx";

const MAIN_URL = "https://en.wikipedia.org";
const WIKI_URL = `${MAIN_URL}/wiki/`;
const API_URL = `${MAIN_URL}/w/api.php?` + 
  `action=query&list=search&format=json&srsearch=`;

function searchRequest(responses) {
  return responses.DOM
    .map(".search-field")
    .events("input")
    .debounceTime(300) //(3)
    .map(e => e.target.value) //(4)
    .filter(value => value.length > 2) //(5)
    .map(search => API_URL + search); //(6)
}

function vtreeElements(results) {
  return div([
    h1("Wikipedia Search "),
    input({
      className: "search-field",
      attributes: { type: "text" }
    }),
    hr(),
    div(
      results.map(result =>
        div([a({ href: WIKI_URL + result.title }, result.title)])
      )
    )
  ]);
}
function vtreeElementsJSX(results) {
  results = results.map(result => {
    var link = WIKI_URL + result.title;
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

const main = () => {
  //(7)
  const vtree$ = Observable.of(
    //(8)
    div("My Awesome Cycle.js app")
  );
  const sinks = {
    //(9)
    DOM: vtree$
  };
  return sinks;
};

const drivers = {
  //(10)
  DOM: makeDOMDriver("#app")
};

run(main, drivers); //(11)
