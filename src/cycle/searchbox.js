/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { h } from "@cycle/dom";
import { Observable } from "rxjs";

function searchBox(responses) {
  const props$ = responses.props$;
  const apiUrl$ = props$.map(props => props["apiUrl"]).first();

  const vtree$ = Observable.of(
    h("div", { className: "search-field" }, [h("input", { type: "text" })])
  );

  const searchQuery$ = apiUrl$.flatMap(apiUrl =>
    responses.DOM
      .map(".search-field")
      .events("input")
      .debounceTime(300)
      .map(e => e.target.value)
      .filter(value => value.length > 3)
      .map(searchTerm => apiUrl + searchTerm)
  );

  return {
    DOMTree: vtree$,
    JSONPQuery: searchQuery$
  };
}

module.exports = searchBox; // Export it as a module
