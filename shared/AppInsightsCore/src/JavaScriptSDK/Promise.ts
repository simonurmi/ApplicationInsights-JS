// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.

// import { IPromiseLike, IPromiseRejected, IPromiseResolved, IPromiseReject, IPromiseResolve, IAwaitResponse, IPromiseAsyncType } from "../JavaScriptSDK.Interfaces/IPromise";
// import { arrForEach, isBoolean, isFunction, isPromiseLike, throwError } from "./HelperFuncs";

// /**
//  * @ignore -- Don't include in the generated documentation
//  */
//  const enum PromiseState {
//     Pending = 0,
//     Resolved = 1,
//     Rejected = 2
// }

// function _processQueuedItems(pending: (() => void)[]) {
//     arrForEach(pending, (fn) => {
//         try {
//             fn();
//         } catch (e) {
//             // Don't let 1 failing handler break all others
//             // TODO: Add some form of error reporting (i.e. Call any registered JS error handler so the error is reported)
//         }
//     });
// }

// /**
//  * Implementing a simple synchronous promise interface for support within any environment that
//  * doesn't support the Promise API
//  * @param executor - The resolve function
//  * @param isAsync - Identifies whether the promise should be resolved synchronously (false), asynchronously (true) or based on a timeout (number),
//  * any value >= 0 will cause the resolve/reject functions to be called asynchronously using the number value as the timeout value in ms.
//  */
// export function createPromise<T>(executor: (resolve: IPromiseResolve<T>, reject: IPromiseReject) => void, isAsync: IPromiseAsyncType = false): IPromiseLike<T> {
//     let _state = PromiseState.Pending;
//     let _settledValue: T = null;
//     let _queue: (() => void)[] = [];

//     function _then<TResult1 = T, TResult2 = never>(onResolved?: IPromiseResolved<T, TResult1>, onRejected?: IPromiseRejected<TResult2>): IPromiseLike<TResult1 | TResult2> {
//         return createPromise<TResult1 | TResult2>(function (resolve, reject) {
//             // Queue the new promise returned to be resolved or rejected
//             // when this promise settles.
//             _enqueue(onResolved, onRejected, resolve, reject);
//         }, isAsync);
//     }

//     function _catch(onRejected: IPromiseRejected) {
//         // Just return an empty promise as this doesn't support rejection
//         return _then(null, onRejected);
//     }

//     function _enqueue<TResult1 = T, TResult2 = never>(onResolved: IPromiseResolved<T, TResult1>, onRejected: IPromiseRejected<TResult2>, resolve: IPromiseResolve<TResult1>, reject: IPromiseReject) {
//         _queue.push(function () {
//             let value: any;
//             try {
//                 // First call the onFulfilled or onRejected handler, on the settled value
//                 // of this promise. If the corresponding handler does not exist, simply
//                 // pass through the settled value.
//                 if (_state === PromiseState.Resolved) {
//                     value = isFunction(onResolved) ? onResolved(_settledValue) : _settledValue;
//                 } else {
//                     value = isFunction(onRejected) ? onRejected(_settledValue) : _settledValue;
//                 }
    
//                 if (isPromiseLike(value)) {
//                     // The called handlers returned a new promise, so the chained promise
//                     // will follow the state of this promise.
//                     value.then(resolve, reject);
//                 } else if (_state === PromiseState.Rejected && !isFunction(onRejected)) {
//                     // If there wasn't an onRejected handler and this promise is rejected, then
//                     // the chained promise also rejects with the same reason.
//                     reject(value);
//                 } else {
//                     // If this promise is fulfilled, then the chained promise is also fulfilled
//                     // with either the settled value of this promise (if no onFulfilled handler
//                     // was available) or the return value of the handler. If this promise is
//                     // rejected and there was an onRejected handler, then the chained promise is
//                     // fulfilled with the return value of the handler.
//                     resolve(value);
//                 }
//             } catch (e) {
//                 reject(e);
//             }
//         });

//         // If this promise is already settled, then immediately process the callback we
//         // just added to the queue.
//         if (_state !== PromiseState.Pending) {
//             _processQueue();
//         }
//     }

//     function _processQueue() {
//         if (_queue.length > 0) {
//             // The onFulfilled and onRejected handlers must be called asynchronously. Thus,
//             // we make a copy of the queue and work on it once the current call stack unwinds.
//             let pending = _queue.slice();
//             _queue = [];

//             let callbackTimeout = isBoolean(isAsync) ? (isAsync ? 0 : -1) : isAsync;

//             if (callbackTimeout < 0) {
//                 // Run synchronously
//                 _processQueuedItems(pending);
//             } else {
//                 setTimeout(() => {
//                     _processQueuedItems(pending);
//                 }, callbackTimeout);
//             }
//         }
//     }

//     function _resolve(value: T): void {
//         if (_state === PromiseState.Pending) {
//             _settledValue = value;
//             _state = PromiseState.Resolved;
//             _processQueue();
//         }
//     }

//     function _reject(reason: any): void {
//         if (_state === PromiseState.Pending) {
//             _settledValue = reason;
//             _state = PromiseState.Rejected;
//             _processQueue();
//         }
//     }

//     (function _initialize() {
//         if (!isFunction(executor)) {
//             throwError("Promise: executor argument is not a function");
//         }

//         try {
//             executor(_resolve, _reject);
//         } catch (e) {
//             _reject(e);
//         }
//     })();

//     return {
//         then: _then,
//         "catch": _catch
//     };
// }

// /**
//  * This method returns a single PromiseLike response that resolves when all of the passed promises passed have
//  * resolved or when the values contains no promises. It rejects with the reason of the first promise that rejects.
//  *  There is no implied ordering in the execution of the array of Promises given. On some computers, they
//  * may be executed in parallel, or in some sense concurrently, while on others they may be executed serially. For
//  * this reason, there must be no dependency in any Promise on the order of execution of the Promises.
//  * This method can be useful for aggregating the results of multiple promises.
//  * - FulfillmentSection - The returned promise is fulfilled with an array containing all the values of the iterable
//  * passed as argument (also non-promise values).
//  * - If an empty iterable is passed, then this method returns (synchronously) an already resolved promise.
//  * - If all of the passed-in promises fulfill, or are not promises, the promise returned by createAllPromise is fulfilled
//  * based on isAsync value (-1 => synchronously otherwise asynchronously with the provided delay).
//  * - RejectionSection - If any of the passed-in promises reject, Promise.all asynchronously rejects with the value of
//  * the promise that rejected, whether or not the other promises have resolved.
//  * @param isAsync - Identifies whether the promise should be resolved synchronously (false), asynchronously (true) or based on a timeout (number),
//  * any value >= 0 will cause the resolve/reject functions to be called asynchronously using the number value as the timeout value in ms.
//  */
// export function createAllPromise<T>(items: IPromiseLike<T>[], isAsync: IPromiseAsyncType = false): IPromiseLike<T[]> {

//     return createPromise<T[]>((resolve, reject) => {
//         try {
//             let values = [] as any;
//             let pending = 0;

//             arrForEach(items, (item, idx) => {
//                 pending++;
//                 doAwait(item, (value) => {
//                     // Set the result values
//                     values[idx] = value;
//                     if (--pending === 0) {
//                         resolve(values);
//                     }
//                 }, reject);
//             });

//             if (pending === 0) {
//                 // All promises were either resolved or where not a promise
//                 resolve(values);
//             }
//         } catch (e) {
//             reject(e);
//         }
//     }, isAsync);
// }

// /**
//  * The createResolvedPromise returns a PromiseLike object that is resolved with a given value. If the value is
//  * PromiseLike (i.e. has a "then" method), the returned promise will "follow" that thenable, adopting its eventual
//  * state; otherwise the returned promise will be fulfilled with the value. This function flattens nested layers
//  * of promise-like objects (e.g. a promise that resolves to a promise that resolves to something) into a single layer.
//  * @param value Argument to be resolved by this Promise. Can also be a Promise or a thenable to resolve.
//  * @param isAsync - Identifies whether the promise should be resolved synchronously (false), asynchronously (true) or based on a timeout (number),
//  * any value >= 0 will cause the resolve/reject functions to be called asynchronously using the number value as the timeout value in ms.
//  */
// export function createResolvedPromise<T>(value: T, isAsync: IPromiseAsyncType = false): IPromiseLike<T> {
//     return createPromise((resolve, reject) => {
//         if (isPromiseLike(value)) {
//             value.then(resolve, reject);
//         } else {
//             resolve(value);
//         }
//     }, isAsync);
// }

// /**
//  * Return a promise like object that is rejected with the given reason.
//  * @param reason - The rejection reason
//  * @param isAsync - Identifies whether the promise should be resolved synchronously (false), asynchronously (true) or based on a timeout (number),
//  * any value >= 0 will cause the resolve/reject functions to be called asynchronously using the number value as the timeout value in ms.
//  */
// export function createRejectedPromise<T = unknown>(reason: any, isAsync: IPromiseAsyncType = false): IPromiseLike<T> {
//     return createPromise((_resolve, reject) => {
//         reject(reason);
//     }, isAsync);
// }

// /**
//  * Helper to coalesce the promise resolved / reject into a single callback to simplify error handling.
//  * @param value - The value or promise like value to wait for
//  * @param cb - The callback to call with the response of the promise as an IAwaitResponse object.
//  */
// export function doAwaitResponse<T>(value: T | IPromiseLike<T>, cb: (response: IAwaitResponse<T>) => void) {
//     doAwait(value, (value) => {
//         cb({
//             value: value
//         });
//     },
//     (reason) => {
//         cb({
//             rejected: true,
//             reason: reason
//         });
//     });
// }

// /**
//  * Wait for the promise to resolve or reject, if resolved the callback function will be called with it's value and if
//  * rejected the rejectFn will be called with the reason. If the passed promise argument is not a promise the callback
//  * will be called synchronously with the value.
//  * @param value - The value or promise like value to wait for
//  * @param cb - The callback to call on the promise successful resolving.
//  * @param rejectFn - The callback to call when the promise rejects
//  */
// export function doAwait<T>(value: T | IPromiseLike<T>, cb: (value: T) => void, rejectFn: (reason?: any) => void) {
//     if (isPromiseLike<T>(value)) {
//         value.then((result) => {
//             cb(result);
//         },
//         (reason) => {
//             if (isFunction(rejectFn)) {
//                 rejectFn(reason);
//             }
//         });
//     } else {
//         cb(value as T);
//     }
// }