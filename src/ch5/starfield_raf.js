/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
import { Observable, Subject } from "rxjs";

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* Constants */
const SPEED = 40;
const SHOOTING_SPEED = 15;
const ENEMY_FREQ = 1500;
const ENEMY_SHOOTING_FREQ = 750;
const SCORE_INCREASE = 10;
const HERO_Y = canvas.height - 30;

/* Helper functions */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function colision(target1, target2) {
  return target1.x > target2.x - 20 &&
    target1.x < target2.x + 20 &&
    (target1.y > target2.y - 20 && target1.y < target2.y + 20);
}

function drawTriangle(x, y, width, color, direction) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x - width, y);
  ctx.lineTo(x, direction === "up" ? y - width : y + width);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x - width, y);
  ctx.fill();
}
function paintStars(stars) {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function paintSpaceShip(x, y) {
  drawTriangle(x, y, 20, "#ff0000", "up");
}

function paintEnemies(enemies) {
  enemies.forEach(enemy => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    if (!enemy.isDead) {
      drawTriangle(enemy.x, enemy.y, 20, "#00ff00", "down");
    }

    enemy.shots.forEach(shot => {
      shot.y += SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, "#00ffff", "down");
    });
  });
}

function paintScore(score) {
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText(`Score: ${score}`, 40, 43);
}

function isVisible(obj) {
  return obj.x > -40 &&
    obj.x < canvas.width + 40 &&
    obj.y > -40 &&
    obj.y < canvas.height + 40;
}

function paintHeroShots(heroShots, enemies) {
  heroShots.forEach((shot, i) => {
    let impact = false;
    for (let l = 0; l < enemies.length; l++) {
      const enemy = enemies[l];
      if (!enemy.isDead && colision(shot, enemy)) {
        ScoreSubject.next(SCORE_INCREASE);
        enemy.isDead = true;
        shot.x = (shot.y = -100);
        impact = true;
        break;
      }
    }

    if (!impact) {
      shot.y -= SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, "#ffff00", "up");
    }
  });
}

function animationLoop() {
  return Observable.generate(
    0,
    () => true,
    x => x + 1,
    x => x,
    Scheduler.animationFrame
  ); // Schedule to requestAnimationFrame
}

function gameOver(player, enemies) {
  return enemies.some(enemy => {
    if (colision(player, enemy)) {
      return true;
    }

    return enemy.shots.some(shot => colision(player, shot));
  });
}

/* Reactive code */

const playerShots = Observable.merge(
  Observable.fromEvent(canvas, "click"),
  Observable.fromEvent(document, "keydown").filter(evt => evt.keyCode === 32)
);

const StarStream = Observable
  .range(1, 250)
  .map(() => ({
    x: parseInt(Math.random() * canvas.width),
    y: parseInt(Math.random() * canvas.height),
    size: Math.random() * 3 + 1
  }))
  .toArray()
  .flatMap(arr => animationLoop().map(() =>
  arr.map(star => {
    if (star.y >= canvas.height) {
      star.y = 0;
    }
    star.y += 3;
    return star;
  })));

const mouseMove = Observable.fromEvent(canvas, "mousemove");
const SpaceShip = mouseMove
  .map(event => ({
    x: event.clientX,
    y: HERO_Y
  }))
  .startWith({ x: canvas.width / 2, y: HERO_Y });

const playerFiring = playerShots.startWith({}).sampleTime(200).timestamp();

const HeroShots = Observable.combineLatest(
  playerFiring,
  SpaceShip,
  (shotEvents, spaceShip) => ({
    timestamp: shotEvents.timestamp,
    x: spaceShip.x
  })
)
  .distinct(shot => shot.timestamp)
  .scan(
    (shotArray, shot) => {
      shotArray.push({ x: shot.x, y: HERO_Y });
      return shotArray.filter(isVisible);
    },
    []
  );

const Enemies = Observable.interval(ENEMY_FREQ).scan(
  enemyArray => {
    const enemy = {
      x: parseInt(Math.random() * canvas.width, 10),
      y: -30,
      shots: []
    };

    Observable.interval(ENEMY_SHOOTING_FREQ).subscribe(() => {
      if (!enemy.isDead) {
        enemy.shots.push({ x: enemy.x, y: enemy.y });
      }
      enemy.shots = enemy.shots.filter(isVisible);
    });

    return enemyArray
      .concat(enemy)
      .filter(
        enemy => isVisible(enemy) && !(enemy.isDead && enemy.shots.length === 0)
      );
  },
  []
);

const ScoreSubject = new Subject();
const score = ScoreSubject.scan((prev, cur) => prev + cur, 0).startWith(0);

function renderScene(actors) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
  paintEnemies(actors.enemies);
  paintHeroShots(actors.heroShots, actors.enemies);
  paintScore(actors.score);
}

const Game = Observable.combineLatest(
  StarStream,
  SpaceShip,
  Enemies,
  HeroShots,
  score,
  (stars, spaceship, enemies, heroShots, score) => ({
    stars,
    spaceship,
    enemies,
    heroShots,
    score
  })
)
  .sampleTime(SPEED)
  .takeWhile(actors => {
    const isGameOver = gameOver(actors.spaceship, actors.enemies);
    if (isGameOver === true) {
      actors.enemies.forEach(enemy => {
        enemy.isDead = true;
      });
    }
    return isGameOver === false;
  });

Game.subscribe(renderScene);
