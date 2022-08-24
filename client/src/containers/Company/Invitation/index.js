import React from 'react';
import {Switch, Route, useRouteMatch, Redirect} from 'react-router-dom';
import StaffInvitation from './routes/Staff';

const InvitationRoutes = () => {
  let { url } = useRouteMatch();

  return (
    <div className="container mx-auto">
      <Switch>
        <Route exact path={`${url}/staff`} component={StaffInvitation}/>
        <Redirect to={`${url}/staff`} />
      </Switch>
    </div>
  );
};

export default InvitationRoutes;
