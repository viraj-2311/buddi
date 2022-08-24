import styled from 'styled-components';

export const PersonalNetworkInvitationsWrapper = styled.div`
  padding: 40px;
  background: #f5f7fa;
  @media only screen and (max-width: 767px) {
    padding: 15px;
  }
`;

export const NoInvitationDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 30px;
  margin: 20px 35px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;
  .logo-view {
    justify-content: center;
    display: flex;
    text-align:center;
    @media only screen and (max-width: 767px) {
      margin-top: 30px;
      justify-content: center;
      display: flex;
    }
    img {
      width: 100%;
      max-width: 220px;
    }
  }

  .ant-row {
    align-items: center;
    width: 100%;
  }

  h2 {
    font-size: 20px;
  }

  h2,
  p {
    color: #2f2e50;
  }

  h2 {
    font-weight: bold;
    margin-bottom: 15px;
  }

  p {
    font-size: 15px;
    line-height: 1.33;
  }
`;

export const InvitationListDiv = styled.div`
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;

  .invitationHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ffffff;
    padding: 40px 35px;
  }

  .invitationListContent {
    .ant-spin {
      width: 100%;
      margin: 25px 0 20px;
    }
  }

  h2,
  p {
    color: #2f2e50;
  }

  p {
    font-size: 15px;
  }

  .invitationListTitle {
    padding-right: 20px;
    display: flex;
    align-items: center;
    position: relative;

    h2 {
      font-size: 25px;
      font-weight: bold;
    }
  }
`;

export const InvitationsWrapper = styled.div`
  margin-bottom: 20px;
  padding: 0px 35px;

  &:first-child {
    padding-top: 20px;
  }
`;
