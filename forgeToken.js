const config = require('./config'); 
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
  return results
} 

module.exports = { 
  get2LeggedToken:get2LeggedToken, 
};