import styled from 'styled-components';
import { grid } from '@iso/assets/styles/constants';

export const Container = styled.div`
  box-sizing: border-box;
  margin-bottom: ${grid}px;
  margin-right: ${grid}px;
  display: flex;
  width: calc(33.33% - ${grid}px);
  min-width: 300px;
  border-radius: 10px;
  overflow: hidden;
  background-color: #f5f7fa;
  flex-direction: column;
  border-top: ${({ color }) => `solid 10px ${color}`};
  padding: 0 20px 20px;
  &.list-view-container{
    width: 100%;
    margin-right:0px;
  }
  @media only screen and (max-width: 768px) {
    width: 100%;
    margin-right: 0;
  }

  /* &:last-child {
    margin-right: 0;
  }
  &:first-child {
    margin-left: 0;
  } */
  .ant-form {
    margin-top: 14px;
  }
  .ant-form-item {
    margin-bottom: 5px;
  }

  .mix-gigs-list-table {
    thead {
      th {
        color: #2f2e50;
      }
    } 
    tr {
      td {
        &:first-child {
          color: #2f2e50;
          font-weight: bold;
        }
        &:last-child {
          button {
            color: #2f2e50;
            font-weight: bold;
          }
        }
      }
    }
    .gigs-list {
      .table-action-btn {
        padding: 0 20px;
        height: 35px;
        border-radius: 50px;
        border-color: #bcbccb;
        color: #43425d;
      }
    }
    .badge-action {
      padding: 5px 11px 4px 12px;
      min-width: 90px;
      border-radius: 5px;
      color: #fff;
      font-weight: 600;
  }
  .badge-processing{
      background-color: #a3a0fb;
  }
  .badge-paid{
      background-color: #19913d;
  }
  .badge-cancel{
      background-color: #e21c41;
  }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 20px 20px 0;
  background-color: ${({ isDragging }) =>
    isDragging ? '#e6eaf8' : 'transparent'};
  transition: background-color 0.1s ease;
  &.table-title-header {
    padding: 20px 0px 20px 0;
  }
`;

export const CreateButton = styled.div`  
  display: flex;
  align-items: center;
  min-width: 270px;
  height: 40px;
  padding: 30px;
  font-size: 15px;
  border-radius: 50px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #f0f0f7;
  background: #ffffff;
  cursor: pointer;
  
  span {
    margin-left: 20px;
  }
`;