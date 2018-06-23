/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
const WebSocket = require("ws");
const Twit = require("twit");
const Rx = require("rxjs");
const Observable = Rx.Observable;

const T = new Twit({
  // Substitute the following properties by the ones provided by Twitter
  consumer_key: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  consumer_secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  access_token: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  access_token_secret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
});
// const T = new Twit({
//   consumer_key: "rFhfB5hFlth0BHC7iqQkEtTyw",
//   consumer_secret: "zcrXEM1jiOdKyiFFlGYFAOo43Hsz383i0cdHYYWqBXTBoconst1x",
//   access_token: "14343133-nlxZbtLuTEwgAlaLsmfrr3D4QAoiV2fa6xXUVEwW9",
//   access_token_secret: "57Dr99wECljyyQ9tViJWz0H3obNG3V4cr5Lix9sQBXju1"
// });
/*

function onConnect(ws) {
  console.log('Client connected on localhost:8080');
}

const Server = new WebSocketServer({ port: 8080 });
Observable.fromEvent(Server, 'connection').subscribe(onConnect);

*/

function onConnect(ws) {
  console.log("Client connected on localhost:8080");

  const stream = T.stream("statuses/filter", {
    track: "earthquake",
    locations: []
  });

  Observable.fromEvent(stream, "tweet").subscribe(tweetObject => {
    ws.send(JSON.stringify(tweetObject), err => {
      if (err) {
        console.log("There was an error sending the message");
      }
    });
  });

  /*
  const onMessage = Observable.fromEvent(ws, 'message')
    .subscribe(quake => {
      quake = JSON.parse(quake);
      console.log(quake);
    });
  */
  Observable.fromEvent(ws, "message")
    .flatMap(quakesObj => {
      quakesObj = JSON.parse(quakesObj);
      return Observable.from(quakesObj.quakes);
    })
    .scan([], (boundsArray, quake) => { //(1)
      const bounds = [ //(2)
        quake.lng - 0.3,
        quake.lat - 0.15,
        quake.lng + 0.3,
        quake.lat + 0.15
      ].map(
        coordinate => coordinate.toString().match(/\-?\d+(\.\-?\d{2})?/)[0]
      );

      const finalBounds = boundsArray.concat(bounds);
      return finalBounds.slice(Math.max(finalBounds.length - 50, 0)); //(3)
    })
    .subscribe(boundsArray => { //(4)
      stream.stop();
      stream.params.locations = boundsArray;
      stream.start();
    });
}

const Server = new WebSocket.Server({ port: 8081 });

Observable.fromEvent(Server, "connection").subscribe(onConnect);
