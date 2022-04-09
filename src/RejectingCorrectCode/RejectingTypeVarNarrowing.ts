/*
 * This is an interesting one. 
 *
 * TS has problems with narrowing unbounded type variables to function types. 
 * 
 * TS incorrectly computes <T> in 'hole()' when assigned to function arguments by
 * trying to incorrectly widen the function inputs to 'unknown'.  
 */


// Given universally quantified, unbounded <T> 
const hole = <T>(): T => {
    throw new Error("hole"); 
}


export const apply = <T, R> (fn: (_1: T) => R) => (t:T): R => fn(t)


//I want to use  universally quantified <T> as a function type.
//
//Does not compile 
// 
// Argument of type '(_: never) => never' is not assignable to parameter of type '(_: unknown) => unknown'.
//   Types of parameters '_1' and '_1' are incompatible.
//     Type 'unknown' is not assignable to type 'never'.
apply(hole())


//This compiles just fine, and would be a good choice for the inferred type for 'fn'
apply(hole<(_: never) => unknown>())


//this compiles with questionable computed type for 'apply'
//const apply: <unknown, unknown>(fn: (_1: unknown) => unknown) => (t: unknown) => unknown 
apply({} as any)



//-----
// Notes, TS seems to know that the negative position is contravariant and positive position is covariant:
// but, apparently, not when inferring the types.
//-----

type Fn<T,R> = (t:T) => R

//compiles (logically sound)
const x1: Fn<never, unknown> = {} as Fn<number, string> 

//Fails to compile (logically sound)
//Type 'Fn<number, string>' is not assignable to type 'Fn<unknown, unknown>'.
//Type 'unknown' is not assignable to type 'number'.ts(2322)
const x2: Fn<unknown, unknown> = {} as Fn<number, string> 


