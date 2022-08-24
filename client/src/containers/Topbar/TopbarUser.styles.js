import styled from 'styled-components';

export const ArrowDowStyle = styled.img`
  display: none;
  @media only screen and (min-width: 768px) {
    display: block;
  }
`;
export const UserNameStyle = styled.span`
  display: none;
  @media only screen and (min-width: 768px) {
    display: block;
  }
`;
export const AccountSummaryStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const AccountSummaryInfoStyle = styled.div`
  margin: 0.5rem 0 1rem;
  text-align: center;
`;
export const AccountListWrapperStyle = styled.div`
  .ant-list-item-meta {
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  }
  .ant-list-item {
    border: none;
    &:first-child {
      padding-top: 0;
    }
    &:last-child {
      padding-bottom: 0;
    }
  }
  .anticon-user-add {
    svg {
      width: 35px;
    }
  }
`;
export const AccountSummaryInfoTitleStyle = styled.div`
  font-weight: bold;
`;
export const AccountSummaryInfoEmailStyle = styled.div`
  color: gray;
  font-size: 0.75rem;
  word-break: break-word;
`;
export const FooterButtonWrapperStyle = styled.div`
  text-align: center;
`;
