/*
 * Examples of nonsense / wrong code accepted by the TypeScript compiler.
 * All have this in common: unknown is found somewhere in the type signature
 * 
 * Submitted as bug report
 * https://github.com/microsoft/TypeScript/issues/48624
 */

/**
 * Helper needed in examples
 * const curry: <T1, T2, R>(fn: (ax: T1, bx: T2) => R) => (a: T1) => (b: T2) => R
 */
const curry = <T1, T2, R>(
  fn: (ax: T1, bx: T2) => R
): ((a: T1) => (b: T2) => R) => {
  const res = (a: T1) => (b: T2) => fn(a, b);
  return res;
};

/**
 * computed type is:
 * const nonsense1: (a: unknown) => (b: unknown) => string
 */
const nonsense1 = curry(() => "test");

/**
 * computed type is:
 * const nonsense2: <T1, T2, R>(a: (ax: T1, bx: T2) => R) => (b: unknown) => (a: T1) => (b: T2) => R
 */
const nonsense22 = curry(curry);

/**
 * To demostrate another gotcha, here unknown is replaced by 'string'
 */
const unknownReplaced22: (
  a: (ax: string, bx: string) => string
) => (b: string) => (b: string) => (a: string) => (b: string) => string = curry(
  curry(curry)
);

/**
 * computed type is:
 * const nonsense4: <T1, T2, R>(a: (ax: T1, bx: T2) => R) => (b: unknown) => (b: unknown) => (a: T1) => (b: T2) => R
 */
const nonsense222 = curry(curry(curry));

/**
 * Helper needed in examples
 */
const curry3 = <T1, T2, T3, R>(
  fn: (ax: T1, bx: T2, cx: T3) => R
): ((a: T1) => (b: T2) => (c: T3) => R) => {
  const res = (a: T1) => (b: T2) => (c: T3) => fn(a, b, c);
  return res;
};

/**
 * computed type is:
 * const nonsense3: <T1, T2, T3, R>(a: (ax: T1, bx: T2, cx: T3) => R) => (b: unknown) => (a: T1) => (b: T2) => (c: T3) => R
 */
const nonsense23 = curry(curry3);

// -------------------------
//Promisifying
// -------------------------

type Callback<T> = (x: T[]) => void;

/**
 * Helper needed in examples
 */
const callbackPromise = <T>(
  getasync: (fx: Callback<T>) => void
): Promise<T> => {
  return new Promise((resolve, reject) => {
     //not important
  });
};

declare function myAynch(x: string, callback?: Callback<string>):void

const example = async (item: Office.MessageRead): Promise<void> => {
  //TS computes:
  //const nonsence: unknown
    const nonsence =  await callbackPromise(
      curry3(myAynch)("html")(() => "boo"))
}


// --------------------------
//Use of existential typing:
// --------------------------

type Api = {getGoodies: string[]}

//provides access to API, password needs to be protected
declare function login<Password>(p: Password): Api 

//provide password to a computation, that computation should be able to use the password but shouldn't return it
const secretive = <R> (fn: <Password> (p: Password) => R): R  => {
   const s : any = "topsecret"
   return fn (s)
}

const goodProgram = <Password>(p: Password): string[] => {
    const api = login(p)
    return api.getGoodies
}

const stealPassword = <Password>(p: Password): Password => p

//computed type
//const secretive: <string[]>(fn: <Password>(p: Password) => string[]) => string[]
secretive(goodProgram)

//computed type
//const secretive: <unknown>(fn: <Password>(p: Password) => unknown) => unknown
secretive(stealPassword)