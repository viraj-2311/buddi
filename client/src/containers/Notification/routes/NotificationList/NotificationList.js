import React, {useEffect, useCallback, useRef, useState, useMemo} from 'react';
import EmptyComponent from '@iso/components/EmptyComponent';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchNotificationsRequest
} from '@iso/redux/notification/actions';
import NotificationListWrapper from "../../components/NotificationList.style";
import NotificationItem from "../../components/NotificationItem";
import Loader from '@iso/components/utility/loader';

const NotificationList = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.Notification);
    const [selectedId, setSelectedId] = useState();

    useEffect(() => {
      dispatch(fetchNotificationsRequest());
    }, []);

    const chooseNotification = (id) => {
      setSelectedId(id);
    }

    return (
      <NotificationListWrapper>
        {notifications.length == 0
          ? (<EmptyComponent text="You have no notifications now" />)
          : (notifications.map((notification, index) =>
              (<NotificationItem notification={notification} selectedId={selectedId} changeNotification={chooseNotification}  key={index} />)
          ))
        }
      </NotificationListWrapper>
    );
};

export default NotificationList;