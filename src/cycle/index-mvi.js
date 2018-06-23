/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { run } from "@cycle/core";
import { h, makeDOMDriver } from "@cycle/dom";
import { makeJSONPDriver } from "@cycle/jsonp";

const MAIN_URL = "https://en.wikipedia.org";
const WIKI_URL = `${MAIN_URL}/wiki/`;
const API_URL = `${MAIN_URL}/w/api.php?action=query&list=search&format=json&srsearch=`;

function intent(JSONP) {
  return JSONP.filter(res$ => res$.request.indexOf(API_URL) === 0)
    .concatAll()
    .pluck("query", "search");
}

function model(actions) {
  return actions.startWith([]);
}

function view(state) {
  return state.map(linkArray =>
    h("div", [
      h("h1", "Wikipedia Search "),
      h("input", {
        className: "search-field",
        attributes: { type: "text" }
      }),
      h("hr"),
      h(
        "div",
        linkArray.map(link =>
          h("div", [h("a", { href: WIKI_URL + link.title }, link.title)])
        )
      )
    ])
  );
}

function userIntent(DOM) {
  return DOM.map(".search-field")
    .events("input")
    .debounceTime(300)
    .map(e => e.target.value)
    .filter(value => value.length > 2)
    .map(search => API_URL + search);
}

function main(responses) {
  return {
    DOM: view(model(intent(responses.JSONP))),
    JSONP: userIntent(responses.DOM)
  };
}

run(main, {
  DOM: makeDOMDriver("#container"),
  JSONP: makeJSONPDriver()
});
