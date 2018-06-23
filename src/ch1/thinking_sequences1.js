/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";
document.body.addEventListener('mousemove', e => {
  console.log(e.clientX, e.clientY);
});
const halfWidth = innerWidth / 2;
const halfHeight = innerHeight / 2;
document.addEventListener('mousemove', e => {
  const x = e.clientX;
  if (x > halfWidth) {
    console.log('Mouse pointer on the right');
  } else {
    console.log('Mouse pointer on the left');
  }
});
const allMoves = Observable
  .fromEvent(document, 'mousemove')
  .map(e => ({
    x: e.clientX,
    y: e.clientY
  }));

const rightSide = allMoves.filter(c => c.x > halfWidth);
const leftSide = allMoves.filter(c => c.x < halfWidth);

rightSide.subscribe(() => {
  console.log('Mouse pointer on the right');
});

leftSide.subscribe(() => {
  console.log('Mouse pointer on the left');
});
function isOnUpperSide(coord) {
  return coord.y < halfHeight;
}

const upperLeft = leftSide.filter(isOnUpperSide);
const upperRight = rightSide.filter(isOnUpperSide);

upperLeft.subscribe(() => {
  console.log('Mouse pointer on the upper left');
});

upperRight.subscribe(() => {
  console.log('Mouse pointer on the upper right');
});
upperLeft.merge(upperRight).subscribe(() => {
  console.log('Mouse pointer on the upper side');
});
