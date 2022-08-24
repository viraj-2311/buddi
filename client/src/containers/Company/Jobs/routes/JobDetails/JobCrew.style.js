import styled from 'styled-components';
import { palette } from 'styled-theme';

const JobCrewWrapper = styled.div`
  padding: 20px;
  background: #f5f7fa;
  // pointer-events: ${props => props.noEvents ? "none !important" : "auto"};
  .jobDetailContent {
    border: solid 1px #e8e8f1;
    border-radius: 10px;
    overflow: hidden;

    .jobRoleList {
      border: none !important;
      > li {
        margin: 0 !important;

        &.roleAction {
          color: #2f80ed;
          font-style: italic;
        }

        &.ant-menu-item-selected {
          background-color: inherit !important;
        }

        &.ant-menu-item-selected::after {
          border: 0px !important;
        }
      }
    }
  }
  .ant-select:not(.ant-select-disabled){
    &:hover{
      .ant-select-selector{
        border-color:${palette('themecolor', 0)} !important;
        &:focus{
          border-color:${palette('themecolor', 0)} !important;
        }
      }
    }
  }
  .ant-select-focused{
    .ant-select-selector{
      border-color:${palette('themecolor', 0)} !important;
      box-shadow:none !important;
    }
    border-color:${palette('themecolor', 0)} !important;
    box-shadow:none !important;
  }
`;

const JobDepartmentCrewWrapper = styled.div`
  border-top: solid 1px #e8e8f1;
  position: relative;
  &:first-child {
    border-top: none;
  }
  &:before {
    content: "";
    background-color: #fff;
    position: absolute;
    width: 100%;
    height: 50px;
    left: 0;
    top: 0;
  }
  .flex-size {
    flex: 0 0 260px;
    @media screen and (max-width: 1200px) {
      flex: 0 0 300px;
    }
    @media screen and (max-width: 1024px) {
      flex: 0 0 1024px;
    }
  }
  .ant-menu-item-selected{
    background:rgba(244,141,58,0.2) !important;
    color:${palette('themecolor', 0)} !important;
    &:active{
      background:rgba(244,141,58,0.2) !important;
      color:${palette('themecolor', 0)} !important;
    }
    &:after{
      border-right-color:${palette('themecolor', 0)} !important;
    }
  }
  
  .departmentList {
    padding: 0 20px;
    background: none;
    .ant-menu-submenu > .ant-menu {
      background: none;
      padding: 15px 0;
    }
    .departmentRoleList {
      .ant-menu-submenu-title {
        position: relative;
        &:active{
          background-color:transparent !important;
        }

        &:after {
          content: "";
          position: absolute;
          top: 50%;
          right: 0;
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid #000;
          visibility: visible;
          margin-top: -2px;
        }
        .ant-menu-submenu-arrow {
          display: none;
        }
        
        .roleGroupTitleWrapper {
          display: flex;
          
          .roleGroupTitle {
            flex: auto;
            color: #2f2e50;
            font-size: 15px;
            font-weight: bold;
            margin-left: 20px;
            
            input {
              height: 40px;
            }
          }
        }
      }

      ul > li {
        margin: 0;
        padding: 0;
        height: 50px;
        line-height: 49px;
        text-align: right;
        &:hover{
          color:${palette('themecolor', 0)} !important;
        }
       

        .roleTitle {
          flex: auto;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: right;
        }

        &.dynamicRole {
          .roleAction {
            width: 15px;
            float: left;
            margin-top: 18px;
          }
        }

        &.roleAction {
          height: auto;
          color: #f48d3a;
          font-weight: bold;
          text-align: left;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }

  .roleChoiceRow {
    margin: 0;
    @media screen and (max-width: 1200px) {
      padding-left: 20px;
      padding-right: 5px;
    }
  }

  .roleChoice {
    .crewList {
      .crewListItems {
        background: none !important;
        padding: 15px 0 !important;        
      }
      .choiceTitle {
        height: 40px;
        line-height: 40px;
        margin-top: 4px;
        margin-bottom: 4px;
        font-weight: bold;
      } 
  }
`;

const AddDepartment = styled.div`
  padding: 0 18px;
  min-height: 50px;
  line-height: 49px;
  background: #fff;
  border-top: solid 1px #e8e8f1;
  position: relative;

  .departmentEditorWrapper {
    padding: 10px 0;
  }

  button {
    font-weight: bold;
  }
`;

export { JobCrewWrapper, JobDepartmentCrewWrapper, AddDepartment };
