const config = require('../config');
const { get } = require('./fetch_common'); //We may only need GET when exporting records
const data_admin = require('./data_admin')
const utility = require('./utility');

var Defs = {}

async function extractProjectIssues(accountid, projectName, limit, offset, allIssues) {
  try {
    //find project
    const endpoint = `${config.ForgeBaseUrl}/project/v1/hubs/b.${accountid}/projects?limit=${limit}&offset=${offset}&filter[name]=${encodeURIComponent(projectName)}`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data && response.data.length > 0) {
      const projectId = response.data[0].id
      const projectId_without_b = projectId.split('b.')[1]

      const containerId = response.data[0].relationships.issues.data.id
      Defs[containerId] = {
        allIssueTypes: null,
        allIssueRootCauses: null,
        allIssueCustomAttDefs: null,
        allProjectUsers: null,
        allProjectCompanies: null
      }

      //dump issue types collection
      var allIssueTypes = []
      allIssueTypes = await extractIssueTypes(containerId)
      Defs[containerId].allIssueTypes = allIssueTypes
      //dump root cause collection
      var allIssueRootCauses = []
      allIssueRootCauses = await extractIssueRootCauses(containerId)
      Defs[containerId].allIssueRootCauses = allIssueRootCauses
      //dump custom attribute defs
      var allIssueCustomAttDefs = []
      allIssueCustomAttDefs = await extractIssueCustomAttDefs(containerId)
      Defs[containerId].allIssueCustomAttDefs = allIssueCustomAttDefs
      //dump project users 
      var allProjectUsers = []
      allProjectUsers = await data_admin.exportProjectsUsers(accountid, projectId_without_b, projectName, limit, offset, allProjectUsers)
      Defs[containerId].allProjectUsers = allProjectUsers
      //dump project companies
      var allProjectCompanies = []
      allProjectCompanies = await data_admin.exportProjectsCompanies(accountid, projectId_without_b,projectName, limit, offset, allProjectCompanies)
      Defs[containerId].allProjectCompanies = allProjectCompanies
      //now start to dump issue info
      allIssues = await extractProjectIssuesImpl(containerId, limit, offset, allIssues);

      return allIssues
    } else {

      return []
    }
  } catch (e) {

    console.error(`getProjectIssues failed: ${e}`)
    return []
  }

}

async function extractProjectIssuesImpl(containerId, limit, offset, allIssues) {
  try {

    const endpoint = `${config.ForgeBaseUrl}/issues/v1/containers/${containerId}/quality-issues?page[limit]=${limit}&page[offset]=${offset}`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data && response.data.length > 0) {
      console.log(`getting issues ${offset} to ${offset + limit}`)
      allIssues = allIssues.concat(response.data);
      await utility.delay(utility.DELAY_MILISECOND);
      return extractProjectIssuesImpl(containerId, limit, allIssues.length, allIssues);
    } else {

      //now, sort it out with the explicit data of some properties
      let promiseArr = allIssues.map(async (issue, index) => {
        await utility.delay(index * utility.DELAY_MILISECOND)

        const issueId = issue.id
        issue.title = issue.attributes.title
        issue.description = issue.attributes.description
        issue.status = issue.attributes.status
        issue.dueDate = new Date(issue.attributes.due_date)

        //ng_issue_type
        const issue_type = Defs[containerId].allIssueTypes.find(i => i.id == issue.attributes.ng_issue_type_id)
        issue.issue_type = issue_type.title
        //ng_issue_subtype
        const issue_subtype = issue_type.subtypes.find(i => i.id == issue.attributes.ng_issue_subtype_id)
        issue.issue_subtype = issue_subtype.title
        issue.assigned_to_type = issue.attributes.assigned_to_type
        //find user name
        switch (issue.assigned_to_type) {
          case 'user':
            const user = Defs[containerId].allProjectUsers.find(i => i.autodeskId == issue.attributes.assigned_to)
            issue.assigned_to = user ? user.name : '<invalid>'
            break;
          case 'company':
            const company = Defs[containerId].allProjectCompanies.find(i => i.autodeskId == issue.attributes.assigned_to)
            issue.assigned_to = company ? company.name : '<invalid>'
            break;
        }

        //root_cause
        issue.root_cause = issue.attributes.root_cause
        issue.isPushpinIssue = issue.attributes.pushpin_attributes ? 'YES' : 'NO'
        issue.attachment_count = issue.attributes.attachment_count

        var allCooments = []
        issue.comments = ''
        allCooments = await extractIssueComments(containerId, issueId, config.limit, 0, allCooments)
        for (var index in allCooments) {
          issue.comments += `${allCooments[index].attributes.body}\n`
        }
        issue.customAttributes = ''
        for (var index in issue.attributes.custom_attributes) {
          const eachCA = issue.attributes.custom_attributes[index]
          if (eachCA.type == 'list') {
            const customDefIndex = Defs[containerId].allIssueCustomAttDefs.findIndex(i => i.id == eachCA.id)
            const valueIndex = Defs[containerId].allIssueCustomAttDefs[customDefIndex].metadata.list.options.findIndex(i => i.id == eachCA.value)
            if (valueIndex > -1)
              issue.customAttributes += `${Defs[containerId].allIssueCustomAttDefs[customDefIndex].metadata.list.options[valueIndex].title},${Defs[containerId].allIssueCustomAttDefs[customDefIndex].metadata.list.options[valueIndex].value}\n`
             else
              issue.customAttributes += `${eachCA.title},${eachCA.value}\n`
          } else
            issue.customAttributes += `${eachCA.title},${eachCA.value}\n`
        }
        return issue;
      })

      return Promise.all(promiseArr).then((resultsArray) => {
        const allIssues = utility.flatDeep(resultsArray, Infinity)
        return allIssues;
      }).catch(function (err) {
        console.log(`exception when Promise.all sorting out issues: ${err}`);
        return []
      })

    }
  } catch (e) {
    console.error(`getProjectIssues failed: ${e}`)
  }
}
async function extractIssueTypes(containerId) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/issues/v1/containers/${containerId}/ng-issue-types?include=subtypes`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.results) {
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
    const endpoint = `${config.ForgeBaseUrl}/issues/v1/containers/${containerId}/root-causes`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.data) {
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
    const endpoint = `${config.ForgeBaseUrl}/issues/v2/containers/${containerId}/issue-attribute-definitions`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.results) {
      return response.results;
    } else {
      console.log(`extractIssueCustomAttDefs failed`)
    }
  } catch (e) {
    console.log(`extractIssueCustomAttDefs failed: ${e}`)
  }
}

async function extractIssueComments(containerId, issueId, limit, offset, allComments) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/issues/v1/containers/${containerId}/quality-issues/${issueId}/comments?page[limit]=${limit}&page[offset]=${offset}`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.data && response.data.length > 0) {
      console.log(`getting issue comments ${offset} to ${offset + limit}`)
      allComments = allComments.concat(response.data);
      await utility.delay(utility.DELAY_MILISECOND);
      return extractIssueComments(containerId, issueId, limit, allComments.length, allComments);
    } else {
      return allComments
    }
  } catch (e) {
    console.log(`extractIssueComments failed: ${e}`)
  }
}


module.exports = {
  extractProjectIssues
};