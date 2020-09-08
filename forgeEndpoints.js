const config = require('./config');
const { get } = require('./fetch_unit'); //We may only need GET when exporting records

const ForgeBaseUrl = 'https://developer.api.autodesk.com'
const httpHeaders = function (access_token) {
  return {
    Authorization: 'Bearer ' + access_token
  }
}
const utility = require('./utility');

var Defs = {}

function  resetDefs () {

  Defs = {}

} 


async function getBIMProjects(accountid, limit, offset, allProjects) {
  try {
    const endpoint = `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/projects?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(config.token_2legged)
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
    const endpoint = `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(config.token_2legged)
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
    const endpoint = `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/users?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(config.token_2legged)
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
    const endpoint = `${ForgeBaseUrl}/bim360/admin/v1/projects/${projectId}/users?limit=${limit}&offset=${offset}`
    const headers = httpHeaders(config.token_2legged)
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


async function getProjectIssues(accountid, projectName,limit, offset, allIssues) {
  try {
    //find project
    const endpoint = `${ForgeBaseUrl}/project/v1/hubs/b.${accountid}/projects?limit=${limit}&offset=${offset}&filter[name]=${projectName}`
    const headers = httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data && response.data.length > 0) {
      const projectId = response.data[0].id 
      const containerId = response.data[0].relationships.issues.data.id
      Defs[containerId]={
        allIssueTypes:null,
        allIssueRootCauses:null,
        allCustomAttDefs:null,
        allProjectUsers:null
      }

      //dump issue types collection
      var allIssueTypes =[]
      allIssueTypes = await extractIssueTypes(containerId)
      Defs[containerId].allIssueTypes = allIssueTypes
      //dump root cause collection
      var allIssueRootCauses =[]
      allIssueRootCauses = await extractIssueRootCauses(containerId)
      Defs[containerId].allIssueRootCauses = allIssueRootCauses
      //dump custom attribute defs
      var allCustomAttDefs =[]
      allCustomAttDefs = await extractIssueCustomAttDefs(containerId)
      Defs[containerId].allCustomAttDefs = allCustomAttDefs
      //dump project users 
      var allProjectUsers =[]
      allProjectUsers = await getBIMProjectUsers(accountid,projectId,projectName,limit, offset,allProjectUsers)
      Defs[containerId].allProjectUsers = allProjectUsers
      //now start to dump issue info
      allIssues = await getProjectIssuesImpl(containerId,limit, offset, allIssues);

      return allIssues
    } else{

       
    }
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
    } else{

      //now, sort it out with the explicit data of some properties
      let promiseArr = allIssues.map(async (issue, index) => {
        await utility.delay(index * utility.DELAY_MILISECOND)

        const issueId = issue.id
        issue.title = issue.attributes.title
        issue.description = issue.attributes.description
        issue.status = issue.attributes.status
        issue.dueDate = new Date(issue.attributes.due_date)

        //ng_issue_type
        const issue_type = Defs[containerId].allIssueTypes.find(i=> i.id==issue.attributes.ng_issue_type_id)
        issue.issue_type = issue_type.title
        //ng_issue_subtype
        const issue_subtype = issue_type.subtypes.find(i=>i.id==issue.attributes.ng_issue_subtype_id)
        issue.issue_subtype = issue_subtype.title
        issue.assigned_to_type = issue.attributes.assigned_to_type
        //find user name
        const user  = Defs[containerId].allProjectUsers.find(i=>i.id== issue.attributes.assign_to)
        issue.assigned_to = user.name
        //root_cause
        issue.root_cause = issue.attributes.root_cause
        issue.isPushpinIssue = issue.attributes.pushpin_attributes?'YES':'NO'
        issue.attachment_count = issue.attributes.attachment_count

        var allCooments = []
        allCooments = await extractIssueComments(containerId,issueId,config.limit,0,allCooments)
        for(var index in allCooments){
          issue.comments += `${allCooments[index].attributes.body}\n`
        }
        issue.customAttributes = []
        for(var index in issue.attributes.custom_attributes){
          const eachCA = issue.attributes.custom_attributes[index]
          if(eachCA.type == 'list'){
              const customDefIndex = Defs[containerId].allCustomAttDefs.findIndex(i=>i.id == eachCA.id)
              const valueIndex = Defs[containerId].allCustomAttDefs[customDefIndex].metadata.list.options.findIndex(i=>i.id == eachCA.value)
              issue.customAttributes.push(Defs[containerId].allCustomAttDefs[customDefIndex].metadata.list.options[valueIndex].value)
            }else
            issue.customAttributes.push(eachCA.value)
        } 
        return issue;
      })

      return Promise.all(promiseArr).then( (resultsArray)=> {
        return resultsArray;
      }).catch(function (err) {
          return []
          console.log(`exception when Promise.all sorting out issues: ${err}`);
      }) 
       
    }
  } catch (e) {
    console.error(`getProjectIssues failed: ${e}`)
  }
}



//////////
async function getOneCompany(accountid, companyId) {
  try {
    const endpoint = `${ForgeBaseUrl}/hq/v1/accounts/${accountid}/companies/${companyId}`
    const headers = httpHeaders(config.token_2legged)
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


async function extractIssueTypes(containerId) {
  try {
    const endpoint = `${ForgeBaseUrl}/issues/v1/containers/${containerId}/ng-issue-types?include=subtypes`
    const headers = httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.results ) {
      return response.results;
    } else {
      console.log(`extractIssueTypes failed`)
    }
  } catch (e) {
    console.log(`extractIssueTypes failed: ${e}`)
  }
}

async function extractIssueRootCauses(containerId) {
  try {
    const endpoint = `${ForgeBaseUrl}/issues/v1/containers/${containerId}/root-causes`
    const headers = httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.data ) {
      return response.data;
    } else {
      console.log(`extractIssueRootCauses failed`)
    }
  } catch (e) {
    console.log(`extractIssueRootCauses failed: ${e}`)
  }
}
 

async function extractIssueCustomAttDefs(containerId) {
  try {
    const endpoint = `${ForgeBaseUrl}/issues/v2/containers/${containerId}/issue-attribute-definitions`
    const headers = httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.results ) {
      return response.results;
    } else {
      console.log(`extractCustomAttDefs failed`)
    }
  } catch (e) {
    console.log(`extractCustomAttDefs failed: ${e}`)
  }
}


async function extractIssueComments(containerId,issueId,limit, offset, allComments) {
  try {
    const endpoint = `${ForgeBaseUrl}/issues/v1/containers/${containerId}/quality-issues/${issueId}/comments?page[limit]=${limit}&page[offset]=${offset}`
    const headers = httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.data &&  response.data.length>0) {
      console.log(`getting issue comments ${offset} to ${offset + limit}`)
      allComments = allComments.concat(response.data);
      await utility.delay(utility.DELAY_MILISECOND);
      return extractIssueComments(containerId,issueId,limit, allComments.length, allComments);
    } else {
      return allComments
    }
  } catch (e) {
    console.log(`extractIssueComments failed: ${e}`)
  }
}

 

module.exports = {
  getBIMProjects: getBIMProjects,
  getBIMCompanies: getBIMCompanies,
  getBIMAccountUsers: getBIMAccountUsers,
  getBIMProjectUsers: getBIMProjectUsers,
  getProjectIssues:getProjectIssues,
  resetDefs:resetDefs
};