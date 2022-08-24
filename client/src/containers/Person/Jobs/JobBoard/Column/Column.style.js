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
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: ${({ isDragging }) =>
    isDragging ? '#e6eaf8' : 'transparent'};
  transition: background-color 0.1s ease;
`;

export const PlusIcon = styled.img`
  width: 30px;
  height: 30px;
  padding: 8px;
  border-radius: 9px;
  background-color: #e6eaf8;
  margin-right: 10px;
  cursor: pointer;
`;

export const MoreActionsWrapper = styled.div`
  cursor: pointer;
`;
