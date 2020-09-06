const express = require('express');
const app = express();
const server = require('http').Server(app);
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({ extended: false });

const config = require('./config'); 
const forgeEndpoints = require('./forgeEndpoints');
const columnDefs = require('./columnDefs'); 
const exportExcel = require('./exportExcel'); 


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
const typeArray = dataType.split('|')

if (typeArray.findIndex(t => t == 'project') >-1) {
    
    (async ()=>{
        try{
        var allProjects = [];
        allProjects = await forgeEndpoints.getBIMProjects(config.bim360_account_id,config.limit,0,allProjects);
        exportExcel._export('account','projects',columnDefs.projectColumns,allProjects)
        }catch(e){
            console.error(`export account projects list exception:${e}`)
        }
    })() 
}
if (typeArray.findIndex(t => t == 'company') >-1) {
    (async ()=>{
        try{
        var allCompanies = [];
        allCompanies = await forgeEndpoints.getBIMCompanies(config.bim360_account_id,config.limit,0,allCompanies);
        exportExcel._export('account','companies',columnDefs.companyColumns,allCompanies)
        }catch(e){
            console.error(`export account companies list exception:${e}`)
        }
    })() 
}
if (typeArray.findIndex(t => t == 'accountUser') >-1) {
    (async ()=>{
        try{
        var allUsers = [];
        allUsers = await forgeEndpoints.getBIMAccountUsers(config.bim360_account_id,config.limit,0,allUsers);
        exportExcel._export('account','users',columnDefs.accountUserColumns,allUsers)
        }catch(e){
            console.error(`export account users list exception:${e}`)
        }
    })() 
}

if (typeArray.findIndex(t => t == 'projectUser') >-1) {
    (async ()=>{
        try{
        var allProjects = [];
        allProjects = await forgeEndpoints.getBIMProjects(config.bim360_account_id,config.limit,0,allProjects);
        var allUsers = [];
        await allProjects.forEach(async proj => {
            var oneProjectUsers = [];
            oneProjectUsers = await forgeEndpoints.getBIMProjectUsers(config.bim360_account_id,proj.id,proj.name,config.limit,0,oneProjectUsers);
            allUsers = allUsers.concat(oneProjectUsers); 
        });
        exportExcel._export('project','users',columnDefs.projectUserColumns,allUsers)
        }catch(e){
            console.error(`export project users list exception:${e}`)
        }
    })() 
}  

  