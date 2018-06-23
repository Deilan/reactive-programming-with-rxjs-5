/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
const quakes = Rx.DOM
  .jsonpRequest({
    url: QUAKE_URL,
    jsonpCallback: 'eqfeed_callback'
  })
  .flatMap(result => Observable.from(result.response.features))
  .map(quake => ({
    lat: quake.geometry.coordinates[1],
    lng: quake.geometry.coordinates[0],
    size: quake.properties.mag * 10000
  }));
quakes.subscribe(quake => {
  L.circle([quake.lat, quake.lng], quake.size).addTo(map);
});
