module.exports = { 
    forge_app_credencial:{
      client_id: process.env.FORGE_CLIENT_ID || '<your client id of Forge>',   
      client_secret:process.env.FORGE_CLIENT_SECRET || '<your client secret of Forge>',
      callback_url:'http://localhost:1234/forgeoauth'
    },
    scope: ['data:read', 'account:read'],
    bim360_account_id:'<your BIM account id>',
    token_2legged:'' ,
    token_3legged:'',
    limit:20,
    ForgeBaseUrl:'https://developer.api.autodesk.com',
    httpHeaders: function (access_token) {
      return {
        Authorization: 'Bearer ' + access_token
      }
    }
};