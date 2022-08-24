import React from 'react';
import JobPageHeaderWrapper from './PageMenu.style';

export default props => (
  <JobPageHeaderWrapper className={`isoPageHeader ${props.type}`}>
    <div className="jobPageTitle">
      {props.children}
    </div>
  </JobPageHeaderWrapper>
);
