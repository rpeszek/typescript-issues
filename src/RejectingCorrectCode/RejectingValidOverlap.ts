/*
 * Compiler rejects `===` or `==` claiming that there is no type overlap where there is one.
 *
 * Submitted as bug report:
 * https://github.com/microsoft/TypeScript/issues/48628
 */



function testEqSemantics1(a: {bye: string}, b: {hello: string}): boolean {
    //Compiliation error:
    //This condition will always return 'false' since the types '{ bye: string; }' and '{ hello: string; }' have no overlap. ts(2367)
    return a === b
 }

const overlap = {hello: "world", bye: "Miss American Pie"}

testEqSemantics1(overlap, overlap)

function testEqSemantics2(a: {bye: string}, b: {hello: string}): boolean {
    //This condition will always return 'false' since the types '{ bye: string; }' and '{ hello: string; }' have no overlap.
    //return a === b
    //return a == b
    return true
 }
 
testEqSemantics2(overlap, overlap)