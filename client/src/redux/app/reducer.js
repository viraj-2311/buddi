import { getDefaultPath } from '@iso/lib/helpers/url_sync';
import actions, { getView } from './actions';
const preKeys = getDefaultPath();
const initState = {
  collapsed: window.innerWidth > 1220 ? false : true,
  view: getView(window.innerWidth),
  height: window.innerHeight,
  openDrawer: false,
  openKeys: preKeys,
  showMobileMenu: false,
  allowDoAction: true,
  mobileOverlayMenuVisible: false,
};

export default function appReducer(state = initState, action) {
  switch (action.type) {
    case actions.COLLPSE_CHANGE:
      return {
        ...state,
        collapsed: !state.collapsed,
      };
    case actions.TOGGLE_MOBILE_OVERLAY_MENU:
      return {
        ...state,
        mobileOverlayMenuVisible: !state.mobileOverlayMenuVisible,
      };
    case actions.COLLPSE_OPEN_DRAWER:
      return {
        ...state,
        openDrawer: !state.openDrawer,
      };

    case actions.DISPLAY_MOBILE_MENU:
      return {
        ...state,
        showMobileMenu: !state.showMobileMenu,
      };

    case actions.SELECTED_ITEM_MENU:
      return {
        ...state,
        allowDoAction: action.allowDoAction,
      };

    case actions.TOGGLE_ALL:
      if (state.view !== action.view || action.height !== state.height) {
        const height = action.height ? action.height : state.height;
        return {
          ...state,
          collapsed: action.collapsed,
          view: action.view,
          height,
        };
      }
      break;
    case actions.CHANGE_OPEN_KEYS:
      return {
        ...state,
        openKeys: action.openKeys,
      };
    case actions.CLEAR_MENU:
      return {
        ...state,
        openKeys: [],
        current: [],
      };
    default:
      return state;
  }
  return state;
}
