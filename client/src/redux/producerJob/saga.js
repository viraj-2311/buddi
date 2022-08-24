import { put, takeLatest, takeEvery, call } from 'redux-saga/effects';
import cloneDeep from 'lodash/cloneDeep';
import { serializeKeys, deserializeKeys } from '@iso/lib/helpers/keyNormalizer';
import request from '@iso/lib/helpers/httpClient';
import * as CONSTANTS from './constants';
import * as ACTIONS from './actions';
import notify from '@iso/lib/helpers/notify';
import { showServerError } from '@iso/lib/helpers/utility';

function* createJob(action) {
  try {
    const { companyId, payload } = action;
    const data = yield call(request, `/company/${companyId}/job/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createJobSuccess(serializeKeys(data)));
    yield put(ACTIONS.createJobReset());
  } catch (error) {
    yield put(ACTIONS.createJobFail(error));
    yield put(ACTIONS.createJobReset());
  }
}

function* deleteJob({ id }) {
  try {
    yield call(request, `/job/${id}/`, 'DELETE');
    yield put(ACTIONS.deleteJobSuccess({ id: id }));
  } catch (error) {
    yield put(ACTIONS.deleteJobFail(error));
  }
}

function* deleteJobsBulk({ payload }) {
  try {
    yield call(request, `/job/bulk_delete/`, 'DELETE', payload);
    yield put(ACTIONS.deleteJobsBulkSuccess(payload.jobs));
  } catch (error) {
    yield put(ACTIONS.deleteJobsBulkFail(error));
  }
}

function* fetchJobs({ companyId, filter }) {
  try {
    const data = yield call(request, `/company/${companyId}/job/`, 'GET', filter);
    yield put(ACTIONS.fetchCompanyJobsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyJobsFail(error));
  }
}

function* fetchArchiveJobs({ companyId }) {
  try {
    const data = yield call(request, `/company/${companyId}/job/archive/`, 'GET');
    yield put(ACTIONS.fetchCompanyJobsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCompanyJobsFail(error));
  }
}

function* fetchJobRoleGroups(action) {
  try {
    const {
      payload: { id },
    } = action;
    const data = yield call(request, `/job/${id}/job_role_groups/`, 'GET');
    yield put(ACTIONS.fetchJobRoleGroupsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobRoleGroupsFail(error));
  }
}

function* fetchJobRoles(action) {
  try {
    const {
      payload: { id },
    } = action;
    const data = yield call(request, `/job_role_group/${id}/job_roles/`, 'GET');
    yield put(ACTIONS.fetchJobRolesSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobRolesFail(error));
  }
}

function* createJobRole(action) {
  try {
    const { title, description, companyId, job, jobRoleGroup } = action.payload;
    const jobRoleType = yield call(
      request,
      '/job_role_type/',
      'POST',
      deserializeKeys({
        title,
        description,
        companyId,
        job
      })
    );
    const data = yield call(
      request,
      '/job_role/',
      'POST',
      deserializeKeys({
        jobRoleType: jobRoleType.id,
        jobRoleGroup,
      })
    );
    yield put(
      ACTIONS.createJobRoleSuccess(
        serializeKeys({
          ...data,
          title,
          description,
        })
      )
    );
  } catch (error) {
    yield put(ACTIONS.createJobRoleFail(error));
  }
}

function* updateJobRoleType(action) {
  try {
    const { jobRole, payload } = action;
    const data = yield call(request, `/job_role_type/${jobRole.jobRoleType.id}/`, 'PATCH', deserializeKeys(payload));
    yield put(ACTIONS.updateJobRoleTypeSuccess(jobRole, serializeKeys(data)));
  } catch (error) {
    notify('error', showServerError(error));
    yield put(ACTIONS.updateJobRoleTypeFail(error));
  }
}

function* deleteJobRole(action) {
  try {
    yield call(request, `/job_role/${action.payload.id}/`, 'DELETE');
    yield put(
      ACTIONS.deleteJobRoleSuccess({
        id: action.payload.id,
        jobRoleGroupId: action.payload.jobRoleGroupId,
      })
    );
  } catch (error) {
    notify('error', showServerError(error));
    yield put(ACTIONS.deleteJobRoleFail(error));
  }
}

function* updateJobRoleGroupType(action) {
  try {
    const { jobRoleGroup, payload } = action;
    const data = yield call(request, `/job_role_group_type/${jobRoleGroup.jobRoleGroupType.id}/`, 'PATCH', deserializeKeys(payload));
    yield put(ACTIONS.updateJobRoleGroupTypeSuccess(jobRoleGroup, serializeKeys(data)));
  } catch (error) {
    notify('error', showServerError(error));
    yield put(ACTIONS.updateJobRoleGroupTypeFail(error));
  }
}

function* updateJobRoleGroupOrder({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/job_role_group/dnd/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.updateJobRoleGroupOrderSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobRoleGroupOrderFail(error));
  }
}

function* createJobRoleGroup(action) {
  try {
    const { title, description, job, companyId } = action.payload;
    const jobRoleGroupType = yield call(
      request,
      '/job_role_group_type/',
      'POST',
      deserializeKeys({
        title,
        description,
        companyId,
        job
      })
    );

    const data = yield call(
      request,
      '/job_role_group/',
      'POST',
      deserializeKeys({
        jobRoleGroupType: jobRoleGroupType.id,
        job,
      })
    );
    yield put(
      ACTIONS.createJobRoleGroupSuccess(
        serializeKeys({
          ...data,
          title,
          description,
        })
      )
    );
  } catch (error) {
    yield put(ACTIONS.createJobRoleGroupFail(error));
  }
}

function* updateJobRoleGroup({ jobRoleGroupId, payload, cb }) {
  try {
    const data = yield call(request, `/job_role_group/${jobRoleGroupId}/`, 'PATCH', deserializeKeys(payload), true);
    yield put(ACTIONS.updateJobRoleGroupSuccess(serializeKeys(data)));
    cb(false);
  } catch (error) {
    cb(true);
    notify('error', showServerError(error));
    yield put(ACTIONS.updateJobRoleGroupFail(error));
  }
}

function* fetchJobDetails(action) {
  try {
    const data = yield call(request, `/job/${action.payload.id}/`, 'GET');
    yield put(ACTIONS.fetchJobDetailsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobDetailsFail(error));
  }
}

function* fetchContractorWithMemo(action) {
  try {
    const {
      payload: { jobId },
    } = action;
    const data = yield call(request, `/job/${jobId}/contractors/MEMO/`, 'GET');
    yield put(ACTIONS.getContractorsWithMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getContractorsWithMemoFail(error));
  }
}

function* fetchContractorWithoutMemo(action) {
  try {
    const {
      payload: { jobId },
    } = action;
    const data = yield call(
      request,
      `/job/${jobId}/contractors/NO_MEMO/`,
      'GET'
    );
    yield put(ACTIONS.getContractorsWithoutMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.getContractorsWithoutMemoFail(error));
  }
}

function* fetchJobMemos(action) {
  try {
    const data = yield call(
      request,
      `/job/${action.payload.id}/job_memos/`,
      'GET'
    );
    yield put(ACTIONS.fetchJobMemosSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobMemosFail(error));
  }
}
function* fetchArchivedJobMemos(action) {
  try {
    let data = null;
    if(action.payload.status == 'WRAPPED'){
      data = yield call(
        request,
        `/job/${action.payload.id}/contractor_invoices/`,
        'GET',
        null,
        true
      );
      const {invoice_memos = []} = data;
      data = invoice_memos.map((i)=>i.job_memo) || [];
    }else{
      data = yield call(
        request,
        `/job/${action.payload.id}/job_memos/`,
        'GET'
      );
    }
    yield put(ACTIONS.fetchArchiveJobMemosSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchArchiveJobMemosFail(error));
  }
}
function* createJobMemo(action) {
  try {
    const { job, formData } = action;

    const body = cloneDeep(formData);
    const data = yield call(
      request,
      `/job/${job.id}/job_memo/`,
      'POST',
      deserializeKeys(body)
    );
    yield put(ACTIONS.createJobMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createJobMemoFail(error));
  }
}

function* deleteJobMemo({ memoId }) {
  try {
    const data = yield call(
      request,
      `/job_memo/${memoId}/`,
      'DELETE'
    );
    yield put(ACTIONS.deleteJobMemoSuccess(memoId));
  } catch (error) {
    yield put(ACTIONS.deleteJobMemoFail(error));
  }
}

function* cancelJobMemo({ memoId }) {
  try {
    const data = yield call(
      request,
      `/job_memo/${memoId}/cancel/`,
      'POST'
    );
    yield put(ACTIONS.cancelJobMemoSuccess(memoId));
  } catch (error) {
    yield put(ACTIONS.cancelJobMemoFail(error));
  }
}

function* updateJobMemo({ payload }) {
  try {
    const { id, formData } = payload;

    const body = cloneDeep(formData);
    const data = yield call(
      request,
      `/job_memo/${id}/`,
      'PATCH',
      deserializeKeys(body)
    );
    yield put(ACTIONS.updateJobMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobMemoFail(error));
  }
}

function* swapJobMemo({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/replace_memo/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.swapJobMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.swapJobMemoFail(error));
  }
}

function* updateJobDetails({ payload }) {
  try {
    const body = cloneDeep(payload.body);
    const data = yield call(
      request,
      `/job/${payload.id}/`,
      'PATCH',
      deserializeKeys(body)
    );
    yield put(ACTIONS.updateJobDetailsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateJobDetailsFail(error));
  }
}

function* reinstateJobDetails({ payload }) {
  try {
    const body = cloneDeep(payload.body);
    const data = yield call(
      request,
      `/company/${payload.id}/job/reinstate/`,
      'POST',
      deserializeKeys(body)
    );
    yield put(ACTIONS.reinstateJobDetailsSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.reinstateJobDetailsFail(error));
  }
}

function* fetchJobFullView({ payload }) {
  try {
    const { id } = payload;
    const data = yield call(request, `/job/${id}/full_view/`, 'GET');
    yield put(ACTIONS.fetchJobFullViewSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchJobFullViewFail(error));
  }
}

function* bookCrew({ jobId, payload }) {
  try {
    const data = yield call(request, `/book_crew/${jobId}/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.bookCrewSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.bookCrewFail(error));
  }
}

function* createVirtualMemo({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/virtual_memo/`, 'POST', deserializeKeys(payload));
    yield put(ACTIONS.createVirtualMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createVirtualMemoFail(error));
  }
}

function* updateVirtualMemo({ virtualMemoId, payload }) {
  try {
    const data = yield call(request, `/virtual_memo/${virtualMemoId}/`, 'PATCH', deserializeKeys(payload));
    yield put(ACTIONS.updateVirtualMemoSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.updateVirtualMemoFail(error));
  }
}

function* deleteVirtualMemo({ virtualMemoId }) {
  try {
    const data = yield call(request, `/virtual_memo/${virtualMemoId}/`, 'DELETE');
    yield put(ACTIONS.deleteVirtualMemoSuccess(virtualMemoId));
  } catch (error) {
    yield put(ACTIONS.deleteVirtualMemoFail(error));
  }
}

function* fetchCrewTemplateList({ jobId }) {
  try {
    const data = yield call(request, `/job/${jobId}/crew_templates/`, 'GET', null, true);
    yield put(ACTIONS.fetchCrewTemplateListSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.fetchCrewTemplateListFail(error));
  }
}

function* createCrewTemplate({ jobId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/save_crew_template/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.createCrewTemplateSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.createCrewTemplateFail(error));
  }
}

function* loadCrewTemplate({ jobId, templateId, payload }) {
  try {
    const data = yield call(request, `/job/${jobId}/crew_template/${templateId}/`, 'POST', deserializeKeys(payload), true);
    yield put(ACTIONS.loadCrewTemplateSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.loadCrewTemplateFail(error));
  }
}

function* archiveJob({ jobId }) {
  try {
    const data = yield call(
      request,
      `/job/${jobId}/archive_job/`,
      'POST',
      deserializeKeys({})
    );
    yield put(ACTIONS.archiveJobSuccess(serializeKeys(data)));
  } catch (error) {
    yield put(ACTIONS.archiveJobFail(error));
  }
}

function* deleteContractorAttachment({ jobId, jobMemoId, attachmentId }) {
  try {
    yield call(
        request,
        `/job/${jobId}/job_memos/${jobMemoId}/attachments/${attachmentId}/`,
        'DELETE'
    );
    yield put(ACTIONS.deleteContractorAttachmentSuccess());
  } catch (error) {
    yield put(ACTIONS.deleteContractorAttachmentFailure(error));
  }
}

function* deleteBookMemo({ payload }) {
  try {
    yield call(
      request,
      `/job_memo/${payload.bookMemoId}/delete_booked_memo/`,
      'DELETE'
    );
    yield put(ACTIONS.deleteBookMemoSuccess(payload.bookMemoId));
  } catch (error) {
    yield put(ACTIONS.deleteBookMemoFail(error));
  }
}

export default function* producerJobSaga() {
  yield takeLatest(CONSTANTS.FETCH_COMPANY_JOBS_REQUEST, fetchJobs);
  yield takeLatest(CONSTANTS.FETCH_ARCHIVED_COMPANY_JOBS_REQUEST, fetchArchiveJobs);
  yield takeLatest(CONSTANTS.FETCH_JOB_ROLE_GROUPS_REQUEST, fetchJobRoleGroups);
  yield takeLatest(CONSTANTS.FETCH_JOB_ROLES_REQUEST, fetchJobRoles);
  yield takeLatest(CONSTANTS.CREATE_JOB_REQUEST, createJob);
  yield takeLatest(CONSTANTS.DELETE_JOB_REQUEST, deleteJob);
  yield takeLatest(CONSTANTS.DELETE_JOBS_BULK_REQUEST, deleteJobsBulk);
  yield takeLatest(CONSTANTS.CREATE_JOB_ROLE_REQUEST, createJobRole);
  yield takeLatest(CONSTANTS.UPDATE_JOB_ROLE_TYPE_REQUEST, updateJobRoleType);
  yield takeLatest(CONSTANTS.DELETE_JOB_ROLE_REQUEST, deleteJobRole);
  yield takeLatest(CONSTANTS.CREATE_JOB_ROLE_GROUP_REQUEST, createJobRoleGroup);
  yield takeLatest(CONSTANTS.UPDATE_JOB_ROLE_GROUP_REQUEST, updateJobRoleGroup);
  yield takeLatest(CONSTANTS.UPDATE_JOB_ROLE_GROUP_TYPE_REQUEST, updateJobRoleGroupType);
  yield takeLatest(CONSTANTS.UPDATE_JOB_ROLE_GROUP_ORDER_REQUEST, updateJobRoleGroupOrder);
  yield takeLatest(CONSTANTS.FETCH_JOB_DETAILS_REQUEST, fetchJobDetails);
  yield takeLatest(CONSTANTS.GET_CONTRACTORS_WITH_MEMO_REQUEST, fetchContractorWithMemo);
  yield takeLatest(CONSTANTS.GET_CONTRACTORS_WITHOUT_MEMO_REQUEST, fetchContractorWithoutMemo);
  yield takeLatest(CONSTANTS.FETCH_JOB_MEMOS_REQUEST, fetchJobMemos);
  yield takeLatest(CONSTANTS.FETCH_ARCHIVE_JOB_MEMOS_REQUEST, fetchArchivedJobMemos);
  yield takeLatest(CONSTANTS.CREATE_JOB_MEMO_REQUEST, createJobMemo);
  yield takeLatest(CONSTANTS.DELETE_JOB_MEMO_REQUEST, deleteJobMemo);
  yield takeLatest(CONSTANTS.CANCEL_JOB_MEMO_REQUEST, cancelJobMemo);
  yield takeLatest(CONSTANTS.UPDATE_JOB_MEMO_REQUEST, updateJobMemo);
  yield takeLatest(CONSTANTS.SWAP_JOB_MEMO_REQUEST, swapJobMemo);
  yield takeLatest(CONSTANTS.UPDATE_JOB_DETAILS_REQUEST, updateJobDetails);
  yield takeLatest(CONSTANTS.FETCH_JOB_FULLVIEW_REQUEST, fetchJobFullView);
  yield takeLatest(CONSTANTS.BOOK_CREW_REQUEST, bookCrew);
  yield takeLatest(CONSTANTS.CREATE_VIRTUAL_MEMO_REQUEST, createVirtualMemo);
  yield takeLatest(CONSTANTS.UPDATE_VIRTUAL_MEMO_REQUEST, updateVirtualMemo);
  yield takeLatest(CONSTANTS.DELETE_VIRTUAL_MEMO_REQUEST, deleteVirtualMemo);
  yield takeLatest(CONSTANTS.FETCH_CREW_TEMPLATE_LIST_REQUEST, fetchCrewTemplateList);
  yield takeLatest(CONSTANTS.CREATE_CREW_TEMPLATE_REQUEST, createCrewTemplate);
  yield takeEvery(CONSTANTS.LOAD_CREW_TEMPLATE_REQUEST, loadCrewTemplate);
  yield takeLatest(CONSTANTS.ARCHIVE_JOB_REQUEST, archiveJob);
  yield takeLatest(CONSTANTS.DELETE_CONTRACTOR_ATTACHMENT_REQUEST, deleteContractorAttachment);
  yield takeLatest(CONSTANTS.REINSTATE_JOB_DETAILS_REQUEST, reinstateJobDetails);
  yield takeLatest(CONSTANTS.DELETE_BOOK_MEMO_REQUEST, deleteBookMemo);
}
