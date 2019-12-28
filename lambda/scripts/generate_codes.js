#!/usr/bin/env node
let results = [];
while (results.length < 10) {
  let result = "";
  while (result.length < 4) {
    const randoCharCode = Math.floor(Math.random() * 26) + 65;
    const randoLetter = String.fromCharCode(randoCharCode);
    result = result.concat(randoLetter);
  }
  results.push(result);
}
console.log("Codes: ", results);
