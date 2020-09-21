
const { post } = require('./BIM360_Data_Services/fetch_common'); //We may only need GET when exporting records
const config = require('./config');
const exportExcel = require('./Excel_Module/exportExcel')
const data_admin = require('./BIM360_Data_Services/data_admin')
const columnDefs = require('./Excel_Module/columnDefs');
const utility = require('./BIM360_Data_Services/utility');
const PromisePool = require("es6-promise-pool");

//get 2 legged token
async function get2LeggedToken() {

    let endpoint = config.ForgeBaseUrl + '/authentication/v1/authenticate'
    const body = {
        client_id: config.forge_app_credencial.client_id,
        client_secret: config.forge_app_credencial.client_secret,
        grant_type: 'client_credentials',
        scope: config.scope.join(' ')
    };

    var formBody = [];
    for (var property in body) {
        var encodedKey = encodeURIComponent(property)
        var encodedValue = encodeURIComponent(body[property])
        formBody.push(encodedKey + "=" + encodedValue)
    }
    formBody = formBody.join("&")

    const headers = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    const results = await post(endpoint, headers, formBody)
    return results.access_token
}

async function exportJob(args) {
    config.token_2legged = await get2LeggedToken();
    const dataIndex = args.findIndex(ele => ele == '-data')
    const dataType = dataIndex > -1 ? args[dataIndex + 1] : null
    const typeArray = dataType ? dataType.split('|') : null;

    if (typeArray && typeArray.findIndex(t => t == 'project') > -1) {
        try {
            var allProjects = [];
            var pageIndex = 0
            allProjects = await data_admin.exportProjects(config.bim360_account_id,config.limit,0,allProjects,pageIndex );
            exportExcel._export('account', 'projects', columnDefs.projectColumns, allProjects)
        } catch (e) {
            console.error(`export account projects list exception:${e}`)
        }
    }
    if (typeArray && typeArray.findIndex(t => t == 'accountCompany') > -1) {
        try {
            var allCompanies = [];
            var pageIndex = 0
            allCompanies = await data_admin.exportAccountCompanies(config.bim360_account_id, config.limit, 0, allCompanies,pageIndex);
            exportExcel._export('account', 'companies', columnDefs.accountCompanyColumns, allCompanies)
        } catch (e) {
            console.error(`export account companies list exception:${e}`)
        }
    }
    if (typeArray && typeArray.findIndex(t => t == 'accountUser') > -1) {

        try {
            var allUsers = [];
            var pageIndex = 0
            allUsers = await data_admin.exportAccountUsers(config.bim360_account_id, config.limit, 0, allUsers,pageIndex);
            exportExcel._export('account', 'users', columnDefs.accountUserColumns, allUsers)
        } catch (e) {
            console.error(`export account users list exception:${e}`)
        }
    }

    if (typeArray && typeArray.findIndex(t => t == 'projectUser') > -1) {

        try {
            //var allProjects = [{id:'6968a5b5-5d39-43cb-b4c4-5c5a1828f8f0',name:'Forge XXX'}];
            var allProjects = [];
            var pageIndex = 0
            allProjects = await data_admin.exportProjects(config.bim360_account_id, config.limit, 0, allProjects,pageIndex);

            let promiseArr = allProjects.map(async (proj, index) => {
                console.log(proj.name);
                await utility.delay(index * utility.DELAY_MILISECOND)
                var oneProjectUsers = [];
                var pageIndex = 0 
                oneProjectUsers = await data_admin.exportProjectsUsers(config.bim360_account_id, proj.id, proj.name, config.limit, 0, oneProjectUsers,pageIndex);
                return oneProjectUsers;
            });

            console.log('start getting project users');
            Promise.all(promiseArr).then((resultsArray) => {
                console.log('getting project users done:');
                const allUsers = utility.flatDeep(resultsArray,Infinity)
                exportExcel._export('project', 'users', columnDefs.projectUserColumns, allUsers)
            }).catch(function (err) {
                console.log(`exception when Promise.all getBIMProjectUsers: ${err}`);
            })
        } catch (e) {
            console.error(`export project users list exception:${e}`)
        }
    }

    if (typeArray && typeArray.findIndex(t => t == 'projectCompany') > -1) {

        try {
            //var allProjects = [{id:'6968a5b5-5d39-43cb-b4c4-5c5a1828f8f0',name:'Forge XXX'}];
            var allProjects = [];
            var pageIndex = 0
            allProjects = await data_admin.exportProjects(config.bim360_account_id, config.limit, 0, allProjects,pageIndex);

            let promiseArr = allProjects.map(async (proj, index) => {
                console.log(proj.name);
                await utility.delay(index * utility.DELAY_MILISECOND)
                var oneProjectCompanies = [];
                oneProjectCompanies = await data_admin.exportProjectsCompanies(config.bim360_account_id, proj.id, proj.name, config.limit, 0, oneProjectCompanies,null);
                return oneProjectCompanies; 
            }); 
            
            console.log('start getting project companies');
            Promise.all(promiseArr).then((resultsArray) => {
                console.log('getting project companies done:');
                const allCompanies  = utility.flatDeep(resultsArray,Infinity)
                exportExcel._export('project', 'companies', columnDefs.projectCompanyColumns, allCompanies)
            }).catch(function (err) {
                console.log(`exception when Promise.all exportProjectsCompanies: ${err}`);
            })
        } catch (e) {
            console.error(`export project companies list exception:${e}`)
        }
    }

    if (typeArray && typeArray.findIndex(t => t == 'projectRole') > -1) {

        try {
            //var allProjects = [{id:'6968a5b5-5d39-43cb-b4c4-5c5a1828f8f0',name:'Forge XXX'}];
            var allProjects = [];
            var pageIndex = 0
            allProjects = await data_admin.exportProjects(config.bim360_account_id, config.limit, 0, allProjects,pageIndex);

            let promiseArr = allProjects.map(async (proj, index) => {
                console.log(proj.name);
                await utility.delay(index * utility.DELAY_MILISECOND*2)
                var oneProjectRoles = [];
                var pageIndex = 0

                oneProjectRoles = await data_admin.exportProjectsRoles(config.bim360_account_id, proj.id, proj.name, config.limit, 0, oneProjectRoles,pageIndex);
                return oneProjectRoles;
            });

            console.log('start getting project roles');
            Promise.all(promiseArr).then((resultsArray) => {
                console.log('getting project roles done:');
                const allRoles  = utility.flatDeep(resultsArray,Infinity)
                exportExcel._export('project', 'roles', columnDefs.projectRoleColumns, allRoles)
            }).catch(function (err) {
                console.log(`exception when Promise.all exportProjectsRoles: ${err}`);
            })
        } catch (e) {
            console.error(`export project roles list exception:${e}`)
        }
    }


}
//get arguments
const args = process.argv.slice(2);
console.log(`args:${args}`);
exportJob(args)







