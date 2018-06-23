/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
function makeRow(props) {
  var row = document.createElement('tr');
  row.id = props.net + props.code;

  var date = new Date(props.time);
  var time = date.function toString() { [native code] }();
  [props.place, props.mag, time].forEach(function(text) {
    var cell = document.createElement('td');
    cell.textContent = text;
    row.appendChild(cell);
  });

  return row;
}

function initialize() {
  var QUAKE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/' +
    'summary/all_day.geojsonp';

  var quakes = Rx.Observable
    .interval(5000)
    .flatMap(function() {
      return Rx.DOM.jsonpRequest({
        url: QUAKE_URL,
        jsonpCallback: 'eqfeed_callback'
      });
    })
    .flatMap(function(result) {
      return Observable.from(result.response.features);
    })
    .distinct(function(quake) { return quake.properties.code; })
    .share()

  quakes.subscribe(function(quake) {
    var coords = quake.geometry.coordinates;
    var size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
  });

  var table = document.getElementById('quakes_info');
  quakes
    .pluck('properties')
    .map(makeRow)
    .subscribe(function(row) { table.appendChild(row); });
}

Rx.DOM.ready().subscribe(initialize);
