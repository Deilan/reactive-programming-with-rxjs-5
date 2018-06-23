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

const URL = `http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`;

const codeLayers = {};
const quakeLayer = L.layerGroup([]).addTo(map);
const identity = x => x; //(1)

function isHovering(element) {
  const over = Observable.fromEvent(element, "mouseover").map(identity(true)); //(2)
  const out = Observable.fromEvent(element, "mouseout").map(identity(false)); //(3)

  return over.merge(out); //(4)
}

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
    .flatMap(() =>
      Observable.ajax({
        url: URL,
        crossDomain: true
      })
    )
    .flatMap(result => Observable.from(result.response.features))
    .distinct(quake => quake.properties.code);

  quakes$.subscribe(quake => {
    const coords = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;

    const circle = L.circle([coords[1], coords[0]], size).addTo(map);
    quakeLayer.addLayer(circle);
    codeLayers[quake.id] = quakeLayer.getLayerId(circle);
  });

  const table = document.getElementById("quakes_info");
  quakes$
    .pluck("properties")
    .map(makeRow)
    .bufferTime(500)
    .filter(rows => rows.length > 0)
    .map(rows => {
      const fragment = document.createDocumentFragment();
      rows.forEach(row => {
        const circle = quakeLayer.getLayer(codeLayers[row.id]); // (5)

        isHovering(row).subscribe(hovering => { // (6)
          circle.setStyle({
            color: hovering ? "#ff0000" : "#0000ff"
          });
        });

        Observable.fromEvent(row, "click").subscribe(() => { // (7)
          map.panTo(circle.getLatLng());
        });

        fragment.appendChild(row);
      });
      return fragment;
    })
    .subscribe(fragment => {
      table.appendChild(fragment);
    });
}

Observable.fromEvent(document, "DOMContentLoaded").subscribe(initialize);
