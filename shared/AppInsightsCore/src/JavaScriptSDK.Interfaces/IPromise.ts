// // Copyright (c) Microsoft Corporation. All rights reserved.
// // Licensed under the MIT License.

// /**
// * This defines the handler function for when a promise is resolved.
// * @param value This is the value passed as part of resolving the Promise
// * @return This may return a value, another Promise or void. See [[then]] for how the value is handled.
//  */
// export type IPromiseResolved<T, TResult1 = T> = ((value: T) => TResult1 | IPromiseLike<TResult1>) | undefined | null;

// /**
// * This defines the handler function for when a promise is rejected.
// * @param value This is the value passed as part of resolving the Promise
// * @return This may return a value, another Promise or void. @see then for how the value is handled.
// */
// export type IPromiseRejected<T = never> = ((reason: any) => T | IPromiseLike<T>) | undefined | null;

// /**
//  * Defines the signature of the resolve function passed to the resolverFunc (in the Promise constructor)
//  * @param value The value to resolve the Promise with
//  * @returns Nothing
//  */
// export type IPromiseResolve<T> = (value?: T|IPromiseLike<T>) => void;
 
// /**
//  * Defines the signature of the reject function passed to the resolverFunc (in the Promise constructor)
//  * @param value The value to reject the Promise with
//  * @returns Nothing
//  */
// export type IPromiseReject = (reason?: any) => void;

// /**
//  * Identifies whether the promise should be resolved synchronously (false), asynchronously (true) or based on a timeout (number),
//  * any value >= 0 will cause the resolve/reject functions to be called asynchronously using the number value as the timeout value in ms.
//  */
// export type IPromiseAsyncType = boolean | number;

// /**
//  * A simple promise definition, closely mirroring the typescript PromiseLike<T> and Promise<T> definitions
//  */
// export interface IPromiseLike<T> /*extends PromiseLike<T>*/ {
//     /**
//      * Attaches callbacks for the resolution and/or rejection of the Promise.
//      * @param onResolved The callback to execute when the Promise is resolved.
//      * @param onRejected The callback to execute when the Promise is rejected.
//      * @returns A Promise for the completion of which ever callback is executed.
//      */
//     then<TResult1 = T, TResult2 = never>(onResolved?: IPromiseResolved<T, TResult1>, onRejected?: IPromiseRejected<TResult2>): IPromiseLike<TResult1 | TResult2>;
 
//     /**
//      * Attaches a callback for only the rejection of the Promise.
//      * @param onrejected The callback to execute when the Promise is rejected.
//      * @returns A Promise for the completion of the callback.
//      */
//     catch?<TResult = never>(onrejected?: ((reason: any) => TResult | IPromiseLike<TResult>) | undefined | null): IPromiseLike<T | TResult>;
// }

// /**
//  * Simple interface to convert a promise then (resolve/reject) into a single response
//  */
// export interface IAwaitResponse<T> {
//     /**
//      * The value returned by the resolved promise
//      */
//     value?: T;

//     /**
//      * Identifies if the promise was rejected (true) or was resolved (false/undefined)
//      */
//     rejected?: boolean;

//      /**
//      * The reason returned when the promise rejected
//      */
//     reason?: any;
// }
