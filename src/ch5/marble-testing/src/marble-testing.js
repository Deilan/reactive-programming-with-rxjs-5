/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
"use strict";
function hot(marbles, values, error) {
    if (!global.rxTestScheduler) {
        throw 'tried to use hot() in async test';
    }
    return global.rxTestScheduler.createHotObservable.apply(global.rxTestScheduler, arguments);
}
exports.hot = hot;
function cold(marbles, values, error) {
    if (!global.rxTestScheduler) {
        throw 'tried to use cold() in async test';
    }
    return global.rxTestScheduler.createColdObservable.apply(global.rxTestScheduler, arguments);
}
exports.cold = cold;
function expectObservable(observable, unsubscriptionMarbles) {
    if (unsubscriptionMarbles === void 0) { unsubscriptionMarbles = null; }
    if (!global.rxTestScheduler) {
        throw 'tried to use expectObservable() in async test';
    }
    return global.rxTestScheduler.expectObservable.apply(global.rxTestScheduler, arguments);
}
exports.expectObservable = expectObservable;
function expectSubscriptions(actualSubscriptionLogs) {
    if (!global.rxTestScheduler) {
        throw 'tried to use expectSubscriptions() in async test';
    }
    return global.rxTestScheduler.expectSubscriptions.apply(global.rxTestScheduler, arguments);
}
exports.expectSubscriptions = expectSubscriptions;
function time(marbles) {
    if (!global.rxTestScheduler) {
        throw 'tried to use time() in async test';
    }
    return global.rxTestScheduler.createTime.apply(global.rxTestScheduler, arguments);
}
exports.time = time;
//# sourceMappingURL=marble-testing.js.map