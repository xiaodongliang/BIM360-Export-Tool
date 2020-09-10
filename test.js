const express = require('express');
const app = express();
const server = require('http').Server(app);
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({ extended: false });
const PromisePool = require("es6-promise-pool"); 


const config = require('./config'); 
const forgeEndpoints = require('./forgeEndpoints');
const columnDefs = require('./columnDefs'); 
const exportExcel = require('./exportExcel'); 
const utility = require('./BIM360_Data_Services/utility'); 


// before your routes
app.use(parser.json());
app.use(urlencodedParser); // This will parse your body and make it available for your routes to use

//get arguments
const args = process.argv.slice(2);
console.log(`args:${args}`);

// admin data: use 2 legged token 
// documents data, use 2 or 3 legged token. To save codes, this sample uses 2 legged token
const flagIndex = args.findIndex(ele => ele == '-data')
const dataType = flagIndex != null ? args[flagIndex + 1] : null
const typeArray = dataType.split('|');

// if (typeArray.findIndex(t => t == 'project') >-1) {
    
//     (async ()=>{
//         try{
//         var allProjects = [];
//         allProjects = await forgeEndpoints.getBIMProjects(config.bim360_account_id,config.limit,0,allProjects);
//         exportExcel._export('account','projects',columnDefs.projectColumns,allProjects)
//         }catch(e){
//             console.error(`export account projects list exception:${e}`)
//         }
//     })() 
// }
// if (typeArray.findIndex(t => t == 'company') >-1) {
//     (async ()=>{
//         try{
//         var allCompanies = [];
//         allCompanies = await forgeEndpoints.getBIMCompanies(config.bim360_account_id,config.limit,0,allCompanies);
//         exportExcel._export('account','companies',columnDefs.companyColumns,allCompanies)
//         }catch(e){
//             console.error(`export account companies list exception:${e}`)
//         }
//     })() 
// }
// if (typeArray.findIndex(t => t == 'accountUser') >-1) {
//     (async ()=>{
//         try{
//         var allUsers = [];
//         allUsers = await forgeEndpoints.getBIMAccountUsers(config.bim360_account_id,config.limit,0,allUsers);
//         exportExcel._export('account','users',columnDefs.accountUserColumns,allUsers)
//         }catch(e){
//             console.error(`export account users list exception:${e}`)
//         }
//     })() 
// }

// if (typeArray.findIndex(t => t == 'projectUser') >-1) {
//     (async ()=>{
//         try{
//         var allProjects = [];
//         allProjects = await forgeEndpoints.getBIMProjects(config.bim360_account_id,config.limit,0,allProjects);
//         var allUsers = [];

//         allProjects.forEach(async (proj) => {
//             console.log(proj.name);
//             await utility.delay(utility.DELAY_MILISECOND)
//             var oneProjectUsers = [];
//             oneProjectUsers = await forgeEndpoints.getBIMProjectUsers(config.bim360_account_id,proj.id,proj.name,config.limit,0,oneProjectUsers);
//             allUsers = allUsers.concat(oneProjectUsers); 
//         });
 
//         exportExcel._export('project','users',columnDefs.projectUserColumns,allUsers)
//         }catch(e){
//             console.error(`export project users list exception:${e}`)
//         }
//     })() 
// }  



(async ()=>{

    try{
        
        const allProjects = ['a','b','c','d','e','f','g','h','i','j']

        let promiseArr = allProjects.map(async (resource,index) =>{
            await delay1(index * 1000);
            console.log(resource);

            var allProjects = [];
            //allProjects = await forgeEndpoints.getBIMProjects(config.bim360_account_id,config.limit,0,allProjects);
            allProjects = await eachTest(index);
            //console.log(allProjects.length);
            return allProjects;
        });

        console.log('start');  
        Promise.all(promiseArr).then(function(resultsArray){
            // do something after the loop finishes
            console.log('done:'+ resultsArray); 
        }).catch(function(err){
            // do something when any of the promises in array are rejected
        })

        // allProjects.forEach(async (proj,index) => {  

        //     var allProjects = [];
        //     //allProjects = await forgeEndpoints.getBIMProjects(config.bim360_account_id,config.limit,0,allProjects);
        //     await delay1(index * 1000)
        //     console.log(proj);
        //     console.log(index);

        // });
  }catch(e){

  }
})()

async function eachTest(index){  
  await delay1(index * 1000);
  const allProjects = ['a1','b1','c1','d1','e1','f1','g1','h1','i1','j1']
  let promiseArr = allProjects.map(async (resource,index) =>{
    await delay1(index * 1000);
    console.log(resource);
    return resource +'-update';
  });

  return Promise.all(promiseArr).then(function(resultsArray){
      // do something after the loop finishes
    return  resultsArray;
  }).catch(function(err){
      // do something when any of the promises in array are rejected
  })
}

// async function eachPromise(value,index){  
//     await delay1(index * 1000) 
// }
// function processArray(array, fn) {
//     var results = [];
//     return array.reduce((p, item) => {
//       return p.then(()=> {
//         return fn(item).then((data)=> {
//           results.push(data);
//           return results;
//         });
//       });
//     }, Promise.resolve());
// }

// const allProjects = ['a','b','c','d','e','f','g','h','i','j']

// processArray(allProjects, eachPromise).then(function(result) {
//     console.log(result);
//   }, function(reason) {
//     console.log(reason);
// });


async function delay1(t, v) {
    return new Promise(function(resolve) {
      setTimeout(resolve.bind(null, v), t);
    });
}
 

const display = function(e){
    console.log(e);
}

const delayLoop = (fn) => {

    return new Promise(resolve=>(name, i) => {
      setTimeout((resolve) => {
        fn(name);
      }, i * 5000);
    });
};
 

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
