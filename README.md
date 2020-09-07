# bim360-api-unit-test

## Description
This is a code to QA BIM 360 APIs in various scenarios.  
1. test production or staging
2. test Autodesk employee key or customer key
3. test with the key with/without provisioning BIM account
4. test with scope or without scope
5. test with 3legged token
6. test with 2 legged token with impersonated user (WIP)
7. test with project member/non project member

# Setup
1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app by [this tutorial](http://learnforge.autodesk.io/#/account/). 
-  apply an app on Forge production (http://forge.autodesk.com) as Autodesk employee, spcifying with callback url: http://localhost:1234/forgeoauth
-  apply an app on Forge staging (http://stg-forge.autodesk.com)as Autodesk employee, spcifying with callback url: http://localhost:1234/forgeoauth
-  apply an app on Forge production (http://forge.autodesk.com) as external customer, spcifying with callback url: http://localhost:1234/forgeoauth
-  apply an app on Forge staging (http://stg-forge.autodesk.com)as external customer, spcifying with callback url: http://localhost:1234/forgeoauth
2. **BIM 360 Account**: must be Account Admin to add the app integration. [Learn about provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). 
- add client id of production app  to BIM 360 production: https://admin.b360.autodesk.com
- add client id of statging app to BIM 360 staging: https://admin.b360-staging.autodesk.com/admin/
3. input the client id and secret to the corresponding fields of [config.js](./config.js). e.g. production app of Autodesk employee is input at adsk_production
3. **Node.js**: basic knowledge with [**Node.js**](https://nodejs.org/en/).
4. **JavaScript** basic knowledge with **JavaScript**
5. Install [Cache Clean Tool of Chrome](https://chrome.google.com/webstore/detail/clear-cache/cppjkneekbjaeellbfkmgnhonkkjfpdn)
6. set Chrome as default browser

## Running locally
1. Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):

    git clone https://github.com/xiaodongliang/bim360-api-unit-test
2.  install the required packages. Via command line, navigate to the folder where this repository was cloned and use the following:
```
    npm install 
```
3. specifcy which script to check in [index.js](./index.js) e.g. the script below is to test Issue API with production key and all scopes.
```
    tokenRoute.startoAuth('adsk_production','scopeAll','Issue/unit-test.js');

```
4. Via command line, run the code
```
    node index.js
```
5. The code will direct to log in Autodesk account. Input the user name and password. Allow the app with the related permissions (by scopes)
6. It will start to run the code
7. To swtich users loging, click the button of **Cache Clean Tool of Chrome**, run the code again, and log in with another user.

 
