import qs from 'qs';

export function setUrl(searchState) {
  const search = searchState
    ? `${window.location.pathname}?${qs.stringify(searchState)}`
    : '';
  window.history.pushState(searchState, null, search);

  return;
}

export function getDefaultPath(options = []) {
  const activePath = routes => {
    const path = routes.join('/');
    let activeMenus = [];

    options.forEach(option => {
      if (path === option.key) {
        activeMenus.push(option.key)
      }

      if (option.children) {
        option.children.forEach(child => {
          if (path === child.key) {
            activeMenus.push(option.key);
            activeMenus.push(child.key);
          }
        });
      }
    });

    return activeMenus;
  };

  if (window.location.pathname) {
    const routes = window.location.pathname.split('/').filter(x => x);
    if (routes.length > 0) {
      return activePath(routes);
    }
  }

  return [];
}
