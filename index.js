const express = require('express');
const app = express();
const server = require('http').Server(app);
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({ extended: false });

const forgeToken = require('./forgeToken'); //We may only need GET when exporting records


// before your routes
app.use(parser.json());
app.use(urlencodedParser); // This will parse your body and make it available for your routes to use
const tokenRoute = require('./forgeToken');  
const exportExcel = require('./exportExcel')
const forgeEndpoints = require('./forgeEndpoints')
const columnDefs = require('./columnDefs')

const config = require('./config');
app.use('/', tokenRoute.router);  

app.set('port', 1234); 
server.listen(app.get('port'), function() {
    console.log('Server listening on port ' 
        + server.address().port);
});
//set port


async function exportJob(args){
    await forgeToken.get2LeggedToken();
    const data2Index = args.findIndex(ele => ele == '-data2')
    const data2Type = data2Index >-1 ? args[data2Index + 1] : null
    const type2Array =data2Type? data2Type.split('|'):null;

    const data3Index = args.findIndex(ele => ele == '-data3')
    const data3Type = data3Index >-1 ? args[data3Index + 1] : null
    const type3Array = data3Type?data3Type.split('|'):null;

     
    
    if (type3Array && type3Array.length>0) {
        config.types_3legged = type3Array
        //go to oauth workflow to get 3 legged token and execute the exporting 
        forgeToken.start3LeggedTokenoAuth(); 
    }

    // admin data: use 2 legged token 
    // documents data, use 2 or 3 legged token. To save codes, this sample uses 2 legged token

    if (type2Array && type2Array.findIndex(t => t == 'project') >-1) {  
        try{
        var allProjects = [];
        allProjects = await forgeEndpoints.getBIMProjects(config.bim360_account_id,
                                                            config.limit,
                                                            0,
                                                            allProjects);
        exportExcel._export('account','projects',columnDefs.projectColumns,allProjects)
        }catch(e){
            console.error(`export account projects list exception:${e}`)
        } 
    }
    if (type2Array && type2Array.findIndex(t => t == 'company') >-1) { 
        try{
        var allCompanies = [];
        allCompanies = await forgeEndpoints.getBIMCompanies(config.bim360_account_id,config.limit,0,allCompanies);
        exportExcel._export('account','companies',columnDefs.companyColumns,allCompanies)
        }catch(e){
            console.error(`export account companies list exception:${e}`)
        } 
    }
    if (type2Array && type2Array.findIndex(t => t == 'accountUser') >-1) { 
        
        try{
        var allUsers = [];
        allUsers = await forgeEndpoints.getBIMAccountUsers(config.bim360_account_id,config.limit,0,allUsers);
        exportExcel._export('account','users',columnDefs.accountUserColumns,allUsers)
        }catch(e){
            console.error(`export account users list exception:${e}`)
        } 
    }
    
    if (type2Array && type2Array.findIndex(t => t == 'projectUser') > -1) {
        
        try {
            //var allProjects = [{id:'6968a5b5-5d39-43cb-b4c4-5c5a1828f8f0',name:'Forge XXX'}];
            var allProjects = [];
            allProjects = await forgeEndpoints.getBIMProjects(config.bim360_account_id, config.limit, 0, allProjects);
            var allUsers = [];

            let promiseArr = allProjects.map(async (proj, index) => {
                console.log(proj.name);
                await utility.delay(index*utility.DELAY_MILISECOND)
                var oneProjectUsers = [];
                oneProjectUsers = await forgeEndpoints.getBIMProjectUsers(config.bim360_account_id, proj.id, proj.name, config.limit, 0, oneProjectUsers);
                allUsers = allUsers.concat(oneProjectUsers);
                return oneProjectUsers;
            });

            console.log('start getting project users');
            Promise.all(promiseArr).then( (resultsArray)=> {
                    console.log('getting project users done:');
                    exportExcel._export('project', 'users', columnDefs.projectUserColumns, allUsers)
            }).catch(function (err) {
                console.log(`exception when Promise.all getBIMProjectUsers: ${err}`);
            }) 
        } catch (e) {
            console.error(`export project users list exception:${e}`)
        } 
    }  
    
    
}
//get arguments
const args = process.argv.slice(2);
console.log(`args:${args}`);
exportJob(args)







 