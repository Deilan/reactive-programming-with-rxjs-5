/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { run } from "@cycle/core";
import { Observable } from "rxjs";
import { h, makeDOMDriver } from "@cycle/dom";
import { makeJSONPDriver } from "@cycle/jsonp";

const MAIN_URL = "https://en.wikipedia.org";
const WIKI_URL = `${MAIN_URL}/wiki/`;
const API_URL =
  `${MAIN_URL}/w/api.php?action=query&list=search&format=json&srsearch=`;

const SearchBox = require("./searchbox"); //(1)

function main(responses) {
  const wpSearchBox = SearchBox({

    DOM: responses.DOM, //(2)
    props$: Observable.of({
      apiUrl: API_URL
    })
  });

  const searchDOM$ = wpSearchBox.DOMTree; //(3)
  const searchResults$ = responses.JSONP
    .filter(res$ => res$.request.indexOf(API_URL) === 0)
    .concatAll()
    .pluck("query", "search")
    .startWith([]);

  return {
    JSONP: wpSearchBox.JSONPQuery, //(4)
    DOM: Observable.combineLatest(searchDOM$, searchResults$, (
      tree,
      links //(5)
    ) =>
      h("div", [
        h("h1", "Wikipedia Search "),
        tree,
        h("hr"),
        h(
          "div",
          links.map(link =>
            h("div", [h("a", { href: WIKI_URL + link.title }, link.title)])
          )
        )
      ])
    )
  };
}

run(main, {
  DOM: makeDOMDriver("#container"),
  JSONP: makeJSONPDriver()
});

