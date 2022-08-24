import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Select } from "antd";

const JobBoardLayout = styled.div`
  background: #ffffff;
  padding: 35px 40px;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 768px) {
    padding: 20px 20px;
  }
  @media only screen and (max-width: 425px) {
    padding: 10px 10px;
  }
`;

export const ParentContainer = styled.div`
  height: ${({ height }) => height};
  overflow-x: hidden;
  overflow-y: auto;
`;

/* like display:flex but will allow bleeding over the window width */
export const Container = styled.div`
  min-width: 300px;
  display: flex;
  flex-wrap: wrap;
`;

export const JobHeader = styled.div`
  display: flex;
  align-items: center;
  margin: 0 0 30px;
  justify-content: space-between;
  @media only screen and (max-width: 992px) {
    display:block;
  }
  @media only screen and (max-width: 767px) {
    flex-wrap: wrap;
  }
  @media only screen and (max-width: 425px) {
    padding-left: 10px;
  }

  .page-view-outer{
    background-color: #dd730a;
    height: 50px;
    width: 100px;
    border-radius: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    img{
      padding: 12px 12px;
      margin: 3px;
      border-radius: 10px;
      &.active,
      &:hover{
        cursor:pointer;
        background-color:#f48d3a;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);

      }
    }
  }

  .d-flex {
    display: flex;
    @media only screen and (max-width: 992px) {
      justify-content:space-between;
      margin-bottom: 15px;
    }
  }
  .align-center {
    align-items: center;
  }

  h1 {
    margin: 0;
    display: flex;
    align-items: center;
    font-size: 30px;
    font-weight: bold;

    .ant-badge {
      margin-left: 20px;
    }
  }
`;

export const JobHeaderAction = styled.div`
  @media only screen and (max-width: 767px) {
    justify-content: flex-start;
  }
  @media only screen and (max-width: 425px) {
    flex-wrap: wrap;
  }

  button.ant-btn {
    border-radius: 50px;
    margin-right: 20px;
    @media only screen and (max-width: 767px) {
      margin-left: 0;
      margin-right: 20px;
    }
  }
  .archivedBtn {
    background-color: #868698;
    border-color: #868698;
    color: #fff;
    &:hover {
      background-color: #868698;
      border-color: #868698;
      color: #fff;
    }
    span {
      margin-left: 10px;
    }
  }
`;

export const AntSelect = styled(Select)`
  width: 250px;
  margin-left: 50px;
  &.ant-select .ant-select-selector {
    border-radius: 50px;
    background-color: transparent;
    height: 50px;
    background-color: #f5f7fa;
    padding: 0 13px;
    &:after {
      content: "";
      position: absolute;
      top: 22px;
      right: 18px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #000;
      visibility: visible;
    }
    .ant-select-selection-search-input {
      height: 100%;
    }
    .ant-select-selection-item, .ant-select-selection-placeholder {
      line-height: 48px;
      font-weight: bold;
      color: #2f2e50;
      opacity: 1;
    }
  }
  .ant-select-arrow {
    display: none;
  }
`;

export const AntSelectOption = Select.Option;

export default JobBoardLayout;
