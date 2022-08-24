import styled from 'styled-components';

const ContractorNetworkUsersWrapper = styled.div`
  .userDetails {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 20px;
    position: relative;
    
    .userAvatar {
      min-width: 60px;
      width: 60px;
      height: 60px;
      margin-right: 10px;
      border-radius: 50px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .userInfos {
      .userName {
        font-size: 15px;
        font-weight: bold;
        color: #2f2e50;
        line-height: normal;
      }

      .userPosition {
        font-size: 13px;
        font-weight: normal;
        color: #2f2e50;
      }
    }
    
    .userAction {
      position: absolute;
      right: 0;
      
      button {
        height: 40px;
        
        &.connect {
          border-color: #5c4da0;
          color: #5c4da0;
        }
    
        .pending {
          border-color: #a4afb7;
          color: #a4afb7;
        }
      }
    }   

    @media screen and (max-width: 1440px) {
      .userAvatar {
        min-width: 48px;
        width: 48px;
        height: 48px;
      }
      
      button {
        padding: 0 15px;
        font-size: 12px;
        height: 38px;
      }
    }
  }
`;

export default ContractorNetworkUsersWrapper;
