
//for pop out oAuth log in dialog
const opn = require('opn');
const express = require('express');
const router = express.Router();

const config = require('./config'); 
const exportExcel = require('./exportExcel')
const columnDefs = require('./columnDefs')
const utility = require('./utility');

const forgeEndpoints = require('./forgeEndpoints')

const { get,post} = require('./fetch_unit'); //We may only need GET when exporting records
const ForgeBaseUrl = 'https://developer.api.autodesk.com' 

//get 2 legged token: data of admin, documents
async function get2LeggedToken() {

  let endpoint =  ForgeBaseUrl +  '/authentication/v1/authenticate'
  const body = {
    client_id: config.forge_app_credencial.client_id,
    client_secret: config.forge_app_credencial.client_secret,
    grant_type: 'client_credentials',
    scope:config.scope.join(' ') 
  };

  var formBody = [];
  for (var property in body) {
    var encodedKey = encodeURIComponent(property)
    var encodedValue = encodeURIComponent(body[property])
    formBody.push(encodedKey + "=" + encodedValue)
  }
  formBody = formBody.join("&")

  const headers= {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  const results = await post(endpoint, headers,formBody)
  config.token_2legged =  results.access_token
} 

// 3 legged token functions 
router.get('/forgeoauth',async (req,res)=>{ 

  res.send(); //response

  //Authorization Code
  const code = req.query.code;  

  const body = {
    client_id: config.forge_app_credencial.client_id,
    client_secret: config.forge_app_credencial.client_secret,
    grant_type: 'authorization_code',
    code:code,
    redirect_uri:config.forge_app_credencial.callback_url 
  };

  var formBody = [];
  for (var property in body) {
    var encodedKey = encodeURIComponent(property)
    var encodedValue = encodeURIComponent(body[property])
    formBody.push(encodedKey + "=" + encodedValue)
  }
  formBody = formBody.join("&")

  let endpoint =  ForgeBaseUrl +  '/authentication/v1/gettoken'

  const headers= {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  const results = await post(endpoint, headers,formBody)
  config.token_3legged =  results.access_token

  /////
  process3LeggedExport()
  /////

 });  


function start3LeggedTokenoAuth()
{  
  var url = `${ForgeBaseUrl}/authentication/v1/authorize?response_type=code` +
            `&client_id=${config.forge_app_credencial.client_id}`+
            `&redirect_uri=${config.forge_app_credencial.callback_url}`+
            `&scope=${config.scope.join(" ")}` 
  
  //pop out the dialog of use login and authorization 
      opn(url, function (err) {
      if (err) throw err;
      console.log('The user can close the browser now');
  }); 
} 


module.exports = { 
  router:router,
  get2LeggedToken:get2LeggedToken,
  start3LeggedTokenoAuth:start3LeggedTokenoAuth
};


async function process3LeggedExport(){ 

  const types_3legged = config.types_3legged

  if (types_3legged.findIndex(t => t.includes('issue')) >-1) {
    const index = types_3legged.findIndex(t => t.includes('issue'))
    const projectName = types_3legged[index].split('>')[1];  
    
    try{
        var allIssues = [];
        allIssues = await forgeEndpoints.getProjectIssues(config.bim360_account_id,projectName,config.limit,0,allIssues);
        exportExcel._export('issues',`${projectName}`,columnDefs.issueColumns,allIssues)
        console.log(`export project issues list done`)

      }catch(e){
          console.error(`export project issues list exception:${e}`)
      }

  }

  if (types_3legged.findIndex(t => t.includes('document')) > -1) {
        
    try {
         const index = types_3legged.findIndex(t => t.includes('document'))
        const projectName = types_3legged[index].split('>')[1];  
        if(projectName!=''){
            var allDocuments = [];
            allDocuments = await forgeEndpoints.getProjectDocuments(config.bim360_account_id, 
                                                                projectName,
                                                                config.limit, 0, allDocuments);
            
            //console.log(`getting project ${projectName}>>folder${folderName} documemts done`);
            allDocuments = utility.flatDeep(allDocuments,Infinity)
            exportExcel._export('project', 'documents', columnDefs.projectDocumentsColumns, allDocuments)
        }else{
            console.log('please input project name with the arguments!')
        }
        
    } catch (e) {
        console.error(`export project documents list exception:${e}`)
    } 
} 


}