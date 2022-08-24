import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import Menu from '@iso/components/uielements/menu';
import IntlMessages from '@iso/components/utility/intlMessages';
import PersonalAccountIntro from '@iso/containers/IntroToolTip/PersonalAccountIntro';
import CompanyAccountIntro from '@iso/containers/IntroToolTip/CompanyAccountIntro';
import {
  StepsIntroPersonalProducer,
  StepsIntroCompanyProducer,
} from '@iso/containers/IntroToolTip/TooltipData';
import Popover from '@iso/components/uielements/popover';
import { TypeUser } from '@iso/containers/IntroToolTip/TooltipData';
const SubMenu = Menu.SubMenu;

const stripTrailingSlash = (str) => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};
export default React.memo(function SidebarMenu({
  singleOption,
  submenuStyle,
  submenuColor,
  mode,
  view,
  typeUser,
  companyId,
  ...rest
}) {
  let match = useRouteMatch();
  const { userStepIntro, companyStepIntro } = useSelector(
    (state) => state.UserIntro
  );
  const url = stripTrailingSlash(match.url);

  const isProducerMenu = () => {
    if (companyId && companyId !== null && companyId !== 'null') {
      return true;
    }
    return false;
  };

  const renderMenu = (option) => {
    const {
      key,
      label,
      customLabel,
      className,
      leftIcon,
      children,
      disabled,
      suffix,
      prefix,
    } = option;
    if (children) {
      return (
        <SubMenu
          key={key}
          className={className}
          title={
            <span className='isoMenuHolder' style={submenuColor}>
              {prefix && <span className='menu-prefix'>{prefix}</span>}
              <span className='menu-icon-svg'>{leftIcon}</span>
              <span className='nav-text'>
                {label ? <IntlMessages id={label} /> : customLabel}
              </span>
              {suffix && <span className='menu-suffix'>{suffix}</span>}
            </span>
          }
          {...rest}
        >
          {children.map((child) => {
            return renderMenu(child);
          })}
        </SubMenu>
      );
    }
    return (
      <Menu.Item
        key={key}
        disabled={disabled}
        {...rest}
        className={
          (mode == 'vertical' || view === 'MobileView') && 'short-list-menu'
        }
      >
        {view !== 'MobileView' && (
          <Popover
            placement={'bottomLeft'}
            content={
              isProducerMenu() ? (
                <CompanyAccountIntro
                  currentStep={companyStepIntro.currentCompanyStepIntro}
                />
              ) : (
                <PersonalAccountIntro
                  currentStep={userStepIntro.currentStepIntro}
                />
              )
            }
            visible={
              isProducerMenu()
                ? (key == `companies/${companyId}/documents` &&
                    companyStepIntro.currentCompanyStepIntro ==
                      StepsIntroCompanyProducer.Document) ||
                  (key == `companies/${companyId}/network` &&
                    companyStepIntro.currentCompanyStepIntro ==
                      StepsIntroCompanyProducer.CompanyNetwork)
                  ? true
                  : false
                : (key == 'finance' &&
                    userStepIntro.currentStepIntro ==
                      StepsIntroPersonalProducer.Finance) ||
                  (userStepIntro.currentStepIntro ==
                    StepsIntroPersonalProducer.PersonalNetwork &&
                    key == 'network')
                ? true
                : false
            }
          >
            <Link to={`${url}/${key}`}>
              <div className='isoMenuHolder' style={submenuColor}>
                {prefix && <span className='menu-prefix'>{prefix}</span>}
                <span className='menu-icon-svg'>{leftIcon}</span>
                {view !== 'MobileView' && (
                  <span className='nav-text'>
                    <IntlMessages id={label} />
                  </span>
                )}
                {suffix && mode == 'inline' && (
                  <span className='menu-suffix'>{suffix}</span>
                )}
              </div>
            </Link>
          </Popover>
        )}
      </Menu.Item>
    );
  };
  return renderMenu(singleOption);
});
