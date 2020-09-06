
const projectColumns = [
    { id: 'id',                 propertyName: 'id',                     columnTitle: 'id',              columnWidth: 8,     locked: true },
    { id: 'name',               propertyName: 'name',                   columnTitle: 'name',            columnWidth: 16,    locked: false },
    { id: 'start_date',         propertyName: 'start_date',             columnTitle: 'start_date',      columnWidth: 16,    locked: false },
    { id: 'end_date',           propertyName: 'end_date',               columnTitle: 'Eend_date',        columnWidth: 16,    locked: true},
    { id: 'project_type',       propertyName: 'project_type',           columnTitle: 'Pproject_type',    columnWidth: 16,    locked: false },
    { id: 'value',              propertyName: 'value',                  columnTitle: 'value',           columnWidth: 16,    locked: false},
    { id: 'currency',           propertyName: 'currency',               columnTitle: 'currency',        columnWidth: 16,    locked: false },
    { id: 'city',               propertyName: 'city',                   columnTitle: 'city',            columnWidth: 16,    locked: false},
    { id: 'country',            propertyName: 'country',                columnTitle: 'country',         columnWidth: 16,    locked: true},
    { id: 'language',           propertyName: 'language',               columnTitle: 'language',        columnWidth: 32,    locked: true},
    { id: 'construction_type',  propertyName: 'construction_type',      columnTitle: 'construction_type',columnWidth: 8,    locked: true }
]; 

const companyColumns = [
    { id: 'id',             propertyName: 'id',                    columnTitle: 'id',              columnWidth: 8,     locked: true },
    { id: 'name',           propertyName: 'name',                  columnTitle: 'name',           columnWidth: 16,    locked: false },
    { id: 'trade',     propertyName: 'trade',            columnTitle: 'Tratradede',     columnWidth: 16,    locked: false },
    { id: 'erp_id',       propertyName: 'erp_id',              columnTitle: 'erp_id',       columnWidth: 16,    locked: true},
    { id: 'website_url',   propertyName: 'website_url',          columnTitle: 'website_url',          columnWidth: 16,    locked: false }
 ]; 

 const accountUserColumns = [
    { id: 'id',             propertyName: 'id',                    columnTitle: 'id',                columnWidth: 8,     locked: true },
    { id: 'name',           propertyName: 'name',                  columnTitle: 'name',              columnWidth: 16,    locked: false },
    { id: 'role',           propertyName: 'role',                  columnTitle: 'role',              columnWidth: 16,    locked: false },
    { id: 'company_name',   propertyName: 'company_name',          columnTitle: 'company_name',      columnWidth: 16,    locked: true},
    { id: 'website_url',    propertyName: 'website_url',           columnTitle: 'website_url',        columnWidth: 16,    locked: false },
    { id: 'last_sign_in',    propertyName: 'last_sign_in',           columnTitle: 'last_sign_in',        columnWidth: 16,    locked: false },
    { id: 'email',           propertyName: 'email',           columnTitle: 'email',        columnWidth: 16,    locked: false },
    { id: 'uid',           propertyName: 'uid',           columnTitle: 'uid',        columnWidth: 16,    locked: false },
    { id: 'city',               propertyName: 'city',                   columnTitle: 'city',            columnWidth: 16,    locked: false},
    { id: 'country',            propertyName: 'country',                columnTitle: 'country',         columnWidth: 16,    locked: true},
    { id: 'created_at',           propertyName: 'created_at',           columnTitle: 'created_at',        columnWidth: 16,    locked: false },
    { id: 'job_title',           propertyName: 'job_title',           columnTitle: 'job_title',        columnWidth: 16,    locked: false },
    { id: 'industry',           propertyName: 'industry',           columnTitle: 'industry',        columnWidth: 16,    locked: false }

 ]; 


 const projectUserColumns = [
    { id: 'project',             propertyName: 'project',                    columnTitle: 'project',                columnWidth: 8,     locked: true },
    { id: 'id',             propertyName: 'id',                    columnTitle: 'id',                columnWidth: 8,     locked: true },
    { id: 'name',           propertyName: 'name',                  columnTitle: 'name',              columnWidth: 16,    locked: false },
    { id: 'autodeskId',           propertyName: 'autodeskId',                  columnTitle: 'autodeskId',              columnWidth: 16,    locked: false },
    { id: 'email',           propertyName: 'email',           columnTitle: 'email',        columnWidth: 16,    locked: false },
    { id: 'jobTitle',   propertyName: 'jobTitle',          columnTitle: 'jobTitle',      columnWidth: 16,    locked: true},
    
    { id: 'industry',    propertyName: 'industry',           columnTitle: 'industry',        columnWidth: 16,    locked: false },
    { id: 'company',    propertyName: 'company',           columnTitle: 'company',        columnWidth: 16,    locked: false },

    { id: 'accessLevels_accountAdmin',    propertyName: 'accessLevels_accountAdmin',           columnTitle: 'accessLevels_accountAdmin',        columnWidth: 16,    locked: false },
    { id: 'accessLevels_projectAdmin',    propertyName: 'accessLevels_projectAdmin',           columnTitle: 'accessLevels_projectAdmin',        columnWidth: 16,    locked: false },
    { id: 'accessLevels_executive',    propertyName: 'accessLevels_executive',           columnTitle: 'accessLevels_executive',        columnWidth: 16,    locked: false },

    { id: 'services_documentManagement',           propertyName: 'services_documentManagement',           columnTitle: 'services_documentManagement',        columnWidth: 16,    locked: false },
    { id: 'services_projectAdministration',           propertyName: 'services_projectAdministration',           columnTitle: 'services_projectAdministration',        columnWidth: 16,    locked: false },

 ]; 

 const roleColumns = [
    { id: 'id',             propertyName: 'id',                    columnTitle: 'ID',              columnWidth: 8,     locked: true },
    { id: 'name',           propertyName: 'name',                  columnTitle: 'Name',           columnWidth: 16,    locked: false },
    { id: 'trade',     propertyName: 'trade',            columnTitle: 'Trade',     columnWidth: 16,    locked: false },
    { id: 'erp_id',       propertyName: 'erp_id',              columnTitle: 'Erp Id',       columnWidth: 16,    locked: true},
    { id: 'website_url',   propertyName: 'website_url',          columnTitle: 'Website Url',          columnWidth: 16,    locked: false }
 ];  
 

 const issueColumns = [
    { id: 'id',             propertyName: 'id',                    columnTitle: 'ID',              columnWidth: 8,     locked: true },
    { id: 'name',           propertyName: 'name',                  columnTitle: 'Name',           columnWidth: 16,    locked: false },
    { id: 'trade',     propertyName: 'trade',            columnTitle: 'Trade',     columnWidth: 16,    locked: false },
    { id: 'erp_id',       propertyName: 'erp_id',              columnTitle: 'Erp Id',       columnWidth: 16,    locked: true},
    { id: 'website_url',   propertyName: 'website_url',          columnTitle: 'Website Url',          columnWidth: 16,    locked: false }
 ]; 

 const rfiColumns = [
    { id: 'id',             propertyName: 'id',                    columnTitle: 'ID',              columnWidth: 8,     locked: true },
    { id: 'name',           propertyName: 'name',                  columnTitle: 'Name',           columnWidth: 16,    locked: false },
    { id: 'trade',     propertyName: 'trade',            columnTitle: 'Trade',     columnWidth: 16,    locked: false },
    { id: 'erp_id',       propertyName: 'erp_id',              columnTitle: 'Erp Id',       columnWidth: 16,    locked: true},
    { id: 'website_url',   propertyName: 'website_url',          columnTitle: 'Website Url',          columnWidth: 16,    locked: false }
 ]; 

 const checklistInsColumns = [
    { id: 'id',             propertyName: 'id',                    columnTitle: 'ID',              columnWidth: 8,     locked: true },
    { id: 'name',           propertyName: 'name',                  columnTitle: 'Name',           columnWidth: 16,    locked: false },
    { id: 'trade',     propertyName: 'trade',            columnTitle: 'Trade',     columnWidth: 16,    locked: false },
    { id: 'erp_id',       propertyName: 'erp_id',              columnTitle: 'Erp Id',       columnWidth: 16,    locked: true},
    { id: 'website_url',   propertyName: 'website_url',          columnTitle: 'Website Url',          columnWidth: 16,    locked: false }
 ]; 

 const documentColumns = [
    { id: 'id',             propertyName: 'id',                    columnTitle: 'ID',              columnWidth: 8,     locked: true },
    { id: 'name',           propertyName: 'name',                  columnTitle: 'Name',           columnWidth: 16,    locked: false },
    { id: 'trade',     propertyName: 'trade',            columnTitle: 'Trade',     columnWidth: 16,    locked: false },
    { id: 'erp_id',       propertyName: 'erp_id',              columnTitle: 'Erp Id',       columnWidth: 16,    locked: true},
    { id: 'website_url',   propertyName: 'website_url',          columnTitle: 'Website Url',          columnWidth: 16,    locked: false }
 ]; 




module.exports = { 
    projectColumns,
    companyColumns,
    accountUserColumns,
    roleColumns,
    projectUserColumns,
    issueColumns,
    rfiColumns,
    checklistInsColumns,
    documentColumns 
};
 