
var express = require('express');
var router = express.Router();
 const { get, post, put, patch } = require('./common'); 

//for pop out oAuth log in dialog
var opn = require('opn'); 
//var forgeSDK = require('forge-apis') 
var config = require('./config');  

router.get('/forgeoauth',function(req,res){

    //Authorization Code
    var code = req.query.code;

    (async (code,res) => {
      
        // var forge3legged = new forgeSDK.AuthClientThreeLegged(
        //   config[config.thisType].client_id,
        //   config[config.thisType].client_secret,
        //   config[config.thisType].callbackURL,
        //   config[config.thisScope]);

      try{
        //const tokenInfo = await forge3legged.getToken(code); 
        
        const tokenInfo = await get3LeggedToken(code); 

        config.thisToken = tokenInfo.access_token;  
        
        var thisTest=  require('./'+ config.thisTest); 
        thisTest.main(); 

        //writeTokenFile(tokenInfo);    
        res.redirect('/')
      }
      catch(ex){  
        console.log(ex);
        res.redirect('/')
      } 
    })(code,res); 
}); 

async function get3LeggedToken(code) {
  
  let endpoint =  config.isStg?'https://developer-stg.api.autodesk.com':
                                'https://developer.api.autodesk.com'
  endpoint += '/authentication/v1/gettoken'
  const body = {
    client_id: config[config.thisType].client_id,
    client_secret: config[config.thisType].client_secret,
    grant_type: 'authorization_code',
    code:code,
    redirect_uri:config[config.thisType].callbackURL
  };

  var formBody = [];
  for (var property in body) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(body[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
 
  const headers= {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  }
  const results = await post(endpoint, headers,formBody);
  return results;
}



function startoAuth(type,scope,test)
{   
  config.thisType = type;
  config.thisScope = scope;
  config.thisTest = test;
  config.isStg = config[config.thisType].isStg;

  let baseURL = config.isStg?'https://developer-stg.api.autodesk.com':
                             'https://developer.api.autodesk.com'

  var url =
      baseURL +
      '/authentication/v1/authorize?response_type=code' +
      '&client_id=' + config[config.thisType].client_id +
      '&redirect_uri=' + config[config.thisType].callbackURL +
      '&scope=' + config[config.thisScope].join(" ");
  
  //pop out the dialog of use login and authorization 
      opn(url, function (err) {
      if (err) throw err;
      console.log('The user closed the browser');
  }); 
}
 
module.exports = {
  router:router,
  startoAuth:startoAuth 
};