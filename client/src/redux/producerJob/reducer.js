import produce from 'immer';
import * as CONSTANTS from './constants';

/**
  @CAUTION need to sepaprate the loading state unless it might cause infinite loop
 */

const initialState = {
  error: null,
  loading: false,
  companyId: null,
  jobs: [],
  job: null,
  jobRoleGroups: [],
  jobRoles: [],
  jobFullView: null,
  contractorsWithMemo: [],
  contractorsWithoutMemo: [],
  jobMemos: [],
  visibleDealMemo: false,
  visibleHoldMemo: false,
  visibleArchivedMemo: false,
  contractor: null,
  crewUsers: [],
  crewTemplates: [],
  visibleCrewConfirm: true,
  crewOpenDepartments: [],
  crewActivePosition: null,
  jobRoleCreate: {
    loading: false,
    error: null,
  },
  jobRoleTypeUpdate: {
    loading: false,
    error: null,
  },
  jobRoleGroupCreate: {
    loading: false,
    error: null,
  },
  jobRoleGroupTypeUpdate: {
    loading: false,
    error: null,
  },
  jobRoleGroupOrderUpdate: {
    loading: false,
    error: null,
  },
  jobRoleGroupList: {
    loading: false,
    error: null,
  },
  create: {
    loading: false,
    error: null,
  },
  update: {
    loading: false,
    error: null,
    type: null,
  },
  reinstate: {
    loading: false,
    error: null,
  },
  delete: {
    loading: false,
    error: null,
  },
  deleteBulk: {
    loading: false,
    error: null,
    success: false,
  },
  memoCreate: {
    loading: false,
    error: null,
    createdMemo: null,
  },
  memoUpdate: {
    loading: false,
    error: null,
    updatedMemo: null,
  },
  memoList: {
    loading: false,
    error: null,
  },
  memoDelete: {
    loading: false,
    error: null,
  },
  memoCancel: {
    loading: false,
    error: null,
  },
  list: {
    loading: true,
    error: null,
  },
  detail: {
    loading: false,
    error: null,
  },
  fetchFullView: {
    loading: false,
    error: null,
  },
  bookCrew: {
    loading: false,
    error: null,
    booked: false,
  },
  contractorList: {
    loading: false,
    error: null,
  },
  virtualMemoCreate: {
    loading: false,
    error: null,
  },
  virtualMemoUpdate: {
    loading: false,
    error: null,
  },
  virtualMemoDelete: {
    loading: false,
    error: null,
  },
  fetchTemplateList: {
    loading: false,
    error: null,
  },
  createTemplate: {
    loading: false,
    error: null,
  },
  loadTemplate: {
    loading: false,
    error: null,
  },
  archiveJob: {
    loading: false,
    error: null,
    id: null,
  },
  contractorAttachmentDeleted: {
    loading: false,
    success: false,
    error: null,
    attachmentId: null,
  }
};

const producerJobReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.SET_PRODUCTION_COMPANY:
        draft.companyId = action.id;
        break;
      case CONSTANTS.FETCH_JOB_ROLES_REQUEST:

      case CONSTANTS.CREATE_JOB_REQUEST:
        draft.create = { loading: true, error: null };
        break;
      case CONSTANTS.CREATE_JOB_SUCCESS:
        draft.job = action.data;
        draft.jobs = [...draft.jobs, action.data];
        draft.create = { loading: false, error: null };
        break;
      case CONSTANTS.CREATE_JOB_FAIL:
        draft.create = { loading: false, error: action.error };
        break;
      case CONSTANTS.CREATE_JOB_RESET:
        draft.create = { loading: false, error: action.error };
        draft.job = null
        break;

      case CONSTANTS.DELETE_JOB_REQUEST:
        draft.delete = { loading: true, error: null };
        break;
      case CONSTANTS.DELETE_JOB_SUCCESS:
        const { payload } = action;
        draft.jobs = draft.jobs.filter((job) => {
          return job.id !== payload.id;
        });
        draft.delete = { loading: false, error: null };
        break;
      case CONSTANTS.DELETE_JOB_FAIL:
        draft.delete = { loading: false, error: action.payload };
        break;

      case CONSTANTS.DELETE_JOBS_BULK_REQUEST:
        draft.deleteBulk = { loading: true, success: false, error: null };
        break;
      case CONSTANTS.DELETE_JOBS_BULK_SUCCESS:
        draft.jobs = draft.jobs.filter((job) => {
          return false === action.jobIds.includes(job.id);
        });
        draft.deleteBulk = { loading: false, success: true, error: null };
        break;
      case CONSTANTS.DELETE_JOBS_BULK_FAIL:
        draft.deleteBulk = {
          loading: false,
          success: false,
          error: action.error,
        };
        break;
      case CONSTANTS.FETCH_ARCHIVED_COMPANY_JOBS_REQUEST:
        draft.jobs = [];
        draft.list = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_JOBS_REQUEST:
        draft.jobs = [];
        draft.list = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_JOBS_SUCCESS:
        draft.jobs = action.payload;
        draft.list = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_JOBS_FAIL:
        draft.list = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_JOB_ROLE_GROUPS_REQUEST:
        draft.jobRoleGroupList = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_JOB_ROLE_GROUPS_SUCCESS:
        draft.jobRoleGroups = action.payload;
        draft.jobRoleGroupList = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_JOB_ROLE_GROUPS_FAIL:
        draft.jobRoleGroupList = { loading: false, error: action.payload };
        break;

      case CONSTANTS.FETCH_JOB_ROLES_SUCCESS:
        draft.jobRoles = action.payload;
        draft.loading = false;
        break;
      case CONSTANTS.FETCH_JOB_ROLES_FAIL:
        draft.loading = false;
        break;

      case CONSTANTS.CREATE_JOB_ROLE_REQUEST:
        draft.jobRoleCreate.loading = true;
        draft.jobRoleCreate.error = null;
        break;
      case CONSTANTS.CREATE_JOB_ROLE_SUCCESS: {
        const { payload } = action;
        const index = draft.jobRoleGroups.findIndex(
          (group) => group.id === payload.jobRoleGroup
        );
        if (index < 0) break;

        draft.jobRoleGroups[index].jobRolesList.push({
          id: payload.id,
          jobRoleGroup: payload.jobRoleGroup,
          jobRoleType: {
            id: payload.jobRoleType,
            title: payload.title,
            description: payload.description,
          },
        });
        draft.jobRoleCreate.loading = false;
        draft.jobRoleCreate.error = null;
        break;
      }
      case CONSTANTS.CREATE_JOB_ROLE_FAIL:
        draft.jobRoleCreate.error = action.payload;
        draft.jobRoleCreate.loading = false;
        break;

      case CONSTANTS.CREATE_VIRTUAL_MEMO_REQUEST:
        draft.virtualMemoCreate = { loading: true, error: null };
        break;
      case CONSTANTS.CREATE_VIRTUAL_MEMO_SUCCESS:
        draft.jobMemos = [...draft.jobMemos, action.data];
        draft.virtualMemoCreate = { loading: false, error: null };
        break;
      case CONSTANTS.CREATE_VIRTUAL_MEMO_FAIL:
        draft.virtualMemoCreate = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_VIRTUAL_MEMO_REQUEST:
        draft.virtualMemoUpdate = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_VIRTUAL_MEMO_SUCCESS:
        draft.jobMemos = draft.jobMemos.map((jobMemo) =>
          jobMemo.id === action.data.id && jobMemo.isMemo === false
            ? action.data
            : jobMemo
        );
        draft.virtualMemoUpdate = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_VIRTUAL_MEMO_FAIL:
        draft.virtualMemoUpdate = { loading: false, error: action.error };
        break;

      case CONSTANTS.DELETE_VIRTUAL_MEMO_REQUEST:
        draft.virtualMemoDelete = { loading: true, error: null };
        break;
      case CONSTANTS.DELETE_VIRTUAL_MEMO_SUCCESS:
        draft.jobMemos = draft.jobMemos.filter(
          (jobMemo) => !(jobMemo.id === action.data && jobMemo.isMemo === false)
        );
        draft.virtualMemoDelete = { loading: false, error: null };
        break;
      case CONSTANTS.DELETE_VIRTUAL_MEMO_FAIL:
        draft.virtualMemoDelete = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_JOB_ROLE_TYPE_REQUEST:
        draft.jobRoleTypeUpdate = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_JOB_ROLE_TYPE_SUCCESS: {
        const { jobRole, data } = action;
        const index = draft.jobRoleGroups.findIndex(
          (group) => group.id === jobRole.jobRoleGroup
        );
        if (index < 0) break;

        draft.jobRoleGroups[index].jobRolesList = draft.jobRoleGroups[
          index
        ].jobRolesList.map((role) =>
          role.id === jobRole.id ? { ...role, jobRoleType: data } : role
        );
        draft.jobRoleTypeUpdate = { loading: false, error: null };
        break;
      }
      case CONSTANTS.UPDATE_JOB_ROLE_TYPE_FAIL:
        draft.jobRoleTypeUpdate = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_ORDER_REQUEST:
        draft.jobRoleGroupOrderUpdate = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_ORDER_SUCCESS:
        draft.jobRoleGroups = action.data;
        draft.jobRoleGroupOrderUpdate = { loading: false, error: null };
        break;
      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_ORDER_FAIL:
        draft.jobRoleGroupOrderUpdate = { loading: false, error: action.error };
        break;

      case CONSTANTS.DELETE_JOB_ROLE_SUCCESS: {
        const { payload } = action;
        const index = draft.jobRoleGroups.findIndex(
          (group) => group.id === payload.jobRoleGroupId
        );
        if (index < 0) break;

        const jobRoleIndex = draft.jobRoleGroups[index].jobRolesList.findIndex(
          (role) => role.id === payload.id
        );
        if (jobRoleIndex < 0) break;

        draft.jobRoleGroups[index].jobRolesList.splice(jobRoleIndex, 1);
        draft.loading = false;
        break;
      }
      case CONSTANTS.DELETE_JOB_ROLE_FAIL:
        draft.loading = false;
        break;

      case CONSTANTS.CREATE_JOB_ROLE_GROUP_REQUEST:
        draft.jobRoleGroupCreate.loading = true;
        draft.jobRoleGroupCreate.error = null;
        break;
      case CONSTANTS.CREATE_JOB_ROLE_GROUP_SUCCESS: {
        const { payload } = action;

        draft.jobRoleGroups.push({
          id: payload.id,
          jobRoleGroupType: {
            title: payload.title,
            description: payload.description,
          },
          jobRolesList: [],
          selected: true,
        });
        draft.jobRoleGroupCreate.loading = false;
        draft.jobRoleGroupCreate.error = null;
        break;
      }
      case CONSTANTS.CREATE_JOB_ROLE_GROUP_FAIL:
        draft.jobRoleGroupCreate.loading = false;
        draft.jobRoleGroupCreate.error = action.payload;
        break;

      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_REQUEST:
        draft.jobRoleGroupUpdate = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_SUCCESS:
        draft.jobRoleGroups = draft.jobRoleGroups.map((jobRoleGroup) =>
          jobRoleGroup.id === action.data.id ? action.data : jobRoleGroup
        );
        break;
      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_FAIL:
        draft.jobRoleGroupUpdate = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_TYPE_REQUEST:
        draft.jobRoleGroupTypeUpdate = { loading: true, error: null };
        break;
      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_TYPE_SUCCESS: {
        const { jobRoleGroup, data } = action;
        draft.jobRoleGroups = draft.jobRoleGroups.map((group) =>
          group.id === jobRoleGroup.id
            ? { ...group, jobRoleGroupType: data }
            : group
        );
        draft.jobRoleGroupTypeUpdate = { loading: false, error: null };
        break;
      }
      case CONSTANTS.UPDATE_JOB_ROLE_GROUP_TYPE_FAIL:
        draft.jobRoleGroupTypeUpdate = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_JOB_DETAILS_REQUEST:
        draft.detail = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_JOB_DETAILS_SUCCESS:
        draft.job = action.payload;
        draft.detail = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_JOB_DETAILS_FAIL:
        draft.job = null;
        draft.detail = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_JOB_MEMOS_REQUEST:
        draft.memoList = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_JOB_MEMOS_SUCCESS:
        draft.jobMemos = action.payload;
        draft.memoList = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_JOB_MEMOS_FAIL:
        draft.memoList = { loading: false, error: action.payload };
        break;
      case CONSTANTS.FETCH_ARCHIVE_JOB_MEMOS_REQUEST:
        draft.memoList = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_ARCHIVE_JOB_MEMOS_SUCCESS:
        draft.jobMemos = action.payload;
        draft.memoList = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_ARCHIVE_JOB_MEMOS_FAIL:
        draft.memoList = { loading: false, error: action.payload };
        break;

      case CONSTANTS.SET_JOB:
        draft.job = action.payload;
        break;

      case CONSTANTS.GET_CONTRACTORS_WITH_MEMO_REQUEST:
        draft.contractorList = { loading: true, error: null };
        break;
      case CONSTANTS.GET_CONTRACTORS_WITH_MEMO_SUCCESS:
        draft.contractorsWithMemo = action.payload;
        draft.contractorList = { loading: false, error: null };
        break;
      case CONSTANTS.GET_CONTRACTORS_WITH_MEMO_FAIL:
        draft.contractorList = { loading: false, error: action.payload };
        break;

      case CONSTANTS.GET_CONTRACTORS_WITHOUT_MEMO_REQUEST:
        draft.contractorList = { loading: true, error: null };
        break;
      case CONSTANTS.GET_CONTRACTORS_WITHOUT_MEMO_SUCCESS:
        draft.contractorsWithoutMemo = action.payload;
        draft.crewUsers = action.payload;
        draft.contractorList = { loading: false, error: null };
        break;
      case CONSTANTS.GET_CONTRACTORS_WITHOUT_MEMO_FAIL:
        draft.contractorList = { loading: false, error: action.payload };
        break;

      case CONSTANTS.SET_CONTRACTOR:
        draft.contractor = action.payload;
        break;

      case CONSTANTS.CREATE_JOB_MEMO_REQUEST:
        draft.memoCreate.createdMemo = null;
        draft.memoCreate.loading = true;
        draft.memoCreate.error = null;
        break;
      case CONSTANTS.CREATE_JOB_MEMO_SUCCESS:
        // draft.jobMemos.push(action.payload);
        draft.jobMemos.push(action.payload);
        draft.memoCreate.createdMemo = action.payload;
        // draft.memoCreate.createdMemo = null;
        draft.memoCreate.loading = false;
        draft.memoCreate.error = null;
        break;
      case CONSTANTS.CREATE_JOB_MEMO_FAIL:
        draft.memoCreate.createdMemo = null;
        draft.memoCreate.error = action.error;
        draft.memoCreate.loading = false;
        break;

      case CONSTANTS.DELETE_JOB_MEMO_REQUEST:
        draft.memoDelete = { loading: true, error: null };
        break;
      case CONSTANTS.DELETE_JOB_MEMO_SUCCESS:
        draft.memoDelete = { loading: false, error: null };
        draft.jobMemos = draft.jobMemos.filter(
          (memo) => !(memo.id === action.data && memo.isMemo === true)
        );
        break;
      case CONSTANTS.DELETE_JOB_MEMO_FAIL:
        draft.memoDelete = { loading: false, error: action.error };
        break;
        case CONSTANTS.DELETE_BOOK_MEMO_REQUEST:
        draft.memoDelete = { loading: true, error: null };
        break;
      case CONSTANTS.DELETE_BOOK_MEMO_SUCCESS:
        draft.memoDelete = { loading: false, error: null };
        draft.jobMemos = draft.jobMemos.filter(
          (memo) => !(memo.id === action.payload && memo.isMemo === true)
        );
        break;
      case CONSTANTS.DELETE_BOOK_MEMO_FAIL:
        draft.memoDelete = { loading: false, error: action.error };
        break;

      case CONSTANTS.CANCEL_JOB_MEMO_REQUEST:
        draft.memoCancel = { loading: true, error: null };
        break;
      case CONSTANTS.CANCEL_JOB_MEMO_SUCCESS:
        draft.memoCancel = { loading: false, error: null };
        draft.jobMemos = draft.jobMemos.filter(
          (memo) => !(memo.id === action.data && memo.isMemo === true)
        );
        break;
      case CONSTANTS.CANCEL_JOB_MEMO_FAIL:
        draft.memoCancel = { loading: false, error: action.error };
        break;

      case CONSTANTS.UPDATE_JOB_MEMO_REQUEST:
        draft.memoUpdate.updatedMemo = null;
        draft.memoUpdate.loading = true;
        draft.memoUpdate.error = null;
        break;
      case CONSTANTS.UPDATE_JOB_MEMO_SUCCESS:
        draft.jobMemos = draft.jobMemos.map((jobMemo) => {
          return jobMemo.id === action.payload.id && jobMemo.isMemo === true
            ? { ...jobMemo, ...action.payload }
            : jobMemo;
        });
        draft.memoUpdate.updatedMemo = action.payload;
        draft.memoUpdate.loading = false;
        draft.memoUpdate.error = null;
        break;
      case CONSTANTS.UPDATE_JOB_MEMO_FAIL:
        draft.memoUpdate.updatedMemo = null;
        draft.memoUpdate.loading = false;
        draft.memoUpdate.error = action.error;
        break;
      case CONSTANTS.SWAP_JOB_MEMO_SUCCESS:
        const { from, to } = action.data;

        if (from && from.id) {
          const fromIndex = draft.jobMemos.findIndex(
            (jobMemo) =>
              jobMemo.id === from.id && jobMemo.isMemo === from.isMemo
          );
          draft.jobMemos[fromIndex].choiceLevel = from.choiceLevel;
        }

        if (to && to.id) {
          const toIndex = draft.jobMemos.findIndex(
            (jobMemo) => jobMemo.id === to.id && jobMemo.isMemo === to.isMemo
          );
          draft.jobMemos[toIndex].choiceLevel = to.choiceLevel;
        }
        break;

      case CONSTANTS.UPDATE_JOB_DETAILS_REQUEST:
        draft.update = {
          loading: true,
          error: null,
          type: action.payload.type,
        };
        break;

        case CONSTANTS.UPDATE_JOB_RESET_REQUEST:
        draft.update = { loading: false, error: null,type:null };
        break;
        
      case CONSTANTS.UPDATE_JOB_DETAILS_SUCCESS:
        draft.update = { loading: false, error: null, type: null };
        draft.job = action.data;
        draft.jobs = draft.jobs.map((job) =>
          job.id === action.data.id ? action.data : job
        );
        break;
      case CONSTANTS.UPDATE_JOB_DETAILS_FAIL:
        draft.update = { loading: false, error: action.error, type: null };
        break;
      case CONSTANTS.REINSTATE_JOB_DETAILS_REQUEST:
        draft.reinstate = {
          loading: true,
          error: null,
        };
        break;
      case CONSTANTS.REINSTATE_JOB_DETAILS_SUCCESS:
        draft.reinstate = { loading: false, error: null };
        // draft.job = action.data;
        // draft.jobs = draft.jobs.map((job) =>
        //   job.id === action.data.id ? action.data : job
        // );
        break;
      case CONSTANTS.REINSTATE_JOB_DETAILS_FAIL:
        draft.reinstate = { loading: false, error: action.error };
        break;
      case CONSTANTS.FETCH_JOB_FULLVIEW_REQUEST:
        draft.fetchFullView = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_JOB_FULLVIEW_SUCCESS:
        draft.jobFullView = action.payload;
        draft.fetchFullView = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_JOB_FULLVIEW_FAIL:
        draft.fetchFullView = { loading: false, error: action.payload };
        break;

      case CONSTANTS.BOOK_CREW_REQUEST:
        draft.bookCrew = {
          loading: true,
          error: null,
          booked: false,
        };
        break;
      case CONSTANTS.BOOK_CREW_SUCCESS:
        draft.bookCrew.loading = false;
        draft.bookCrew.booked = true;
        draft.jobFullView = action.data;
        break;
      case CONSTANTS.BOOK_CREW_FAIL:
        draft.bookCrew = {
          loading: false,
          error: action.payload,
          booked: false,
        };
        break;

      case CONSTANTS.SHOW_DEAL_MEMO:
        draft.visibleDealMemo = true;
        break;
      case CONSTANTS.CLOSE_DEAL_MEMO:
        draft.visibleDealMemo = false;
        break;

      case CONSTANTS.SHOW_HOLD_MEMO:
        draft.visibleHoldMemo = true;
        break;
      case CONSTANTS.CLOSE_HOLD_MEMO:
        draft.visibleHoldMemo = false;
        break;
      case CONSTANTS.SHOW_ARCHIVED_MEMO:
        draft.visibleArchivedMemo = true;
        break;
      case CONSTANTS.CLOSE_ARCHIVED_MEMO:
        draft.visibleArchivedMemo = false;
        break;

      case CONSTANTS.SET_VISIBLE_CREW_CONFIRM:
        draft.visibleCrewConfirm = action.visibility;
        break;

      case CONSTANTS.SET_CREW_OPEN_DEPARTMENTS:
        draft.crewOpenDepartments = action.departments;
        break;

      case CONSTANTS.SET_CREW_ACTIVE_POSITION:
        draft.crewActivePosition = action.position;
        break;

      case CONSTANTS.FETCH_CREW_TEMPLATE_LIST_REQUEST:
        draft.fetchTemplateList = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_CREW_TEMPLATE_LIST_SUCCESS:
        draft.crewTemplates = action.data;
        draft.fetchTemplateList = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_CREW_TEMPLATE_LIST_FAIL:
        draft.fetchTemplateList = { loading: false, error: action.error };
        break;

      case CONSTANTS.CREATE_CREW_TEMPLATE_REQUEST:
        draft.createTemplate = { loading: true, error: null };
        break;
      case CONSTANTS.CREATE_CREW_TEMPLATE_SUCCESS:
        draft.crewTemplates = [...draft.crewTemplates, action.data];
        draft.createTemplate = { loading: false, error: null };
        break;
      case CONSTANTS.CREATE_CREW_TEMPLATE_FAIL:
        draft.createTemplate = { loading: false, error: action.error };
        break;

      case CONSTANTS.LOAD_CREW_TEMPLATE_REQUEST:
        draft.loadTemplate = { loading: true, error: null };
        break;
      case CONSTANTS.LOAD_CREW_TEMPLATE_SUCCESS:
        draft.jobRoleGroups = action.data;
        draft.loadTemplate = { loading: false, error: null };
        break;
      case CONSTANTS.LOAD_CREW_TEMPLATE_FAIL:
        draft.loadTemplate = { loading: false, error: action.error };
        break;

      case CONSTANTS.ARCHIVE_JOB_REQUEST:
        draft.archiveJob = { loading: true, error: null, id: action.jobId };
        break;
      case CONSTANTS.ARCHIVE_JOB_SUCCESS:
        draft.archiveJob = {
          ...draft.archiveJob,
          ...{
            loading: false,
            error: null,
          },
        };
        draft.job = action.data;
        draft.jobs = draft.jobs.filter((job) => job.id != action.data.id);
        break;
      case CONSTANTS.ARCHIVE_JOB_FAIL:
        draft.archiveJob = {
          ...draft.archiveJob,
          ...{
            loading: false,
            error: action.error,
          },
        };
        break;
      case CONSTANTS.DELETE_CONTRACTOR_ATTACHMENT_REQUEST:
        draft.contractorAttachmentDeleted = {
          loading: true,
          success: false,
          error: null,
          attachmentId: action.attachmentId,
        };
        break;
      case CONSTANTS.DELETE_CONTRACTOR_ATTACHMENT_SUCCESS:
        draft.contractorAttachmentDeleted = {
          ...draft.contractorAttachmentDeleted,
          loading: false,
          success: true,
          error: null,
        };
        break;
      case CONSTANTS.DELETE_CONTRACTOR_ATTACHMENT_FAIL:
        draft.contractorAttachmentDeleted = {
          ...draft.contractorAttachmentDeleted,
          loading: false,
          success: false,
          error: action.error,
        };
        break;

      default:
        break;
    }
  });

export default producerJobReducer;
