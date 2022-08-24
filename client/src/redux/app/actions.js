export function getView(width) {
  let newView = 'MobileView';
  if (width > 1220) {
    newView = 'DesktopView';
  } else if (width > 767) {
    newView = 'TabView';
  }
  return newView;
}
const actions = {
  COLLPSE_CHANGE: 'COLLPSE_CHANGE',
  COLLPSE_OPEN_DRAWER: 'COLLPSE_OPEN_DRAWER',
  CHANGE_OPEN_KEYS: 'CHANGE_OPEN_KEYS',
  TOGGLE_ALL: 'TOGGLE_ALL',
  CLEAR_MENU: 'CLEAR_MENU',
  DISPLAY_MOBILE_MENU: 'DISPLAY_MOBILE_MENU',
  SELECTED_ITEM_MENU: 'SELECTED_ITEM_MENU',
  TOGGLE_MOBILE_OVERLAY_MENU: 'TOGGLE_MOBILE_OVERLAY_MENU',

  toggleCollapsed: () => ({
    type: actions.COLLPSE_CHANGE,
  }),

  toggleAll: (width, height) => {
    const view = getView(width);
    const collapsed = view !== 'DesktopView';
    return {
      type: actions.TOGGLE_ALL,
      collapsed,
      view,
      height,
    };
  },

  toggleOpenDrawer: () => ({
    type: actions.COLLPSE_OPEN_DRAWER,
  }),

  toggleMobileOverlayMenu: () => ({
    type: actions.TOGGLE_MOBILE_OVERLAY_MENU,
  }),

  displayMobileMenu: () => ({
    type: actions.DISPLAY_MOBILE_MENU,
  }),

  setAllowDoAction: (allowDoAction) => ({
    type: actions.SELECTED_ITEM_MENU,
    allowDoAction,
  }),

  changeOpenKeys: (openKeys) => ({
    type: actions.CHANGE_OPEN_KEYS,
    openKeys,
  }),

  clearMenu: () => ({ type: actions.CLEAR_MENU }),
};
export default actions;
