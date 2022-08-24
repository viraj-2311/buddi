import 'whatwg-fetch';
import queryString from 'qs';
import jwtConfig from '@iso/config/jwt.config';
import { store } from '@iso/redux/store';
import { refreshRequest} from '@iso/redux/auth/actions';
import history from '@iso/lib/helpers/history';
import storage from 'redux-persist/lib/storage';

/**
 * API request module
 *
 * @param {*} endpoint
 * @param {string} [method='GET']
 * @param {*} [data={}]
 * @param {boolean} [isToken=false]
 * @returns
 */
const request = async (
  endpoint,
  method = 'GET',
  data = {},
  isToken = true,
  twoFACode,
  isFormData = false,
  isOutSideApi = false,
  isResponseTypeBlob = false
) => {
  return new Promise((resolve, reject) => {
    let qs = '';
    let body;

    if (['GET'].indexOf(method) > -1) {
      qs = `?${queryString.stringify(data, { arrayFormat: 'bracket' })}`;
    } else {
      body = isFormData ? data : JSON.stringify(data);
    }

    const requestUrl = isOutSideApi
      ? endpoint
      : `${jwtConfig.apiUrl}${endpoint}${qs}`;
    const options = {
      method,
      headers: {},
      body,
    };

    if (!isFormData) {
      options.headers['Content-Type'] = 'application/json';
    }

    if (isToken) {
      options.headers.Authorization = `Bearer ${
        store.getState().Auth.token.access
      }`;
    }

    if (twoFACode) {
      options.headers['2fa-auth'] = twoFACode;
    }

    fetch(requestUrl, options)
      .then((result) => {
        if (result.status >= 200 && result.status < 300) {
          if (result.status === 204) {
            return resolve();
          }
          return resolve(isResponseTypeBlob ? result.blob() : result.json());
        }
        
        // Check response status if 401 then refresh token
        if(result.status == 401){
          	const refreshApi = localStorage.getItem('refreshApi');
         
          	if(!refreshApi){
				localStorage.setItem('refreshApi', "1");
				options.method = "POST";
				const refreshToken = store?store.getState().Auth?.token?.refresh:null;
				if(!refreshToken){
					storage.removeItem('persist:auth');
					history.push('/');
					window.location.reload();
				}
				options.body = JSON.stringify({refresh:refreshToken});
				fetch(`${jwtConfig.apiUrl}/token/refresh/`,options).then( async (res)=>  
				{ 
					// check if refresh token not valid then redirect to login page
					if(res.status == 401){ 
						storage.removeItem('persist:auth');
						history.push('/');
					} else {
						let d = await res.json();
						store.dispatch(refreshRequest(d.access))
					}
					window.location.reload();
				}).catch((err) => {
					storage.removeItem('persist:auth');
					history.push('/');
					window.location.reload();
				}).finally(() => {
					localStorage.removeItem('refreshApi');
				});
          	}
        }
        return result.json().then(reject);
      })
      .catch((err) => reject(err));
  });
};

export default request;

export const downloadRequest = (
  endpoint,
  method = 'GET',
  data = {},
  isToken = true,
  twoFACode,
  isFormData = false,
  isOutSideApi = false,
  isResponseTypeBlob = true
) => {
  return request(
    endpoint,
    method,
    data,
    isToken,
    twoFACode,
    isFormData,
    isOutSideApi,
    isResponseTypeBlob
  );
};
