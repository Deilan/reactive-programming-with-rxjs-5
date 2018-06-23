/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
var drawnQuakes = [];
window.eqfeed_callback = response => {
  var quakes = response.features.filter(
    quake => drawnQuakes.indexOf(quake.properties.code) === -1
  );

  quakes.forEach(quake => {
    var coords = quake.geometry.coordinates;
    var size = quake.properties.mag * 10000;

    L.circle([coords[1], coords[0]], size).addTo(map);
    drawnQuakes.push(quake.properties.code);
  });
};

setInterval(
  () => {
    loadJSONP(QUAKE_URL);
  },
  5000
);
