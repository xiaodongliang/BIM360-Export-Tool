const config = require('./config'); 
const { get} = require('./fetch_unit'); //We may only need GET when exporting records
const forgeToken= require('./forgeToken'); //We may only need GET when exporting records

const ForgeBaseUrl = 'https://developer.api.autodesk.com' 
const httpHeaders = function(access_token){
  return {
    Authorization: 'Bearer ' + access_token 
  }
}


async function getBIMProjects(accountid,limit,offset,allProjects) {
  try{
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint =  `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/projects?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if(response.length >0){
      console.log(`getting account projects ${offset} to ${offset+limit}`)
      allProjects = allProjects.concat(response);
      return getBIMProjects(accountid,limit,allProjects.length,allProjects);  
    }else
      return allProjects 
  }catch(e){
    console.error(`getBIMProjects failed: ${e}`)
  } 
} 

async function getBIMCompanies(accountid,limit,offset,allCompanies) {
  try{
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint =  `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if(response.length >0){
      console.log(`getting account companies ${offset} to ${offset+limit}`)
      allCompanies = allCompanies.concat(response);
      return getBIMCompanies(accountid,limit,allCompanies.length,allCompanies);  
    }else
      return allCompanies 
  }catch(e){
    console.error(`getBIMCompanies failed: ${e}`)
  } 
} 

async function getBIMAccountUsers(accountid,limit,offset,allUsers) {
  try{
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint =  `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/users?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if(response.length >0){
      console.log(`getting account users ${offset} to ${offset+limit}`)
      allUsers = allUsers.concat(response);
      return getBIMAccountUsers(accountid,limit,allUsers.length,allUsers);  
    }else
      return allUsers 
  }catch(e){
    console.error(`getBIMAccountUsers failed: ${e}`)
  } 
} 


async function getBIMProjectUsers(accountid,projectId,projectName,limit,offset,allUsers) {
  try{
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint =  `${ForgeBaseUrl}/bim360/admin/v1/projects/${projectId}/users?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if(response.results && response.results.length >0){
      console.log(`getting project ${projectName} users ${offset} to ${offset+limit}`)
      allUsers = allUsers.concat(response.results);
      return getBIMAccountUsers(accountid,projectId,projectName,limit,allUsers.length,allUsers);  
    }else{
      //now, sort it out with the explict data of company name, access level, and accessible services of this user
      await allUsers.forEach(async u => {
        const company = await getOneCompany(accountid,u.companyId);
        u.company = company;

        u.accessLevels_accountAdmin = u.accessLevels.accountAdmin
        u.accessLevels_projectAdmin = u.accessLevels.projectAdmin
        u.accessLevels_executive = u.accessLevels.executive

        const documentManagement = u.services.findIndex(ele => ele.serviceName == 'documentManagement')
        u.services_documentManagement = documentManagement >-1?documentManagement.access:'none'
        const projectAdministration = u.services.findIndex(ele => ele.serviceName == 'projectAdministration')
        u.services_projectAdministration = projectAdministration >-1?projectAdministration.access:'none' 

      });
      return allUsers 
    }
  }catch(e){
    console.error(`getBIMProjectUsers ${projectName} failed: ${e}`)
  } 
} 

async function getOneCompany(accountid,companyId) {
  try{
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint =  `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies/${companyId}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if(response){
      console.log(`get one company info`)
      return  response.name;
    }else{
      console.log(`get one company info failed`) 
    }
  }catch(e){
    console.log(`getOneCompany failed: ${e}`)
  } 
}

module.exports = { 
  getBIMProjects:getBIMProjects,
  getBIMCompanies:getBIMCompanies,
  getBIMAccountUsers:getBIMAccountUsers,
  getBIMProjectUsers:getBIMProjectUsers

};