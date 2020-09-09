

const readline = require("readline");
const DELAY_MILISECOND = 500;


async function readLines(prompt) {
  return new Promise(resolve => {
      let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })
      rl.question(
        '\n'+prompt,
        function(answer) {   
          resolve(answer) 
          rl.close()
      })
  }); 
 }

//to avoid the problem of 429 (too many requests in a time frame)
async function delay(t, v) {
  return new Promise(function(resolve) {
    setTimeout(resolve.bind(null, v), t);
  });
}

function flatDeep(arr, d = 1) {
  return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
               : arr.slice();
};

module.exports = {  
  readLines,
  delay,
  DELAY_MILISECOND,
  flatDeep
};