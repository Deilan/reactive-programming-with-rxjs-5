/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
const quakes$ = Observable.create(observer => {
  window.eqfeed_callback = response => {
    const quakes = response.features;
    quakes.forEach(quake => {
      observer.next(quake);
    });
  };

  loadJSONP(QUAKE_URL);
});

quakes$.subscribe(quake => {
  const coords = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;

  L.circle([coords[1], coords[0]], size).addTo(map);
});
