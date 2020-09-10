//functions to extract BIM 360 Admin data
//projects, companies, account users, project users

const config = require('../config');
//We may only need GET when exporting records
const { get } = require('./fetch_common');
const utility = require('./utility');


//export BIM 360 projects, recursive function
async function exportProjects(accountid, limit, offset, allProjects) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/hq/v1/accounts/${accountid}/projects?limit=${limit}&offset=${offset}`
    const headers = config.httpHeaders(config.token_2legged)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account projects ${offset} to ${offset + limit}`)
      allProjects = allProjects.concat(response);
      await utility.delay(utility.DELAY_MILISECOND)  
      return exportProjects(accountid, limit, allProjects.length, allProjects);
    } else
      return allProjects
  } catch (e) {
    console.error(`getBIMProjects failed: ${e}`)
  }
}

//export BIM 360 account companies , recursive function
async function exportAccountCompanies(accountid, limit, offset, allCompanies) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies?limit=${limit}&offset=${offset}`
    const headers = config.httpHeaders(config.token_2legged)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account companies ${offset} to ${offset + limit}`)
      allCompanies = allCompanies.concat(response);
      await utility.delay(utility.DELAY_MILISECOND)  
      return exportAccountCompanies(accountid, limit, allCompanies.length, allCompanies);
    } else
      return allCompanies
  } catch (e) {
    console.error(`getBIMCompanies failed: ${e}`)
  }
}

//export BIM 360 account users , recursive function
async function exportAccountUsers(accountid, limit, offset, allUsers) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/hq/v1/accounts/${accountid}/users?limit=${limit}&offset=${offset}`
    const headers = config.httpHeaders(config.token_2legged)
    const response = await get(endpoint, headers);
    if (response.length > 0) {
      console.log(`getting account users ${offset} to ${offset + limit}`)
      allUsers = allUsers.concat(response);
      await utility.delay(utility.DELAY_MILISECOND)  
      return exportAccountUsers(accountid, limit, allUsers.length, allUsers);
    } else
      return allUsers
  } catch (e) {
    console.error(`getBIMAccountUsers failed: ${e}`)
  }
}

//export BIM 360 project users , recursive function
async function exportProjectsUsers(accountid, projectId, projectName, limit, offset, allUsers) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/bim360/admin/v1/projects/${projectId}/users?limit=${limit}&offset=${offset}`
    const headers = config.httpHeaders(config.token_2legged)
    const response = await get(endpoint, headers);

    if (response.results && response.results.length > 0) {
      console.log(`getting project ${projectName} users ${offset} to ${offset + limit}`)
      allUsers = allUsers.concat(response.results);
      await utility.delay(utility.DELAY_MILISECOND)  
      return exportProjectsUsers(accountid, projectId, projectName, limit, allUsers.length, allUsers);
    } else {

      //now, sort it out with the explicit data of company name, access level, and accessible services of this user
      let promiseArr = allUsers.map(async (u, index) => {
        //must delay to avoid to hit rate limit
        await utility.delay(index * utility.DELAY_MILISECOND)

        var eachUser = {}
        eachUser.name = u.name
        eachUser.autodeskId = u.autodeskId
        eachUser.id = u.id

        eachUser.project = projectName; 
        eachUser.company = u.companyId ? await getOneCompany(accountid, u.companyId) : '';

        eachUser.accessLevels_accountAdmin = u.accessLevels.accountAdmin
        eachUser.accessLevels_projectAdmin = u.accessLevels.projectAdmin
        eachUser.accessLevels_executive = u.accessLevels.executive

        if (u.services) {
          let service_index = u.services.findIndex(ele => ele.serviceName == 'documentManagement')
          eachUser.services_documentManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'projectAdministration')
          eachUser.services_projectAdministration = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'projectManagement')
          eachUser.services_projectManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'costManagement')
          eachUser.services_costManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'assets')
          eachUser.services_assets = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'designCollaboration')
          eachUser.services_designCollaboration = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'fieldManagement')
          eachUser.services_fieldManagement = service_index > -1 ? u.services[service_index].access : 'none'
          service_index = u.services.findIndex(ele => ele.serviceName == 'insight')
          eachUser.services_insight = service_index > -1 ? u.services[service_index].access : 'none'
        }
        return eachUser;
      });

      return Promise.all(promiseArr).then((resultsArray) => {
        resultsArray = utility.flatDeep(resultsArray,Infinity)
        return resultsArray;
      }).catch(function (err) { 
        console.log(`exception when Promise.all sorting out users: ${err}`);
        return []
      })
    }
  } catch (e) {
    console.error(`exportProjectsUsers ${projectName} failed: ${e}`)
    return []
  }
}

//export BIM 360 project companies , recursive function
async function exportProjectsCompanies(accountid, projectId, projectName, limit, offset, allCompanies) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/hq/v1/accounts/${accountid}/projects/${projectId}/companies?limit=${limit}&offset=${offset}`
    const headers = config.httpHeaders(config.token_2legged)
    const response = await get(endpoint, headers);

    if (response && response.length > 0) {
      console.log(`getting project ${projectName} companies ${offset} to ${offset + limit}`)
      allCompanies = allCompanies.concat(response);
      await utility.delay(utility.DELAY_MILISECOND*2)  
      return exportProjectsCompanies(accountid, projectId, projectName, limit, allCompanies.length, allCompanies);
    } else {

      //now, sort it out with the explicit data of company name, access level, and accessible services of this user
      let promiseArr = allCompanies.map(async (c, index) => {
        //must delay to avoid to hit rate limit
        await utility.delay(index * utility.DELAY_MILISECOND*2)

        var eachCompany = {}
        eachCompany.project = projectName; 
        eachCompany.autodeskId = c.member_group_id // note: the special name for company
        eachCompany.id = c.id
        eachCompany.name = c.name
        eachCompany.city = c.city
        eachCompany.country = c.country 
        return eachCompany;
      });

      return Promise.all(promiseArr).then((resultsArray) => {
        resultsArray = utility.flatDeep(resultsArray,Infinity)
        return resultsArray;
      }).catch(function (err) { 
        console.log(`exception when Promise.all sorting out companies: ${err}`);
        return []
      })
    }
  } catch (e) {
    console.error(`exportProjectsCompanies ${projectName} failed: ${e}`)
    return []
  }
}

//export BIM 360 project roles , recursive function
async function exportProjectsRoles(accountid, projectId, projectName, limit, offset, allRoles) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/hq/v2/accounts/${accountid}/projects/${projectId}/industry_roles?limit=${limit}&offset=${offset}`
    const headers = config.httpHeaders(config.token_2legged)
    const response = await get(endpoint, headers);

    if (response && response.length > 0) {
      console.log(`getting project ${projectName} roles ${offset} to ${offset + limit}`)
      allRoles = allRoles.concat(response);
      await utility.delay(utility.DELAY_MILISECOND*2)  
      return exportProjectsRoles(accountid, projectId, projectName, limit, allRoles.length, allRoles);
    } else {

      //now, sort it out with the explicit data of company name, access level, and accessible services of this user
      let promiseArr = allRoles.map(async (r, index) => {
        //must delay to avoid to hit rate limit
        await utility.delay(index * utility.DELAY_MILISECOND*2)

        var eachRole = {}
        eachRole.project = projectName; 
        eachRole.autodeskId = r.member_group_id // note: the special name for company
        eachRole.id = r.id
        eachRole.name = r.name 

        if (r.services) {
          eachRole.services_design_collaboration = r.services.design_collaboration ? r.services.design_collaboration.access_level : 'none'
          eachRole.services_document_management = r.services.document_management ? r.services.document_management.access_level : 'none'
          eachRole.services_project_management = r.services.project_management ? r.services.project_management.access_level : 'none'
          eachRole.services_insight = r.services.insight ? r.services.insight.access_level : 'none'
          eachRole.services_model_coordination = r.services.model_coordination ? r.services.model_coordination.access_level : 'none'
          eachRole.services_project_administration = r.services.project_administration ? r.services.project_administration.access_level : 'none'
          eachRole.services_field_administration = r.services.field_administration ? r.services.field_administration.access_level : 'none'
          eachRole.services_assets = r.services.assets ? r.services.assets.access_level : 'none'

        }
        return eachRole;
      });

      return Promise.all(promiseArr).then((resultsArray) => {
        resultsArray = utility.flatDeep(resultsArray,Infinity)
        return resultsArray;
      }).catch(function (err) { 
        console.log(`exception when Promise.all sorting out roles: ${err}`);
        return []
      })
    }
  } catch (e) {
    console.error(`exportProjectsRoles ${projectName} failed: ${e}`)
    return []
  }
}
 

//get one company data
async function getOneCompany(accountid, companyId) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies/${companyId}`
    const headers = config.httpHeaders(config.token_2legged)
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

module.exports = {
  exportProjects,
  exportAccountCompanies,
  exportAccountUsers,
  exportProjectsUsers,
  exportProjectsCompanies,
  exportProjectsRoles,

  getOneCompany
};