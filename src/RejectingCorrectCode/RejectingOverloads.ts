/**
 * Examples showing type inference issues in presence of overloading
 *
 * This example is motivated by Office API
 * Office.js overloading is quite complex.
 */

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

/**
 * Helper needed in examples
 */
const curry2 = <T1, T2, R>(
  fn: (ax: T1, bx: T2) => R
): ((a: T1) => (b: T2) => R) => {
  const res = (a: T1) => (b: T2) => fn(a, b);
  return res;
};

/**
 * Helper needed in examples
 */
export const curry3 = <T1, T2, T3, R>(
  fn: (ax: T1, bx: T2, cx: T3) => R
): ((a: T1) => (b: T2) => (c: T3) => R) => {
  const res = (a: T1) => (b: T2) => (c: T3) => fn(a, b, c);
  return res;
};


// Weird interface motivated by office.js
// Changing the definition order will impact which overload will compile
interface Body {
  getAsync(coercionType: string, options: boolean, callback?: Callback<string>):void
  getAsync(coercionType: string,                   callback?: Callback<string>):void
}


// interface Body {
//   getAsync(coercionType: string,                   callback?: Callback<string>):void
//   getAsync(coercionType: string, options: boolean, callback?: Callback<string>):void
// }

const willNotCompile2 = async (item: Office.MessageRead): Promise<void> => {
  
  const body: Body = {} as any
  //compiles, computed type
  //body2: string
  // if the order of declarations in Body was flipped, this would stop compiling  
  const body2 = await callbackPromise(
    curry2(body.getAsync)("html")
  );

  //compiles
  //computed type
  //const body3b: string
  const body3b = await callbackPromise<string>(
    curry3<
      string,
      boolean,
      Callback<string>,
      void
    >(body.getAsync)("html")(true)
  );

  //does not compile
  // Argument of type 'boolean' is not assignable to parameter of type 'Callback<string>'.
  //
  // if the order of declarations in Body was flipped, this would compile
  const body3a = await callbackPromise(
    curry3(body.getAsync)("html")(true)
  );

  //this actually compiles but is not relevant to this story!
  const crazyWrong =  await callbackPromise(
    curry3(body.getAsync)("html")(() => "boo"))
  ;
};