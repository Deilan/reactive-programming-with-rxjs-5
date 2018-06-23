/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* Constants */
var SPEED = 40;
var SHOOTING_FREQ = 250;
var SHOOTING_SPEED = 15;
var ENEMY_FREQ = 1500;
var ENEMY_SHOOTING_FREQ = 750;
var SCORE_INCREASE = 10;
var HERO_Y = canvas.height - 30;

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
  ctx.lineTo(x, direction === 'up' ? y - width : y + width);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x - width, y);
  ctx.fill();
}

function paintStars(stars) {
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  stars.forEach(star => {
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
}

function paintSpaceShip(x, y) {
  drawTriangle(x, y, 20, '#ff0000', 'up');
}

function paintEnemies(enemies) {
  enemies.forEach(enemy => {
    enemy.y += 5;
    enemy.x += getRandomInt(-15, 15);

    if (!enemy.isDead) {
      drawTriangle(enemy.x, enemy.y, 20, '#00ff00', 'down');
    }

    enemy.shots.forEach(shot => {
      shot.y += SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, '#00ffff', 'down');
    });
  });
}

function paintScore(score) {
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(`Score: ${score}`, 40, 43);
}

function isVisible(obj) {
  return obj.y > -40 &&
    obj.y < canvas.height + 40 &&
    obj.x > -40 &&
    obj.x < canvas.width + 40;
}

function paintHeroShots(heroShots, enemies) {
  heroShots.forEach(shot => {
    var impact = false;
    for (var l = 0; l < enemies.length; l++) {
      var enemy = enemies[l];
      if (!enemy.isDead && colision(shot, enemy)) {
        ScoreSubject.next(SCORE_INCREASE);
        enemy.isDead = true;
        shot.x = shot.y = -100;
        impact = true;
        break;
      }
    }

    if (!impact) {
      shot.y -= SHOOTING_SPEED;
      drawTriangle(shot.x, shot.y, 5, '#ffff00', 'up');
    }
  });
}

function animationLoop(scheduler) {
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

function timedScheduler(t) {
  // Schedule task as soon as possible. For us, that's the same as scheduling
  // with relative time.
  function scheduleNow(state, action) {
    return this.scheduleWithRelativeAndState(state, t, action);
  }

  function scheduleRelative(state, dueTime, action) {
    var scheduler = this;
    var id = window.setTimeout(
      () => {
        action(scheduler, state);
      },
      t
    );

    return Rx.Disposable.create(() => {
      window.clearTimeout(id);
    });
  }

  function scheduleAbsolute(state, dueTime, action) {
    return this.scheduleWithRelativeAndState(
      state,
      dueTime + t - this.now(),
      action
    );
  }

  return new Scheduler(
    Date.now,
    scheduleNow,
    scheduleRelative,
    scheduleAbsolute
  );
}

var playerShots = Observable.merge(
  Observable.fromEvent(canvas, 'click'),
  Rx.Observable
    .fromEvent(document, 'keydown')
    .filter(evt => evt.keyCode === 32)
);
var StarStream = Rx.Observable
  .range(1, 250)
  .map(() => ({
    x: parseInt(Math.random() * canvas.width),
    y: parseInt(Math.random() * canvas.height),
    size: Math.random() * 3 + 1
  }))
  .toArray()
  .flatMap(arr =>
    arr.map(star => {
      if (star.y >= canvas.height) {
        star.y = 0;
      }
      star.y += 3;
      return star;
    })));

var mouseMove = Observable.fromEvent(canvas, 'mousemove');
var SpaceShip = mouseMove
  .map(event => ({
    x: event.clientX,
    y: HERO_Y
  }))
  .startWith({ x: canvas.width / 2, y: HERO_Y });

var playerFiring = playerShots.startWith({}).sample(200).timestamp();

var HeroShots = Rx.Observable
  .combineLatest(playerFiring, SpaceShip, (
    shotEvents,
    spaceShip
  ) => ({
    timestamp: shotEvents.timestamp,
    x: spaceShip.x
  }))
  .distinct(shot => shot.timestamp)
  .scan(
    (shotArray, shot) => {
      shotArray.push({ x: shot.x, y: HERO_Y });
      return shotArray.filter(isVisible);
    },
    []
  );

function generateEnemyShots(enemy, scheduler) {
  return Observable.generate(
    { x: -100, y: -100 }, // Start with a shot off-screen
    () => enemy,
    () => ({
      // Generate shot at the current enemy position
      x: enemy.x,

      y: enemy.y
    }),
    shot => shot,
    scheduler(ENEMY_SHOOTING_FREQ) // Run everything in the timedScheduler
  );
}

var Enemies = Observable.interval(ENEMY_FREQ).scan(enemyArray => {
  var enemy = {
    x: parseInt(Math.random() * canvas.width),
    y: -30,
    shots: []
  };

  var enemyShots = generateEnemyShots(
    enemy,
    timedScheduler
  ).subscribe(shot => {
    enemy.shots = enemy.shots.filter(isVisible);

    if (!isVisible(enemy) || enemy.isDead) {
      // If this enemy dies, its shooting should stop, but not before all
      // shots are gone.
      if (enemy.shots.length === 0) {
        enemyShots.unsubscribe();
      }
      return;
    } else {
      enemy.shots.push(shot);
    }
  });

  return enemyArray
    .concat(enemy)
    .filter(
      enemy =>
        isVisible(enemy) &&
        !(enemy.isDead && enemy.shots.length === 0)
    );
}, []);

var ScoreSubject = new Rx.Subject();
var score = ScoreSubject.scan((prev, cur) => prev + cur, 0).startWith(
  0
);

function renderScene(actors) {
  paintStars(actors.stars);
  paintSpaceShip(actors.spaceship.x, actors.spaceship.y);
  paintEnemies(actors.enemies);
  paintHeroShots(actors.heroShots, actors.enemies);
  paintScore(actors.score);
}

var Game = Rx.Observable
  .combineLatest(StarStream, SpaceShip, Enemies, HeroShots, score, (
    stars,
    spaceship,
    enemies,
    heroShots,
    score
  ) => ({
    stars: stars,
    spaceship: spaceship,
    enemies: enemies,
    heroShots: heroShots,
    score: score
  }))
  .sample(SPEED, Scheduler.requestAnimationFrame)
  .takeWhile(actors => {
    var isGameOver = gameOver(actors.spaceship, actors.enemies);
    if (isGameOver === true) {
      actors.enemies.forEach(enemy => {
        enemy.isDead = true;
      });
    }
    return isGameOver === false;
  });

Game.subscribe(renderScene);
