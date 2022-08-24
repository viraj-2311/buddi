import * as CONSTANTS from './constants';

export const deleteNotification = (data) => ({
  type: CONSTANTS.DELETE_NOTIFICATION,
  data
});

export const fetchNotificationsRequest = (data) => ({
  type: CONSTANTS.FETCH_NOTIFICATION_REQUEST,
  data
});

export const fetchNotificationsSuccess = (data) => ({
  type: CONSTANTS.FETCH_NOTIFICATION_SUCCESS,
  payload: data,
});

export const fetchNotificationsFail = (error) => ({
  type: CONSTANTS.FETCH_NOTIFICATION_FAIL,
  payload: error,
});
