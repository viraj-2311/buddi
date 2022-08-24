import * as CONSTANTS from './constants';

export const setCompany = (id) => ({
  type: CONSTANTS.SET_PRODUCTION_COMPANY,
  id,
});

export const createJobRequest = (companyId, payload) => ({
  type: CONSTANTS.CREATE_JOB_REQUEST,
  companyId,
  payload,
});

export const createJobSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_SUCCESS,
  data,
});

export const createJobReset = () => ({
  type: CONSTANTS.CREATE_JOB_RESET,
});

export const createJobFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_FAIL,
  error,
});

export const deleteJobRequest = (id) => ({
  type: CONSTANTS.DELETE_JOB_REQUEST,
  id,
});

export const deleteJobSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_SUCCESS,
  payload: data,
});

export const deleteJobFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_FAIL,
  error,
});

export const deleteJobsBulkRequest = (jobIds) => ({
  type: CONSTANTS.DELETE_JOBS_BULK_REQUEST,
  payload: {
    jobs: jobIds,
  },
});

export const deleteJobsBulkSuccess = (jobIds) => ({
  type: CONSTANTS.DELETE_JOBS_BULK_SUCCESS,
  jobIds
});

export const deleteJobsBulkFail = (error) => ({
  type: CONSTANTS.DELETE_JOBS_BULK_FAIL,
  error,
});

export const fetchCompanyJobsRequest = ({ companyId, filter }) => ({
  type: CONSTANTS.FETCH_COMPANY_JOBS_REQUEST,
  companyId,
  filter,
});

export const fetchCompanyJobsSuccess = (data) => ({
  type: CONSTANTS.FETCH_COMPANY_JOBS_SUCCESS,
  payload: data,
});

export const fetchCompanyJobsFail = (error) => ({
  type: CONSTANTS.FETCH_COMPANY_JOBS_FAIL,
  payload: error,
});

export const fetchArchivedCompanyJobsRequest = ({ companyId }) => ({
  type: CONSTANTS.FETCH_ARCHIVED_COMPANY_JOBS_REQUEST,
  companyId,  
});

export const fetchJobRoleGroupsRequest = (id) => ({
  type: CONSTANTS.FETCH_JOB_ROLE_GROUPS_REQUEST,
  payload: { id },
});

export const fetchJobRoleGroupsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_ROLE_GROUPS_SUCCESS,
  payload: data,
});

export const fetchJobRoleGroupsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_ROLE_GROUPS_FAIL,
  payload: error,
});

export const fetchJobRolesRequest = (id) => ({
  type: CONSTANTS.FETCH_JOB_ROLES_REQUEST,
  payload: { id },
});

export const fetchJobRolesSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_ROLES_SUCCESS,
  payload: data,
});

export const fetchJobRolesFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_ROLES_FAIL,
  payload: error,
});

export const createJobRoleRequest = (data) => ({
  type: CONSTANTS.CREATE_JOB_ROLE_REQUEST,
  payload: data,
});

export const createJobRoleSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_ROLE_SUCCESS,
  payload: data,
});

export const createJobRoleFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_ROLE_FAIL,
  payload: error,
});

export const updateJobRoleTypeRequest = (jobRole, payload) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_TYPE_REQUEST,
  jobRole,
  payload,
});

export const updateJobRoleTypeSuccess = (jobRole, data) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_TYPE_SUCCESS,
  jobRole,
  data,
});

export const updateJobRoleTypeFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_TYPE_FAIL,
  error,
});

export const updateJobRoleGroupTypeRequest = (jobRoleGroup, payload) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_TYPE_REQUEST,
  jobRoleGroup,
  payload,
});

export const updateJobRoleGroupTypeSuccess = (jobRoleGroup, data) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_TYPE_SUCCESS,
  jobRoleGroup,
  data,
});

export const updateJobRoleGroupTypeFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_TYPE_FAIL,
  error,
});

export const createJobRoleGroupRequest = (data) => ({
  type: CONSTANTS.CREATE_JOB_ROLE_GROUP_REQUEST,
  payload: data,
});

export const createJobRoleGroupSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_ROLE_GROUP_SUCCESS,
  payload: data,
});

export const createJobRoleGroupFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_ROLE_GROUP_FAIL,
  payload: error,
});

export const updateJobRoleGroupRequest = (jobRoleGroupId, payload, cb) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_REQUEST,
  jobRoleGroupId,
  payload,
  cb
});

export const updateJobRoleGroupSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_SUCCESS,
  data,
});

export const updateJobRoleGroupFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_FAIL,
  error,
});

export const updateJobRoleGroupOrderRequest = (jobId, payload) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_ORDER_REQUEST,
  jobId,
  payload,
});

export const updateJobRoleGroupOrderSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_ORDER_SUCCESS,
  data,
});

export const updateJobRoleGroupOrderFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_ROLE_GROUP_ORDER_FAIL,
  error,
});

export const deleteJobRoleRequest = (data) => ({
  type: CONSTANTS.DELETE_JOB_ROLE_REQUEST,
  payload: data,
});

export const deleteJobRoleSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_ROLE_SUCCESS,
  payload: data,
});

export const deleteJobRoleFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_ROLE_FAIL,
  payload: error,
});

export const fetchJobDetailsRequest = (data) => ({
  type: CONSTANTS.FETCH_JOB_DETAILS_REQUEST,
  payload: data,
});

export const fetchJobDetailsSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_DETAILS_SUCCESS,
  payload: data,
});

export const fetchJobDetailsFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_DETAILS_FAIL,
  payload: error,
});

export const fetchJobMemosRequest = (id) => ({
  type: CONSTANTS.FETCH_JOB_MEMOS_REQUEST,
  payload: { id },
});

export const fetchJobMemosSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_MEMOS_SUCCESS,
  payload: data,
});

export const fetchJobMemosFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_MEMOS_FAIL,
  payload: error,
});

export const fetchArchiveJobMemosRequest = (id,status) => ({
  type: CONSTANTS.FETCH_ARCHIVE_JOB_MEMOS_REQUEST,
  payload: { id ,status},
});

export const fetchArchiveJobMemosSuccess = (data) => ({
  type: CONSTANTS.FETCH_ARCHIVE_JOB_MEMOS_SUCCESS,
  payload: data,
});

export const fetchArchiveJobMemosFail = (error) => ({
  type: CONSTANTS.FETCH_ARCHIVE_JOB_MEMOS_FAIL,
  payload: error,
});

export const setJob = (job) => ({
  type: CONSTANTS.SET_JOB,
  payload: job,
});

export const getContractorsWithMemo = (jobId) => ({
  type: CONSTANTS.GET_CONTRACTORS_WITH_MEMO_REQUEST,
  payload: { jobId },
});

export const getContractorsWithMemoSuccess = (contractors) => ({
  type: CONSTANTS.GET_CONTRACTORS_WITH_MEMO_SUCCESS,
  payload: contractors,
});

export const getContractorsWithMemoFail = (error) => ({
  type: CONSTANTS.GET_CONTRACTORS_WITH_MEMO_FAIL,
  payload: error,
});

export const getContractorsWithoutMemo = (jobId) => ({
  type: CONSTANTS.GET_CONTRACTORS_WITHOUT_MEMO_REQUEST,
  payload: { jobId },
});

export const getContractorsWithoutMemoSuccess = (contractors) => ({
  type: CONSTANTS.GET_CONTRACTORS_WITHOUT_MEMO_SUCCESS,
  payload: contractors,
});

export const getContractorsWithoutMemoFail = (error) => ({
  type: CONSTANTS.GET_CONTRACTORS_WITHOUT_MEMO_FAIL,
  payload: error,
});

export const setContractor = (data) => ({
  type: CONSTANTS.SET_CONTRACTOR,
  payload: data,
});

export const createJobMemoRequest = (job, formData) => ({
  type: CONSTANTS.CREATE_JOB_MEMO_REQUEST,
  job,
  formData,
});

export const createJobMemoSuccess = (data) => ({
  type: CONSTANTS.CREATE_JOB_MEMO_SUCCESS,
  payload: data,
});

export const createJobMemoFail = (error) => ({
  type: CONSTANTS.CREATE_JOB_MEMO_FAIL,
  error,
});

export const deleteJobMemoRequest = (memoId) => ({
  type: CONSTANTS.DELETE_JOB_MEMO_REQUEST,
  memoId,
});

export const deleteJobMemoSuccess = (data) => ({
  type: CONSTANTS.DELETE_JOB_MEMO_SUCCESS,
  data,
});

export const deleteJobMemoFail = (error) => ({
  type: CONSTANTS.DELETE_JOB_MEMO_FAIL,
  error,
});

export const cancelJobMemoRequest = (memoId) => ({
  type: CONSTANTS.CANCEL_JOB_MEMO_REQUEST,
  memoId,
});

export const cancelJobMemoSuccess = (data) => ({
  type: CONSTANTS.CANCEL_JOB_MEMO_SUCCESS,
  data,
});

export const cancelJobMemoFail = (error) => ({
  type: CONSTANTS.CANCEL_JOB_MEMO_FAIL,
  error,
});

export const updateJobMemoRequest = (id, formData) => ({
  type: CONSTANTS.UPDATE_JOB_MEMO_REQUEST,
  payload: {
    id,
    formData,
  },
});

export const updateJobMemoSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_MEMO_SUCCESS,
  payload: data,
});

export const updateJobMemoFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_MEMO_FAIL,
  error,
});

export const swapJobMemoRequest = (jobId, payload) => ({
  type: CONSTANTS.SWAP_JOB_MEMO_REQUEST,
  jobId,
  payload,
});

export const swapJobMemoSuccess = (data) => ({
  type: CONSTANTS.SWAP_JOB_MEMO_SUCCESS,
  data,
});

export const swapJobMemoFail = (error) => ({
  type: CONSTANTS.SWAP_JOB_MEMO_FAIL,
  error,
});

export const updateJobDetailsRequest = (id, data, type) => ({
  type: CONSTANTS.UPDATE_JOB_DETAILS_REQUEST,
  payload: {
    id,
    body: data,
    type,
  },
});

export const updateJobResetRequest = () => ({
  type: CONSTANTS.UPDATE_JOB_RESET_REQUEST,
});

export const updateJobDetailsSuccess = (data) => ({
  type: CONSTANTS.UPDATE_JOB_DETAILS_SUCCESS,
  data,
});

export const updateJobDetailsFail = (error) => ({
  type: CONSTANTS.UPDATE_JOB_DETAILS_FAIL,
  error,
});

export const fetchJobFullViewRequest = (id) => ({
  type: CONSTANTS.FETCH_JOB_FULLVIEW_REQUEST,
  payload: { id },
});

export const fetchJobFullViewSuccess = (data) => ({
  type: CONSTANTS.FETCH_JOB_FULLVIEW_SUCCESS,
  payload: data,
});

export const fetchJobFullViewFail = (error) => ({
  type: CONSTANTS.FETCH_JOB_FULLVIEW_FAIL,
  payload: error,
});

export const bookCrewRequest = (jobId, payload) => ({
  type: CONSTANTS.BOOK_CREW_REQUEST,
  jobId,
  payload,
});

export const bookCrewSuccess = (data) => ({
  type: CONSTANTS.BOOK_CREW_SUCCESS,
  data,
});

export const bookCrewFail = (error) => ({
  type: CONSTANTS.BOOK_CREW_FAIL,
  payload: error,
});

export const createVirtualMemoRequest = (jobId, payload) => ({
  type: CONSTANTS.CREATE_VIRTUAL_MEMO_REQUEST,
  jobId,
  payload,
});

export const createVirtualMemoSuccess = (data) => ({
  type: CONSTANTS.CREATE_VIRTUAL_MEMO_SUCCESS,
  data,
});

export const createVirtualMemoFail = (error) => ({
  type: CONSTANTS.CREATE_VIRTUAL_MEMO_FAIL,
  error,
});

export const updateVirtualMemoRequest = (virtualMemoId, payload) => ({
  type: CONSTANTS.UPDATE_VIRTUAL_MEMO_REQUEST,
  virtualMemoId,
  payload,
});

export const updateVirtualMemoSuccess = (data) => ({
  type: CONSTANTS.UPDATE_VIRTUAL_MEMO_SUCCESS,
  data,
});

export const updateVirtualMemoFail = (error) => ({
  type: CONSTANTS.UPDATE_VIRTUAL_MEMO_FAIL,
  error,
});

export const deleteVirtualMemoRequest = (virtualMemoId) => ({
  type: CONSTANTS.DELETE_VIRTUAL_MEMO_REQUEST,
  virtualMemoId,
});

export const deleteVirtualMemoSuccess = (data) => ({
  type: CONSTANTS.DELETE_VIRTUAL_MEMO_SUCCESS,
  data,
});

export const deleteVirtualMemoFail = (error) => ({
  type: CONSTANTS.DELETE_VIRTUAL_MEMO_FAIL,
  error,
});

export const showDealMemo = () => ({
  type: CONSTANTS.SHOW_DEAL_MEMO,
});

export const closeDealMemo = () => ({
  type: CONSTANTS.CLOSE_DEAL_MEMO,
});

export const showHoldMemo = () => ({
  type: CONSTANTS.SHOW_HOLD_MEMO,
});

export const closeHoldMemo = () => ({
  type: CONSTANTS.CLOSE_HOLD_MEMO,
});

export const showArchivedMemo = () => ({
  type: CONSTANTS.SHOW_ARCHIVED_MEMO,
});

export const closeArchivedMemo = () => ({
  type: CONSTANTS.CLOSE_ARCHIVED_MEMO,
});

export const setVisibleCrewConfirm = (visibility) => ({
  type: CONSTANTS.SET_VISIBLE_CREW_CONFIRM,
  visibility,
});

export const setCrewOpenDepartments = (departments) => ({
  type: CONSTANTS.SET_CREW_OPEN_DEPARTMENTS,
  departments,
});

export const setCrewActivePosition = (position) => ({
  type: CONSTANTS.SET_CREW_ACTIVE_POSITION,
  position,
});

export const fetchCrewTemplateListRequest = (jobId) => ({
  type: CONSTANTS.FETCH_CREW_TEMPLATE_LIST_REQUEST,
  jobId,
});

export const fetchCrewTemplateListSuccess = (data) => ({
  type: CONSTANTS.FETCH_CREW_TEMPLATE_LIST_SUCCESS,
  data,
});

export const fetchCrewTemplateListFail = (error) => ({
  type: CONSTANTS.FETCH_CREW_TEMPLATE_LIST_FAIL,
  error,
});

export const createCrewTemplateRequest = (jobId, payload) => ({
  type: CONSTANTS.CREATE_CREW_TEMPLATE_REQUEST,
  jobId,
  payload,
});

export const createCrewTemplateSuccess = (data) => ({
  type: CONSTANTS.CREATE_CREW_TEMPLATE_SUCCESS,
  data,
});

export const createCrewTemplateFail = (error) => ({
  type: CONSTANTS.CREATE_CREW_TEMPLATE_FAIL,
  error,
});

export const loadCrewTemplateRequest = (jobId, templateId, payload) => ({
  type: CONSTANTS.LOAD_CREW_TEMPLATE_REQUEST,
  jobId,
  templateId,
  payload,
});

export const loadCrewTemplateSuccess = (data) => ({
  type: CONSTANTS.LOAD_CREW_TEMPLATE_SUCCESS,
  data,
});

export const loadCrewTemplateFail = (error) => ({
  type: CONSTANTS.LOAD_CREW_TEMPLATE_FAIL,
  error,
});

export const archiveJobRequest = (jobId) => ({
  type: CONSTANTS.ARCHIVE_JOB_REQUEST,
  jobId,
});

export const archiveJobSuccess = (data) => ({
  type: CONSTANTS.ARCHIVE_JOB_SUCCESS,
  data,
});

export const archiveJobFail = (error) => ({
  type: CONSTANTS.ARCHIVE_JOB_FAIL,
  error,
});

export const deleteContractorAttachmentRequest = (jobId, jobMemoId, attachmentId) => ({
  type: CONSTANTS.DELETE_CONTRACTOR_ATTACHMENT_REQUEST,
  jobId,
  jobMemoId,
  attachmentId
});

export const deleteContractorAttachmentSuccess = () => ({
  type: CONSTANTS.DELETE_CONTRACTOR_ATTACHMENT_SUCCESS,
});

export const deleteContractorAttachmentFailure = (error) => ({
  type: CONSTANTS.DELETE_CONTRACTOR_ATTACHMENT_FAIL,
  error
});

export const reinstateJobDetailsRequest = (id, data) => ({
  type: CONSTANTS.REINSTATE_JOB_DETAILS_REQUEST,
  payload: {
    id,
    body: data,    
  },
});

export const reinstateJobDetailsSuccess = (data) => ({
  type: CONSTANTS.REINSTATE_JOB_DETAILS_SUCCESS,
  data,
});

export const reinstateJobDetailsFail = (error) => ({
  type: CONSTANTS.REINSTATE_JOB_DETAILS_FAIL,
  error,
});

export const deleteBookMemoRequest = (payload) => ({
  type: CONSTANTS.DELETE_BOOK_MEMO_REQUEST,
  payload,
});

export const deleteBookMemoSuccess = (payload) => ({
  type: CONSTANTS.DELETE_BOOK_MEMO_SUCCESS,
  payload,
});

export const deleteBookMemoFail = (payload) => ({
  type: CONSTANTS.DELETE_BOOK_MEMO_FAIL,
  payload,
});
