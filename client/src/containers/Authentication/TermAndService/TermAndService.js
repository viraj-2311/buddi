import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '@iso/components/uielements/button';
import Logo from '@iso/assets/images/logo.webp';
import UpPageIcon from '@iso/assets/images/up-icon-orange.svg';
import IntlMessages from '@iso/components/utility/intlMessages';
import TermAndServiceStyleWrapper from './TermAndService.style';
import Scrollbar from '@iso/components/utility/customScrollBar';
import { Menu } from 'antd';
import { TOSData } from './TOSData';
import parse from 'html-react-parser';

const TermAndService = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.Auth.forgotPassword);
  const [action, setAction] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!loading && !error && action === 'forgot') {
      setSuccessMsg(
        "Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder."
      );
    }

    if (!loading && action === 'forgot') {
      setAction('');
    }
  }, [loading, error]);

  const handleScrollToElement = (contentId) => {
    const section = document.querySelector('#' + contentId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToHeader = () => {
    const section = document.querySelector('#header-page');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goBack = () => {
    history.goBack();
  };

  return (
    <TermAndServiceStyleWrapper>
      <div className='header-view'>
        <div className='header-logo'>
          <div onClick={goBack}>
            <img src={Logo} height='35px' />
          </div>
          <div className='isoFormContent'>
            <span className='titlePage'>
              <IntlMessages id='page.termOfService' />
            </span>
          </div>
        </div>
      </div>
      <div className='isoFormContentWrapper'>
        <Scrollbar className='scroll-view'>
          <div className='content-view'>
            <div>
              <div className='category-index'>
                <Menu
                  style={{ width: 250 }}
                  defaultSelectedKeys={['0']}
                  mode='inline'
                >
                  {TOSData.map((item, index) => (
                    <Menu.Item
                      key={index}
                      onClick={() => handleScrollToElement(item.contentId)}
                    >
                      {item.title}
                      {index < TOSData.length - 1 && (
                        <span className='border-line' />
                      )}
                    </Menu.Item>
                  ))}
                </Menu>
              </div>
            </div>
            <div className='category-content'>
              <div className='paragraph' id={'header-page'}>
                <p className='header-padding'>
                  <strong>PLATFORM LICENSE AGREEMENT</strong>
                </p>
                <p className='header-padding'>
                  This Platform License Agreement (“Agreement”) is between
                  Buddisystems, Inc., a Delaware corporation with a mailing
                  address at 758 Potato Patch Drive, Vail, CO 81657
                  ("Buddisystems”), and the account holder organization entering
                  into this Agreement with Buddisystems (“Licensee”).
                  Buddisystems and Licensee shall individually be referenced as
                  a “Party” and collectively as the “Parties” throughout this
                  Agreement.
                </p>
                <p className='header-padding'>
                  By clicking the “I Accept” button or establishing an account
                  to access the Platform Technology, Licensee agrees to be bound
                  by all of the following terms of this Agreement:
                </p>
              </div>
              {TOSData.map((item, index) => (
                <div id={item.contentId} className='paragraph'>
                  {parse(TOSData[index].desc)}
                </div>
              ))}
            </div>
          </div>
        </Scrollbar>
      </div>
      <Button type='link' className='up-page' onClick={scrollToHeader}>
        <div className='account-icon'>
          <img src={UpPageIcon} alt='Bank' height={30} />
        </div>
      </Button>
    </TermAndServiceStyleWrapper>
  );
};

export default TermAndService;
