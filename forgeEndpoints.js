const config = require('./config');
const { get } = require('./fetch_unit'); //We may only need GET when exporting records
const forgeToken = require('./forgeToken'); //We may only need GET when exporting records

const ForgeBaseUrl = 'https://developer.api.autodesk.com'
const httpHeaders = function (access_token) {
  return {
    Authorization: 'Bearer ' + access_token
  }
}
const utility = require('./utility');
const PromisePool = require("es6-promise-pool");



async function getBIMProjects(accountid, limit, offset, allProjects) {
  try {
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint = `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/projects?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account projects ${offset} to ${offset + limit}`)
      allProjects = allProjects.concat(response);
      await utility.delay(utility.DELAY_MILISECOND);
      return getBIMProjects(accountid, limit, allProjects.length, allProjects);
    } else
      return allProjects
  } catch (e) {
    console.error(`getBIMProjects failed: ${e}`)
  }
}

async function getBIMCompanies(accountid, limit, offset, allCompanies) {
  try {
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint = `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account companies ${offset} to ${offset + limit}`)
      allCompanies = allCompanies.concat(response);
      await utility.delay(utility.DELAY_MILISECOND);
      return getBIMCompanies(accountid, limit, allCompanies.length, allCompanies);
    } else
      return allCompanies
  } catch (e) {
    console.error(`getBIMCompanies failed: ${e}`)
  }
}

async function getBIMAccountUsers(accountid, limit, offset, allUsers) {
  try {
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint = `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/users?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account users ${offset} to ${offset + limit}`)
      allUsers = allUsers.concat(response);
      await utility.delay(utility.DELAY_MILISECOND);
      return getBIMAccountUsers(accountid, limit, allUsers.length, allUsers);
    } else
      return allUsers
  } catch (e) {
    console.error(`getBIMAccountUsers failed: ${e}`)
  }
}


async function getBIMProjectUsers(accountid, projectId, projectName, limit, offset, allUsers) {
  try {
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint = `${ForgeBaseUrl}/bim360/admin/v1/projects/${projectId}/users?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting project ${projectName} users ${offset} to ${offset + limit}`)
      allUsers = allUsers.concat(response.results);
      await utility.delay(utility.DELAY_MILISECOND);
      return getBIMProjectUsers(accountid, projectId, projectName, limit, allUsers.length, allUsers);
    } else {

      //now, sort it out with the explicit data of company name, access level, and accessible services of this user
      let promiseArr = allUsers.map(async (u, index) => {
        await utility.delay(index * utility.DELAY_MILISECOND)

        u.project = projectName;

        const companyName = u.companyId?await getOneCompany(accountid, u.companyId):'';
        u.company = companyName;

        u.accessLevels_accountAdmin = u.accessLevels.accountAdmin
        u.accessLevels_projectAdmin = u.accessLevels.projectAdmin
        u.accessLevels_executive = u.accessLevels.executive

        if(u.services){
          let service_index = u.services.findIndex(ele => ele.serviceName == 'documentManagement')
          u.services_documentManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'projectAdministration')
          u.services_projectAdministration = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'projectManagement')
          u.services_projectManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'costManagement')
          u.services_costManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'assets')
          u.services_assets = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'designCollaboration')
          u.services_designCollaboration =service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'fieldManagement')
          u.services_fieldManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'insight')
          u.services_insight = service_index > -1 ? u.services[service_index].access : 'none'
        }

        return u;
      }); 

      return Promise.all(promiseArr).then( (resultsArray)=> {
           return resultsArray;
      }).catch(function (err) {
          console.log(`exception when Promise.all sorting out users: ${err}`);
      })  
  }
  }catch (e) {
  console.error(`getBIMProjectUsers ${projectName} failed: ${e}`)
} 
}

async function getOneCompany(accountid, companyId) {
  try {
    const oAuth = await forgeToken.get2LeggedToken()
    const endpoint = `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies/${companyId}`
    const headers = httpHeaders(oAuth.access_token)
    const response = await get(endpoint, headers);
    if (response) {
      return response.name;
    } else {
      console.log(`get one company info failed`)
    }
  } catch (e) {
    console.log(`getOneCompany failed: ${e}`)
  }
}


async function getProjectIssues(accountid, projectName,limit, offset, allIssues) {
  try {
    //find project
    const endpoint = `${ForgeBaseUrl}/project/v1/hubs/b.${accountid}/projects?limit=${limit}&offset=${offset}&filter[name]=${projectName}`
    const headers = httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data && response.data.length > 0) {
      const containerId = response.data[0].relationships.issues.data.id
      allIssues = await getProjectIssuesImpl(containerId,limit, offset, allIssues);
      return allIssues
    } else
      return allIssues
  } catch (e) {
    console.error(`getProjectIssues failed: ${e}`)
  }
}

async function getProjectIssuesImpl(containerId,limit, offset, allIssues) {
  try {
  
    const endpoint = `${ForgeBaseUrl}/issues/v1/containers/${containerId}/quality-issues?page[limit]=${limit}&page[offset]=${offset}`
    const headers = httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data && response.data.length > 0) {
      console.log(`getting issues ${offset} to ${offset + limit}`) 
      allIssues = allIssues.concat(response.data);
      await utility.delay(utility.DELAY_MILISECOND);
      return getProjectIssuesImpl(containerId, limit, allIssues.length, allIssues);
    } else
      return allIssues
  } catch (e) {
    console.error(`getProjectIssues failed: ${e}`)
  }
}

module.exports = {
  getBIMProjects: getBIMProjects,
  getBIMCompanies: getBIMCompanies,
  getBIMAccountUsers: getBIMAccountUsers,
  getBIMProjectUsers: getBIMProjectUsers,
  getProjectIssues:getProjectIssues

};