import produce from 'immer';
import * as constants from './constants';

const initState = {
  staffInvitation: {
    company: null,
    invitee: null,
    confirm: {
      visible: false,
      props: {},
    },
    form: {
      visible: false,
      props: {}
    },
    success: {
      visible: false
    }
  },
  bookCrew: {
    confirm: {
      visible: false,
      props: {}
    }
  },
  success: {
    visible: false,
    props: {}
  }
};

const modalReducer = (state = initState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case constants.SHOW_STAFF_INVITATION_CONFIRM:
        draft.staffInvitation.confirm = {
          visible: true,
          props: action.props
        };
        draft.staffInvitation.company = action.company;
        draft.staffInvitation.invitee = action.invitee;
        break;
      case constants.CLOSE_STAFF_INVITATION_CONFIRM:
        draft.staffInvitation.confirm = {
          visible: false,
          props: {}
        };
        break;
      case constants.CANCEL_STAFF_INVITATION_CONFIRM:
        draft.staffInvitation.confirm = {
          visible: false,
          props: {}
        };
        draft.staffInvitation.company = null;
        draft.staffInvitation.invitee = null;
        break;

      case constants.SHOW_STAFF_INVITATION:
        draft.staffInvitation.form = {
          visible: true,
          props: action.props
        };
        break;
      case constants.CANCEL_STAFF_INVITATION:
        draft.staffInvitation.form = {
          visible: false,
          props: action.props
        };
        draft.staffInvitation.company = null;
        draft.staffInvitation.invitee = null;
        break;
      case constants.CLOSE_STAFF_INVITATION:
        draft.staffInvitation.form = {
          visible: false,
          props: action.props
        };
        draft.staffInvitation.company = null;
        draft.staffInvitation.invitee = null;
        break;
      
      case constants.SHOW_BOOK_CREW_CONFIRM:
        draft.bookCrew.confirm = {
          visible: true,
          props: action.props
        };
        break;
      case constants.CLOSE_BOOK_CREW_CONFIRM:
        draft.bookCrew.confirm = {
          visible: false,
          props: {}
        };
        break;
      
      case constants.SHOW_SUCCESS:
        draft.success = {
          visible: true,
          props: action.props || {}
        };
        break;
      case constants.CLOSE_SUCCESS:
        draft.success.visible = false;
        break;
      default:
        break;
    }
  });

export default modalReducer;
