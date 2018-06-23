/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";
import L from "leaflet";

const QUAKE_URL = `http://earthquake.usgs.gov/earthquakes/
feed/v1.0/summary/all_day.geojsonp`;

function loadJSONP(url) { // (1)
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;

  const head = document.getElementsByTagName("head")[0];
  head.appendChild(script);
}

const mapContainer = document.createElement("div"); //(2)
mapContainer.id = "map";
document.body.appendChild(mapContainer);

const map = L.map("map").setView([33.858631, -118.279602], 7); //(3)
L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(map); //(4)
function loadJSONP(settings) {
  const url = settings.url; //(5)
  const callbackName = settings.callbackName;

  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = url;

  window[callbackName] = data => { //(6)
    window[callbackName].data = data;
  };

  return Observable.create(observer => { //(7)
    const handler = e => { //(8)
      const status = e.type === "error" ? 400 : 200;
      const response = window[callbackName].data;

      if (status === 200) {
        observer.next({ //(9)
          status,
          responseType: "jsonp",
          response,
          originalEvent: e
        });

        observer.complete();
      } else {
        observer.error({ //(10)
          type: "error",
          status,
          originalEvent: e
        });
      }
    };

    script.onload = script.onreadystatechanged = script.onerror = handler; //(11)

    const head = window.document.getElementsByTagName("head")[0];
    head.insertBefore(script, head.firstChild);
  });
}

/*
const quakes$ = Observable.create(observer => {
  window.eqfeed_callback = response => {
    response.features.forEach(observer.next);
  };

  loadJSONP(QUAKE_URL);
});

quakes$.subscribe(quake => {
  const coords = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;

  L.circle([coords[1], coords[0]], size).addTo(map);
});

const quakes$ = Observable.create(observer => {
  window.eqfeed_callback = response => {
    observer.next(response); //(12)
    observer.complete(); //(13)
  };

  loadJSONP(QUAKE_URL);
}).flatMap(dataset => { //(14)
  return Observable.from(dataset.features); //(15)
});
*/

const quakes$ = Observable.interval(5000)
  .flatMap(() => {
    return loadJSONP({
      url: QUAKE_URL,
      callbackName: "eqfeed_callback"
    }).retry(3);
  })
  .flatMap(result => Observable.from(result.response.features))
  .distinct(quake => quake.properties.code);

quakes$.subscribe(quake => {
  const coords = quake.geometry.coordinates;
  const size = quake.properties.mag * 10000;

  L.circle([coords[1], coords[0]], size).addTo(map);
});
