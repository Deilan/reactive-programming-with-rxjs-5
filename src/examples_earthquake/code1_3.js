/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from 'rxjs/Observable';
const QUAKE_URL = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/" +
  "summary/all_day.geojsonp";
const quakes$ = Observable
  .interval(5000)
  .flatMap(() => loadJSONP({
      url: QUAKE_URL,
      callbackName: "eqfeed_callback"
    })
    .retry(3))
  .flatMap(result => Observable.from(result.response.features))
  .distinct(quake => quake.properties.code);

quakes$.subscribe(quake => {
  const coords = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;

  L.circle([coords[1], coords[0]], size).addTo(map);
});
