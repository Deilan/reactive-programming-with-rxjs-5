/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";

function XHRObservable(url) {
  return Observable.create(observer => {
    const oXHR = new XMLHttpRequest();
    oXHR.open("GET", url, true);
    oXHR.onreadystatechange = oEvent => {
      if (oXHR.readyState === 4) {
        if (oXHR.status === 200) {
          observer.next(oXHR);
          observer.complete();
        } else {
          observer.error(oXHR.statusText);
        }
      }
    };
    oXHR.send(null);
  });
}

XHRObservable("/products").subscribe(
  xhr => console.log(xhr),
  err => console.error(err)
);
Observable.ajax("/api/contents.json").subscribe(
  data => console.log(data.response),
  err => console.error(err)
);
