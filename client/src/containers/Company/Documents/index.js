import React from 'react';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import Documents from './Documents';

const DocumentsRoutes = () => {
  let { url } = useRouteMatch();

  return (
    <div className='container mx-auto'>
      <Switch>
        <Route exact path={`${url}`} component={Documents} />
      </Switch>
    </div>
  );
};

export default DocumentsRoutes;
