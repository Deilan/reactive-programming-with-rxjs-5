/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function paintStars(stars) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

const SPEED = 40;
const STAR_NUMBER = 250;
const StarStream$ = Observable
  .range(1, STAR_NUMBER)
  .map(() => ({
    x: parseInt(Math.random() * canvas.width, 10),
    y: parseInt(Math.random() * canvas.height, 10),
    size: Math.random() * 3 + 1
  }))
  .toArray()
  .flatMap(starArray => Observable.interval(SPEED).map(() => {
    starArray.forEach(star => {
      if (star.y >= canvas.height) {
        star.y = 0; // Reset star to top of the screen
      }
      star.y += star.size; // Move star
    });

    return starArray;
  }))
  .subscribe(paintStars);
