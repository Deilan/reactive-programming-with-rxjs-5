/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs/Observable";
import L from "leaflet";

const QUAKE_URL = `http://earthquake.usgs.gov/earthquakes/
feed/v1.0/summary/all_day.geojson`;

function makeRow(props) {
  const row = document.createElement("tr");
  const time = new Date(props.time);

  row.id = props.net + props.code;

  [props.place, props.mag, time].forEach(text => {
    const cell = document.createElement("td");
    cell.textContent = text;
    row.appendChild(cell);
  });

  return row;
}

function initialize() {
  const quakes$ = Observable.interval(5000)
    .flatMap(() => {
      return loadJSONP({
        url: QUAKE_URL,
        callbackName: "eqfeed_callback"
      }).retry(3);
    })
    .flatMap(result => Observable.from(result.response.features))
    .distinct(quake => quake.properties.code)
    .publish()
    .refCount();

  quakes$.subscribe(quake => {
    const coords = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
  });

  const table = document.getElementById("quakes_info");
  quakes$
    .pluck("properties")
    .map(makeRow)
    .bufferTime(500) // (1)
    .filter(rows => rows.length > 0) // (2))
    .map(rows => {
      const fragment = document.createDocumentFragment();
      rows.forEach(row => {
        fragment.appendChild(row); // (3)
      });
      return fragment;
    })
    .subscribe(fragment => {
      table.appendChild(fragment); // (4)
    });
}

Observable.fromEvent(document, "DOMContentLoaded").subscribe(initialize);
