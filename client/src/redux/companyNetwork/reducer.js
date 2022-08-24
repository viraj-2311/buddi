import produce from 'immer';
import * as CONSTANTS from './constants';

const initialState = {
  users: [],
  user: null,
  sentInvitations: [],
  receivedInvitations: [],
  list: {
    loading: false,
    error: null,
  },
  detail: {
    loading: false,
    error: null,
  },
  delete: {
    loading: false,
    error: null,
  },
  invite: {
    loading: false,
    error: null,
    professionals: [],
  },
  fetchSentInvitation: {
    loading: false,
    error: null,
  },
  fetchReceivedInvitation: {
    loading: false,
    error: null,
  },
  acceptInvitation: {
    loading: false,
    error: null,
  },
  rejectInvitation: {
    loading: false,
    error: null,
  },
  deleteInvitation: {
    loading: false,
    error: null,
    notified: true,
  },
  acceptInvitationsArray: [],
  rejectInvitationsArray: [],
  favorite: {
    loading: false,
    error: null,
  },
  receivedConnections: [],
  fetchReceivedConnection: {
    loading: false,
    error: null,
  },
};

const companyNetworkReducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case CONSTANTS.FETCH_COMPANY_NETWORK_USERS_REQUEST:
        draft.list = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_USERS_SUCCESS:
        draft.users = action.data;
        draft.list = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_USERS_FAIL:
        draft.users = [];
        draft.list = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_COMPANY_NETWORK_USER_DETAIL_REQUEST:
        draft.detail = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_USER_DETAIL_SUCCESS:
        draft.user = action.data;
        draft.detail = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_USER_DETAIL_FAIL:
        draft.user = null;
        draft.detail = { loading: false, error: action.error };
        break;

      case CONSTANTS.DELETE_COMPANY_NETWORK_USER_REQUEST:
        draft.delete = { loading: true, error: null };
        break;
      case CONSTANTS.DELETE_COMPANY_NETWORK_USER_SUCCESS:
        draft.users = draft.users.filter((user) => user.id !== action.data);
        draft.delete = { loading: false, error: null };
        break;
      case CONSTANTS.DELETE_COMPANY_NETWORK_USER_FAIL:
        draft.delete = { loading: false, error: action.error };
        break;

      case CONSTANTS.INVITE_COMPANY_NETWORK_USER_REQUEST:
        draft.invite = { loading: true, error: null, professionals: [] };
        break;
      case CONSTANTS.INVITE_COMPANY_NETWORK_USER_SUCCESS:
        draft.invite = {
          loading: false,
          error: null,
          professionals: action.data,
        };
        break;
      case CONSTANTS.INVITE_COMPANY_NETWORK_USER_FAIL:
        draft.invite = {
          loading: false,
          error: action.error,
          professionals: [],
        };
        break;

      case CONSTANTS.FETCH_COMPANY_NETWORK_SENT_INVITATION_REQUEST:
        draft.fetchSentInvitation = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_SENT_INVITATION_SUCCESS:
        draft.sentInvitations = action.data;
        draft.fetchSentInvitation = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_SENT_INVITATION_FAIL:
        draft.fetchSentInvitation = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_COMPANY_NETWORK_RECEIVED_INVITATION_REQUEST:
        draft.fetchReceivedInvitation = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_RECEIVED_INVITATION_SUCCESS:
        draft.receivedInvitations = action.data;
        draft.fetchReceivedInvitation = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_RECEIVED_INVITATION_FAIL:
        draft.fetchReceivedInvitation = { loading: false, error: action.error };
        break;

      case CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_REQUEST:
        const { invitationId } = action;
        draft.acceptInvitation = { loading: true, error: null };
        const findInvitationIndex = draft.acceptInvitationsArray.findIndex(
          (e) => e.invitationId === invitationId
        );
        if (findInvitationIndex === -1) {
          draft.acceptInvitationsArray.push({
            invitation: { id: invitationId },
            loading: true,
            error: null,
            invitationId,
          });
        }
        break;

      case CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_SUCCESS:
        // draft.receivedInvitations = draft.receivedInvitations.map(
        //   (invitation) =>
        //     invitation.id === action.data.id ? action.data : invitation
        // );
        draft.acceptInvitation = { loading: false, error: null };
        draft.acceptInvitationsArray = draft.acceptInvitationsArray.map((ai) =>
          ai.invitationId === action.data.id
            ? {
                ...ai,
                invitation: { ...action.data },
                loading: false,
                error: null,
              }
            : ai
        );
        break;

      case CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_SUCCESS_NOTIFY:
        draft.acceptInvitationsArray = draft.acceptInvitationsArray.map((ai) =>
          ai.invitationId === action.invitation.id
            ? { ...ai, notify: true }
            : ai
        );
        break;

      case CONSTANTS.ACCEPT_COMPANY_NETWORK_INVITATION_FAIL:
        draft.acceptInvitation = { loading: false, error: action.error };
        draft.acceptInvitationsArray = draft.acceptInvitationsArray.map((ai) =>
          ai.invitationId === action.data.id
            ? { ...ai, loading: false, error: action.error, notify: true }
            : ai
        );
        break;

      case CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_REQUEST:
        const { invitationId: rejectInvitationId } = action;
        draft.rejectInvitation = { loading: true, error: null };
        const findRejectedInvitationIndex =
          draft.rejectInvitationsArray.findIndex(
            (e) => e.invitationId === rejectInvitationId
          );
        if (findRejectedInvitationIndex === -1) {
          draft.rejectInvitationsArray.push({
            invitation: { id: invitationId },
            loading: true,
            error: null,
            invitationId: rejectInvitationId,
          });
        }
        break;
      case CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_SUCCESS:
        // draft.receivedInvitations = draft.receivedInvitations.map(
        //   (invitation) =>
        //     invitation.id === action.data.id ? action.data : invitation
        // );
        draft.rejectInvitation = { loading: false, error: null };
        draft.rejectInvitationsArray = draft.rejectInvitationsArray.map((ri) =>
          ri.invitationId === action.data.id
            ? {
                ...ri,
                invitation: { ...action.data },
                loading: false,
                error: null,
              }
            : ri
        );
        break;

      case CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_SUCCESS_NOTIFY:
        draft.rejectInvitationsArray = draft.rejectInvitationsArray.map((ri) =>
          ri.invitationId === action.invitation.id
            ? { ...ri, notify: true }
            : ri
        );
        // draft.receivedInvitations = draft.receivedInvitations.map((ri) =>
        //   ri.id === action.invitation.id ? action.invitation : ri
        // );
        break;

      case CONSTANTS.REJECT_COMPANY_NETWORK_INVITATION_FAIL:
        draft.rejectInvitation = { loading: false, error: action.error };

        draft.rejectInvitationsArray = draft.rejectInvitationsArray.map((ri) =>
          ri.invitationId === action.data.id
            ? { ...ri, loading: false, error: action.error, notify: true }
            : ri
        );
        break;

      case CONSTANTS.SET_FAVORITE_COMPANY_NETWORK_USER_REQUEST:
        draft.favorite = { loading: true, error: null };
        break;
      case CONSTANTS.SET_FAVORITE_COMPANY_NETWORK_USER_SUCCESS:
        draft.users = draft.users.map((user) =>
          user.id === action.data.id ? action.data : user
        );
        draft.favorite = { loading: false, error: null };
        break;
      case CONSTANTS.SET_FAVORITE_COMPANY_NETWORK_USER_FAIL:
        draft.favorite = { loading: false, error: action.error };
        break;

      case CONSTANTS.FETCH_COMPANY_NETWORK_CONNECTION_REQUEST:
        draft.fetchReceivedConnection = { loading: true, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_CONNECTION_SUCCESS:
        draft.receivedConnections = action.data;
        draft.fetchReceivedConnection = { loading: false, error: null };
        break;
      case CONSTANTS.FETCH_COMPANY_NETWORK_CONNECTION_FAIL:
        draft.fetchReceivedConnection = { loading: false, error: action.error };
        break;

      case CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_REQUEST:
        draft.deleteInvitation = {
          loading: true,
          error: null,
          notified: false,
        };
        break;
      case CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_SUCCESS:
        draft.deleteInvitation = {
          loading: false,
          error: null,
          notified: false,
        };
        break;

      case CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_SUCCESS_NOTIFY:
        draft.deleteInvitation = {
          loading: false,
          error: null,
          notified: true,
        };
        break;

      case CONSTANTS.DELETE_COMPANY_NETWORK_CONNECTION_FAIL:
        draft.deleteInvitation = {
          loading: false,
          error: action.error,
          notified: false,
        };
        break;

      default:
        break;
    }
  });

export default companyNetworkReducer;
