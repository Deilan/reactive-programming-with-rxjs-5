/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable } from "rxjs";
function logValue(val) {
  console.log(val);
}

const arr = [1, 2, 3];

const m = arr.map(x => x * 3);

const f = m.filter(x => x % 2 !== 0);
{
const seq = Observable.range(1, 3);

const m = seq.map(x => x * 3);

const f = m.filter(x => x % 2 !== 0);
}
const src = [1, 2, 3, 4, 5];
const upper = src.map(name => name * 2);

upper.forEach(logValue);
{
const src = Observable.range(1, 5);
const upper = src.map(name => name * 2);

upper.subscribe(logValue);
}
console.log("FILTER");

const isEven = val => val % 2 === 0;
{
const src = [1, 2, 3, 4, 5];
const even = src.filter(isEven);

even.forEach(logValue);
}
{
const src = Observable.range(1, 5);
const even = src.filter(isEven);

even.subscribe(logValue);
}
{
const src = [1, 2, 3, 4, 5];
const sum = src.reduce((a, b) => a + b);

console.log(sum);
}
{
const src = Observable.range(1, 5);
const sum = src.reduce((acc, x) => acc + x);

sum.subscribe(logValue);
}
function concatAll(source) {
  return source.reduce((a, b) => a.concat(b));
}
concatAll([[0, 1, 2], [3, 4, 5], [6, 7, 8]]);
// [0, 1, 2, 3, 4, 5, 6, 7, 8]
{
const src = Observable.range(1, 5);
const sum = src.scan(
  (
    x,
    acc // Inverted reduce parameters
  ) => acc + x
);

sum.subscribe(val => console.log(`Next: ${val}`));

// Next: 1
// Next: 3
// Next: 6
// Next: 10
// Next: 15
}
