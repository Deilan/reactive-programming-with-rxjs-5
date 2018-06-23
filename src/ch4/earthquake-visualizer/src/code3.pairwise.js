/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
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

function initialize() {
  const URL = `http://earthquake.usgs.gov/earthquakes/
feed/v1.0/summary/all_day.geojson`;

  const quakes$ = Observable.interval(5000)
    .flatMap(() => {
      return loadJSONP({
        url: QUAKE_URL,
        callbackName: "eqfeed_callback"
      }).retry(3);
    })
    .flatMap(result => Observable.from(result.response.features))
    .distinct(quake => quake.properties.code);

  quakes$.subscribe({id, geometry, properties} => {
    const coords = quake.geometry.coordinates;
    const size = quake.properties.mag * 10000;

    const circle = L.circle([coords[1], coords[0]], size).addTo(map);
    quakeLayer.addLayer(circle);
    codeLayers[quake.id] = quakeLayer.getLayerId(circle);
  });

  const table = document.getElementById("quakes_info");

  function getRowFromEvent(event) {
    return Observable
      .fromEvent(table, event)
      .filter({target} => { //(1)
        return target.tagName === "TD" && target.parentNode.id.length;
      })
      .pluck("target", "parentNode") //(2)
      .distinctUntilChanged(); //(3)
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

  quakes$
    .pluck("properties")
    .map(makeRow)
    .subscribe(table.appendChild);
}

Observable.fromEvent(document, "DOMContentLoaded").subscribe(initialize);
