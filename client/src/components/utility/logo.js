import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@iso/assets/images/logo.webp';
import siteConfig from '@iso/config/site.config';

export default ({ collapsed, onToggle }) => {
  return (
    <div className='isoLogoWrapper'>
      {collapsed ? (
        <button className='triggerBtn menuCollapsed' onClick={onToggle} />
      ) : (
        <>
          <button className='triggerBtn menuOpen' onClick={onToggle} />
          {/* <Link to="/dashboard"><img src={Logo} height="56px" /></Link> */}
          <Link to='/jobs'>
            <img src={Logo} height='35px' />
          </Link>
        </>
      )}
    </div>
  );
};
