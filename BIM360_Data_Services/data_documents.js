const config = require('../config');
const { post,get } = require('./fetch_common'); //We may only need GET when exporting records
const data_admin = require('./data_admin')
const utility = require('./utility');
const { urlencoded } = require('body-parser');

var Defs = {}

//export documents of one project
async function exportProjectDocuments(accountid, projectName, limit, offset) {
  try {
    //find project
    const endpoint = `${config.ForgeBaseUrl}/project/v1/hubs/b.${accountid}/projects?limit=${limit}&offset=${offset}&filter[name]=${encodeURIComponent(projectName)}`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response.data && response.data.length > 0) {
      const projectId = response.data[0].id
      const projectId_without_b = projectId.split('b.')[1]

      Defs[projectId] = {
        allProjectUsers: null
      }
      //dump project users 
      var allProjectUsers = []
      allProjectUsers = await data_admin.exportProjectsUsers(accountid, projectId_without_b, projectName, limit, offset, allProjectUsers)
      Defs[projectId].allProjectUsers = allProjectUsers
      //dump project companies
      var allProjectCompanies = []
      allProjectCompanies = await data_admin.exportProjectsCompanies(accountid, projectId_without_b,projectName, limit, offset, allProjectCompanies)
      Defs[projectId].allProjectCompanies = allProjectCompanies 

      //now start to dump documents info
      //dump all contents before specific time, because more contents may be added to BIM360 while running the scripts
      // to avoid endless dummping.

      const currentDate = new Date()
      const createdBefore = currentDate.getFullYear()
        + '-' + (currentDate.getMonth() + 1)
        + '-' + currentDate.getDate();
      console.log('starting extracting all documents')
      var allRawDocuments = await exportProjectDocumentsImpl(accountid, projectId, createdBefore);

      //make nested array flatten
      allRawDocuments = utility.flatDeep(allRawDocuments, Infinity)

      //now sorting out the documents with the required data
      console.log('starting sorting out the documents, including finding custom attributes')
      let promiseArr = allRawDocuments.map(async (d, index) => {

        await utility.delay(index * utility.DELAY_MILISECOND*2)

        const projectId = d.links.self.href.split('/')[6]
        const projectId_without_b = projectId.split('b.')[1]

        var eachDoc = {}
        eachDoc.folder = d.folder
        eachDoc.item_urn = d.id
        eachDoc.name = d.attributes.displayName
        var tipVersionId = d.relationships &&
                          d.relationships.tip &&
                          d.relationships.tip.data ?
                          d.relationships.tip.data.id:null;

        eachDoc.tipverion = tipVersionId?tipVersionId.split('?')[1]:'<null>'

        eachDoc.createTime = d.attributes.createTime
        eachDoc.createUserName = d.attributes.createUserName
        eachDoc.lastModifiedUserName = d.attributes.lastModifiedUserName
        eachDoc.type = d.attributes.extension.type
        eachDoc.sourceFileName = d.attributes.extension.data.sourceFileName

        if(tipVersionId){
          const versionData = await getOneVersion(projectId,tipVersionId)
          eachDoc.sourceFileType  = versionData.attributes.fileType ? versionData.attributes.fileType:'<null>'
        }else{
          eachDoc.sourceFileType = '<null>' 
        }

        const ca_string = await getOneDocCustomAtt(projectId_without_b,tipVersionId)
        eachDoc.custom_attributes = ca_string

        return eachDoc

      })

      return Promise.all(promiseArr).then((resultsArray) => {
        //make nested array flatten
        resultsArray = utility.flatDeep(resultsArray, Infinity)
        return resultsArray;
      }).catch(function (err) {
        console.log(`exception when Promise.all all folders: ${err}`);
      })

    } else {
      console.log(`no documents with this project ${projectName}`)
      return []
    }
  } catch (e) {
    console.error(`getProjectIssues failed: ${e}`)
  }
}

async function exportProjectDocumentsImpl(accountid, projectId, createdBefore) {
  try {
    //dump all top folders
    const endpoint = `${config.ForgeBaseUrl}/project/v1/hubs/b.${accountid}/projects/${projectId}/`
      + `topFolders?filter[createTime]-le=${createdBefore}&filter[hidden]=false`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.data) {

      let promiseArr = response.data.map(async (folder, index) => { 
        await utility.delay(index * utility.DELAY_MILISECOND) 
        const folderName = folder.attributes.displayName
        const folderUrn = folder.id

        var oneFolderDocuments = []
        oneFolderDocuments = await extractFolderDocuments(projectId,
          folderName,
          folderUrn,
          createdBefore,
          config.limit,
          0,
          oneFolderDocuments)
        return oneFolderDocuments
      })

      return Promise.all(promiseArr).then((resultsArray) => {
        return resultsArray;
      }).catch(function (err) {
        console.log(`exception when Promise.all all folders: ${err}`);
      })

    } else {
      console.log(`get top folders failed or no top folders!`)
      return []
    }
  } catch (e) {
    console.log(`getProjectDocumentsImpl failed: ${e}`)
  }
}

async function extractFolderDocuments(projectId, parentFolderName, folderUrn, createdBefore, limit, offset, allDocuments) {
  try {
    //dump all top folders
    const endpoint = `${config.ForgeBaseUrl}/data/v1/projects/${projectId}/folders/${folderUrn}/contents`
      + `?filter[createTime]-le=${createdBefore}&filter[hidden]=false`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.data) {
      console.log(` extracting all documents in folder ${parentFolderName}`)

      let promiseArr = response.data.map(async (r, index) => {

        await utility.delay(index * utility.DELAY_MILISECOND)

        if (r.type == 'folders') {
          const folderName = r.attributes.displayName
          const folderUrn = r.id

          var thisSubFolderDocuments = []
          thisSubFolderDocuments = await extractFolderDocuments(projectId,
            parentFolderName + '>' + folderName,
            folderUrn,
            createdBefore,
            config.limit,
            0,
            thisSubFolderDocuments)
          return thisSubFolderDocuments

        } else if (r.type == 'items') {
          r.folder = parentFolderName
          return r
        } else {
          return null
        }
      })

      return Promise.all(promiseArr).then((resultsArray) => {
        return resultsArray;
      }).catch(function (err) {
        console.log(`exception when Promise.all all folders: ${err}`);
      })

    } else {

      return allDocuments
    }
  } catch (e) {
    console.log(`extractFolderDocuments failed: ${e}`)
  } 
} 


//get one version data
async function getOneVersion(projectId, versionId) {
  try {
    versionId = encodeURIComponent(versionId)
    const endpoint = `${config.ForgeBaseUrl}/data/v1/projects/${projectId}/versions/${versionId}`
    const headers = config.httpHeaders(config.token_3legged)
    const response = await get(endpoint, headers);
    if (response && response.data) { 

      return response.data;
    } else {
      console.log(`getOneVersion info failed`)
    }
  } catch (e) {
    console.log(`getOneVersion failed: ${e}`)
  }
} 

//get document custom attributes 
async function getOneDocCustomAtt(projectId, versionId) {
  try {
    const endpoint = `${config.ForgeBaseUrl}/bim360/docs/v1/projects/${projectId}/versions:batch-get`
    var headers = config.httpHeaders(config.token_3legged)
    headers['Content-Type'] = 'application/json'
    const body = { 
        urns: [
          versionId
        ] 
    }
    const response = await post(endpoint, headers,JSON.stringify(body));
    if (response && response.results && response.results.length>0) {
      const caList = response.results[0].customAttributes
      var ca_string = ''
      caList.forEach(async element => {
        ca_string += `name:${element.name} value:${element.value}\n `
      }); 
      return ca_string;
    } else {
      console.log(`getOneDocCustomAtt info failed`)
      return '' 
    }
  } catch (e) {
    console.log(`getOneDocCustomAtt failed: ${e}`)
    return '' 
  }
} 


module.exports = {
  exportProjectDocuments,
  getOneVersion,
  getOneDocCustomAtt
};