import { store } from './redux/store';
import { checkAuthorization } from '@iso/redux/auth/actions';

export default () => {
  return new Promise(() => {
    store.dispatch(checkAuthorization());
  });
}
