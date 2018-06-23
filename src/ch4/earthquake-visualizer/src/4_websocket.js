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

const codeLayers = {};
const quakeLayer = L.layerGroup([]).addTo(map);

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

/*
function initialize() {
  const socket$ = Observable.webSocket("ws://127.0.0.1:8080");
  ...
*/

function initialize() {
  const socket$ = Observable.webSocket("ws://127.0.0.1:8080");
  const URL = `http://earthquake.usgs.gov/earthquakes/
feed/v1.0/summary/all_day.geojson`;

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

  quakes$.bufferCount(100).subscribe(quakes => {
    const quakesData = quakes.map(quake => ({
      id: quake.properties.net + quake.properties.code,
      lat: quake.geometry.coordinates[1],
      lng: quake.geometry.coordinates[0],
      mag: quake.properties.mag
    }));
    socket$.next(JSON.stringify({ quakes: quakesData }));
  });

  socket$.subscribe(message => {
    console.log(JSON.parse(message.data));
  });

  const table = document.getElementById("quakes_info");

  function getRowFromEvent(event) {
    return Rx.Observable
      .fromEvent(table, event)
      .filter(event => {
        const el = event.target;
        return el.tagName === "TD" && el.parentNode.id.length;
      })
      .pluck("target", "parentNode")
      .distinctUntilChanged();
  }

  getRowFromEvent("mouseover").pairwise().subscribe(rows => {
    const prevCircle = quakeLayer.getLayer(codeLayers[rows[0].id]);
    const currCircle = quakeLayer.getLayer(codeLayers[rows[1].id]);

    prevCircle.setStyle({ color: "#0000ff" });
    currCircle.setStyle({ color: "#ff0000" });
  });

  getRowFromEvent("click").subscribe(row => {
    const circle = quakeLayer.getLayer(codeLayers[row.id]);
    map.panTo(circle.getLatLng());
  });

  quakes$.pluck("properties").map(makeRow).subscribe(row => {
    table.appendChild(row);
  });
}

Observable.fromEvent(document, "DOMContentLoaded").subscribe(initialize);
