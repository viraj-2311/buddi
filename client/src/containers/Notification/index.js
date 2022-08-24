import React from 'react';
import {Switch, Route, useRouteMatch, Redirect} from 'react-router-dom';
import NotificationList from './routes/NotificationList';


const NotificationsRoutes = () => {
  let { url } = useRouteMatch();

  return (
    <div className="container mx-auto">
      <NotificationList />
    </div>
  );
};

export default NotificationsRoutes;
