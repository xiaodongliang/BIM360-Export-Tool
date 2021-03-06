
const projectColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'start_date', propertyName: 'start_date', columnTitle: 'start_date', columnWidth: 16, locked: false },
   { id: 'end_date', propertyName: 'end_date', columnTitle: 'Eend_date', columnWidth: 16, locked: true },
   { id: 'project_type', propertyName: 'project_type', columnTitle: 'Pproject_type', columnWidth: 16, locked: false },
   { id: 'value', propertyName: 'value', columnTitle: 'value', columnWidth: 16, locked: false },
   { id: 'currency', propertyName: 'currency', columnTitle: 'currency', columnWidth: 16, locked: false },
   { id: 'city', propertyName: 'city', columnTitle: 'city', columnWidth: 16, locked: false },
   { id: 'country', propertyName: 'country', columnTitle: 'country', columnWidth: 16, locked: true },
   { id: 'language', propertyName: 'language', columnTitle: 'language', columnWidth: 32, locked: true },
   { id: 'construction_type', propertyName: 'construction_type', columnTitle: 'construction_type', columnWidth: 8, locked: true }
];

const accountCompanyColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'trade', propertyName: 'trade', columnTitle: 'Tratradede', columnWidth: 16, locked: false },
   { id: 'erp_id', propertyName: 'erp_id', columnTitle: 'erp_id', columnWidth: 16, locked: true },
   { id: 'website_url', propertyName: 'website_url', columnTitle: 'website_url', columnWidth: 16, locked: false }
];

const accountUserColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'role', propertyName: 'role', columnTitle: 'role', columnWidth: 16, locked: false },
   { id: 'company_name', propertyName: 'company_name', columnTitle: 'company_name', columnWidth: 16, locked: true },
   { id: 'website_url', propertyName: 'website_url', columnTitle: 'website_url', columnWidth: 16, locked: false },
   { id: 'last_sign_in', propertyName: 'last_sign_in', columnTitle: 'last_sign_in', columnWidth: 16, locked: false },
   { id: 'email', propertyName: 'email', columnTitle: 'email', columnWidth: 16, locked: false },
   { id: 'uid', propertyName: 'uid', columnTitle: 'uid', columnWidth: 16, locked: false },
   { id: 'city', propertyName: 'city', columnTitle: 'city', columnWidth: 16, locked: false },
   { id: 'country', propertyName: 'country', columnTitle: 'country', columnWidth: 16, locked: true },
   { id: 'created_at', propertyName: 'created_at', columnTitle: 'created_at', columnWidth: 16, locked: false },
   { id: 'job_title', propertyName: 'job_title', columnTitle: 'job_title', columnWidth: 16, locked: false },
   { id: 'industry', propertyName: 'industry', columnTitle: 'industry', columnWidth: 16, locked: false }

];


const projectUserColumns = [
   { id: 'project', propertyName: 'project', columnTitle: 'project', columnWidth: 8, locked: true },
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'autodeskId', propertyName: 'autodeskId', columnTitle: 'autodeskId', columnWidth: 16, locked: false },
   { id: 'email', propertyName: 'email', columnTitle: 'email', columnWidth: 16, locked: false },
   { id: 'jobTitle', propertyName: 'jobTitle', columnTitle: 'jobTitle', columnWidth: 16, locked: true },

   { id: 'industry', propertyName: 'industry', columnTitle: 'industry', columnWidth: 16, locked: false },
   { id: 'company', propertyName: 'company', columnTitle: 'company', columnWidth: 16, locked: false },

   { id: 'accessLevels_accountAdmin', propertyName: 'accessLevels_accountAdmin', columnTitle: 'accessLevels_accountAdmin', columnWidth: 16, locked: false },
   { id: 'accessLevels_projectAdmin', propertyName: 'accessLevels_projectAdmin', columnTitle: 'accessLevels_projectAdmin', columnWidth: 16, locked: false },
   { id: 'accessLevels_executive', propertyName: 'accessLevels_executive', columnTitle: 'accessLevels_executive', columnWidth: 16, locked: false },

   { id: 'services_documentManagement', propertyName: 'services_documentManagement', columnTitle: 'services_documentManagement', columnWidth: 16, locked: false },
   { id: 'services_projectAdministration', propertyName: 'services_projectAdministration', columnTitle: 'services_projectAdministration', columnWidth: 16, locked: false },
   { id: 'services_costManagement', propertyName: 'services_costManagement', columnTitle: 'services_costManagement', columnWidth: 16, locked: false },
   { id: 'services_assets', propertyName: 'services_assets', columnTitle: 'services_assets', columnWidth: 16, locked: false },
   { id: 'services_designCollaboration', propertyName: 'services_designCollaboration', columnTitle: 'services_designCollaboration', columnWidth: 16, locked: false },
   { id: 'services_fieldManagement', propertyName: 'services_fieldManagement', columnTitle: 'services_fieldManagement', columnWidth: 16, locked: false },
   { id: 'services_insight', propertyName: 'services_insight', columnTitle: 'services_insight', columnWidth: 16, locked: false }

];

const projectCompanyColumns = [
   { id: 'project', propertyName: 'project', columnTitle: 'project', columnWidth: 8, locked: true },
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'autodeskId', propertyName: 'autodeskId', columnTitle: 'autodeskId', columnWidth: 16, locked: false },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'trade', propertyName: 'trade', columnTitle: 'Tratradede', columnWidth: 16, locked: false },
   { id: 'city', propertyName: 'city', columnTitle: 'city', columnWidth: 16, locked: true },
   { id: 'website_url', propertyName: 'website_url', columnTitle: 'website_url', columnWidth: 16, locked: false }
];

const projectRoleColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'ID', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'Name', columnWidth: 16, locked: false },
   { id: 'autodeskId', propertyName: 'autodeskId', columnTitle: 'autodeskId', columnWidth: 16, locked: false },

   { id: 'accessLevels_project_administration', propertyName: 'accessLevels_project_administration', columnTitle: 'accessLevels_project_administration', columnWidth: 16, locked: false },
   { id: 'accessLevels_document_management', propertyName: 'accessLevels_document_management', columnTitle: 'accessLevels_document_management', columnWidth: 16, locked: true },
   { id: 'accessLevels_field_management', propertyName: 'accessLevels_field_management', columnTitle: 'accessLevels_field_management', columnWidth: 16, locked: true },
   { id: 'accessLevels_assets', propertyName: 'accessLevels_assets', columnTitle: 'accessLevels_assets', columnWidth: 16, locked: false },
   { id: 'accessLevels_model_coordination', propertyName: 'accessLevels_model_coordination', columnTitle: 'accessLevels_model_coordination', columnWidth: 16, locked: false },
   { id: 'accessLevels_design_collaboration', propertyName: 'accessLevels_design_collaboration', columnTitle: 'accessLevels_design_collaboration', columnWidth: 16, locked: false },
   { id: 'accessLevels_insight', propertyName: 'accessLevels_insight', columnTitle: 'accessLevels_insight', columnWidth: 16, locked: false }

];


const issueColumns = [
   { id: 'id', propertyName: 'id', columnTitle: 'id', columnWidth: 8, locked: true },
   { id: 'title', propertyName: 'title', columnTitle: 'title', columnWidth: 16, locked: false },
   { id: 'description', propertyName: 'description', columnTitle: 'description', columnWidth: 16, locked: false },
   { id: 'status', propertyName: 'status', columnTitle: 'status', columnWidth: 16, locked: true },
   { id: 'dueDate', propertyName: 'dueDate', columnTitle: 'dueDate', columnWidth: 16, locked: true },

   { id: 'assigned_to', propertyName: 'assigned_to', columnTitle: 'assigned_to', columnWidth: 16, locked: false },
   { id: 'assigned_to_type', propertyName: 'assigned_to_type', columnTitle: 'assigned_to_type', columnWidth: 16, locked: false },
   { id: 'issue_type', propertyName: 'issue_type', columnTitle: 'issue_type', columnWidth: 16, locked: false },
   { id: 'issue_subtype', propertyName: 'issue_subtype', columnTitle: 'issue_subtype', columnWidth: 16, locked: false },

   { id: 'root_cause', propertyName: 'root_cause', columnTitle: 'root_cause', columnWidth: 16, locked: false },
   { id: 'isPushpinIssue', propertyName: 'isPushpinIssue', columnTitle: 'isPushpinIssue', columnWidth: 16, locked: false },
   { id: 'comments', propertyName: 'comments', columnTitle: 'comments', columnWidth: 16, locked: false },
   { id: 'attachment_count', propertyName: 'attachment_count', columnTitle: 'attachment_count', columnWidth: 16, locked: false },
   { id: 'customAttributes', propertyName: 'customAttributes', columnTitle: 'customAttributes', columnWidth: 16, locked: false }
];


const documentColumns = [
   { id: 'folder', propertyName: 'folder', columnTitle: 'folder', columnWidth: 8, locked: true },
   { id: 'item_urn', propertyName: 'item_urn', columnTitle: 'item_urn', columnWidth: 8, locked: true },
   { id: 'name', propertyName: 'name', columnTitle: 'name', columnWidth: 16, locked: false },
   { id: 'tipverion', propertyName: 'tipverion', columnTitle: 'tipverion', columnWidth: 16, locked: false },
   { id: 'createTime', propertyName: 'createTime', columnTitle: 'createTime', columnWidth: 16, locked: true },

   { id: 'lastModifiedUserName', propertyName: 'lastModifiedUserName', columnTitle: 'lastModifiedUserName', columnWidth: 16, locked: true },
   { id: 'createUserName', propertyName: 'createUserName', columnTitle: 'createUserName', columnWidth: 16, locked: false },
   { id: 'type', propertyName: 'type', columnTitle: 'type', columnWidth: 16, locked: false },
   { id: 'sourceFileName', propertyName: 'sourceFileName', columnTitle: 'sourceFileName', columnWidth: 16, locked: false },
   { id: 'sourceFileType', propertyName: 'sourceFileType', columnTitle: 'sourceFileType', columnWidth: 16, locked: false },
   { id: 'custom_attributes', propertyName: 'custom_attributes', columnTitle: 'custom_attributes', columnWidth: 16, locked: false }

]; 


module.exports = {
   projectColumns,
   accountCompanyColumns,
   accountUserColumns,
   projectUserColumns,
   projectCompanyColumns,
   projectRoleColumns,


   issueColumns,
   documentColumns
};
