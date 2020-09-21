# bim360 data export tool

## Description
This is a script to extract BIM 360 data. So far, it supports
1. projects list
2. account companies list
3. account users list
4. project companies list
5. project users list
6. project documents list
7. project issues list

TODO
1. project checklists list
2. project rfis list
3. project assets list


![](/breakdown.png)


# Setup
1. **Forge Account**: Learn how to create a Forge Account, activate subscription and create an app by [this tutorial](http://learnforge.autodesk.io/#/account/). Input the callback url: http://localhost:1234/forgeoauth
2. **BIM 360 Account Integration**: must be Account Admin to add the app integration. [Learn about provisioning](https://forge.autodesk.com/blog/bim-360-docs-provisioning-forge-apps). 

3. **Node.js**: basic knowledge with [**Node.js**](https://nodejs.org/en/).
4. **JavaScript** basic knowledge with **JavaScript**
5. Install [Cache Clean Tool of Chrome](https://chrome.google.com/webstore/detail/clear-cache/cppjkneekbjaeellbfkmgnhonkkjfpdn)
6. set Chrome as default browser

## Running locally
1. Clone this project or download it. It's recommended to install [GitHub desktop](https://desktop.github.com/). To clone it via command line, use the following (**Terminal** on MacOSX/Linux, **Git Shell** on Windows):
```
    git clone https://github.com/xiaodongliang/BIM360-Export-Tool
```
2.  install the required packages. Via command line, navigate to the folder where this repository was cloned and use the following:
```
    npm install 
```
3. Input the client id, secret and callback to environment, or input them to the corresponding fields of [config.js](./config.js).

4. Via command line, run the code
```
    node 2lo_export.js -data project|accountCompany|accountUser|projectUser|projectCompany
```
This will export data list of projects , account companies, account users, project companies and project users by 2 legged token. The lists will be excel files in **Exported_Data** folder. you can extract some of them only e.g. the script below will dump two lists only.
```
    node 2lo_export.js -data project|accountCompany
```
5. Via command line, run the code
```
    node 3lo_export.js -data issue>Forge Concert Hall|document>Forge Concert Hall
```
where **Forge Concert Hall** is your BIM360 project name.

The code will direct to log in Autodesk account. Input the user name and password. Allow the app with the related permissions (by scopes). Then the code will extract all documents and issues of the project. The lists will be excel files in **Exported_Data** folder.

6. To switch users logging, click the button of **Cache Clean Tool of Chrome**, run the code again, and log in with another user.

## Debug

1.  Input the client id, secret and callback to [launch.json](./.vscode/launch.json)
2.  Input the start script file and arguments e.g. 

```
"program": "${workspaceFolder}/2lo_export.js",
            "args": [
                "-data",
                "project|accountCompany|accountUser|projectUser|projectCompany|projectUser",
            ]
]
```

3. To extract issue list, the launch parmaters will be:
```
 "program": "${workspaceFolder}/3lo_export.js",
            "args": [
                "-data",
                "issue>Forge Concert Hall" 
]
```
 start to debug, it will direct to log in Autodesk account. Input the user name and password. Allow the app with the related permissions (by scopes). Then the code will extract all documents and issues of the project.

 ### Supported arguments

1. 2lo_export.js

-  **project**: projects list
-  **accountCompany**: account companies list
-  **accountUser**: account users list
-  **projectCompany**: project companies list
-  **projectUser**: project users list

2. 3lo_export.js
-  **document**: project documents list
-  **issue**: project issues list
