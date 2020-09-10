
//for pop out oAuth log in dialog
const express = require('express');
const app = express();
const server = require('http').Server(app);
const parser = require('body-parser');
const urlencodedParser = parser.urlencoded({ extended: false });
const opn = require('opn');

const { post } = require('./BIM360_Data_Services/fetch_common'); //We may only need GET when exporting records
const config = require('./config');
const exportExcel = require('./Excel_Module/exportExcel')
const columnDefs = require('./Excel_Module/columnDefs')

const data_documents = require('./BIM360_Data_Services/data_documents')
const data_issues = require('./BIM360_Data_Services/data_issues') 
const utility = require('./BIM360_Data_Services/utility');

app.use(parser.json());
app.use(urlencodedParser); // This will parse your body and make it available for your routes to use


app.set('port', 1234); 
server.listen(app.get('port'), function() {
    console.log('Server listening on port ' 
        + server.address().port);
});

// 3 legged token functions 
app.get('/forgeoauth', async (req, res) => {

  res.send(); //response

  //Authorization Code
  const code = req.query.code;

  const body = {
    client_id: config.forge_app_credencial.client_id,
    client_secret: config.forge_app_credencial.client_secret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: config.forge_app_credencial.callback_url
  };

  var formBody = [];
  for (var property in body) {
    var encodedKey = encodeURIComponent(property)
    var encodedValue = encodeURIComponent(body[property])
    formBody.push(encodedKey + "=" + encodedValue)
  }
  formBody = formBody.join("&")

  let endpoint = config.ForgeBaseUrl + '/authentication/v1/gettoken'

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  const results = await post(endpoint, headers, formBody)
  config.token_3legged = results.access_token

  /////
  process3LeggedExport()
  /////

});


function start3LeggedTokenoAuth() {
  var url = `${config.ForgeBaseUrl}/authentication/v1/authorize?response_type=code` +
    `&client_id=${config.forge_app_credencial.client_id}` +
    `&redirect_uri=${config.forge_app_credencial.callback_url}` +
    `&scope=${config.scope.join(" ")}`

  //pop out the dialog of use login and authorization 
  opn(url, function (err) {
    if (err) throw err;
    console.log('The user can close the browser now');
  });
}
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

async function process3LeggedExport() {
  
  //get arguments
  const args = process.argv.slice(2);
  console.log(`args:${args}`);
  config.token_2legged = await get2LeggedToken();

  const dataIndex = args.findIndex(ele => ele == '-data')
  const dataType = dataIndex > -1 ? args[dataIndex + 1] : null
  const typeArray = dataType ? dataType.split('|') : null;

  if (typeArray.findIndex(t => t.includes('issue')) > -1) {
    const index = typeArray.findIndex(t => t.includes('issue'))
    const projectName = typeArray[index].split('>')[1];

    try {
      var allIssues = [];
      allIssues = await data_issues.extractProjectIssues(config.bim360_account_id, projectName, config.limit, 0, allIssues);
      exportExcel._export('issues', `${projectName}`, columnDefs.issueColumns, allIssues)
      console.log(`export project issues list done`) 
    } catch (e) {
      console.error(`export project issues list exception:${e}`)
    } 
  }

  if (typeArray.findIndex(t => t.includes('document')) > -1) {

    try {
      const index = typeArray.findIndex(t => t.includes('document'))
      const projectName = typeArray[index].split('>')[1];
      if (projectName != '') {
        var allDocuments = [];
        allDocuments = await data_documents.exportProjectDocuments(config.bim360_account_id, projectName,config.limit, 0);
        exportExcel._export('project', 'documents', columnDefs.documentColumns, allDocuments)
        console.log(`export project documents list done`)  
      } else {
        console.log('please input project name with the arguments!')
      }

    } catch (e) {
      console.error(`export project documents list exception:${e}`)
    }
  } 
}


start3LeggedTokenoAuth() 
