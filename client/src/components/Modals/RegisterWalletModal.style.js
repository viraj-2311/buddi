import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';
import { palette } from 'styled-theme';

const RegisterWalletModal = styled(Modal)`
  .ant-modal{
    width:75%;
  }
  .closeBtn {
    position: absolute;
    right: 30px;
    top: 30px;
  }
  .ant-modal-content {
    border-radius: 10px;
    background: linear-gradient(to bottom,#3f475b,#3f475b 62%,#222229);
  }

  .ant-modal-body {
    text-align: center;
    padding: 0px 0px;
    position: relative;
    
    .modal-icon-wrapper {
      margin-bottom: 30px;

      .anticon {
        font-size: 50px;
      }
    }
  }

  .register-wallet-wrapper{
    display:flex;      
    img{
      width: 100%;      
    }
    .buddi-image-wrapper{
      flex:1;
      padding: 0px 20px;
      overflow:hidden;
      img{
        position: relative;
        top: -1%;
        height: 103%;
      }
      @media (max-width: 720px) {        
        display:none;
      }
    }
    .buddi-wallet-wrapper{
      flex:1;
      border-top-right-radius:10px;
      border-bottom-right-radius:10px;
      padding:20px;
      background: white;
      display:flex;
      align-items:center;
      @media (max-width: 720px) {
        border-radius:10px;
      }
      .buddi-wallet-content{
        h1{
          font-family: 'OpenSans',sans-serif;
          font-weight:bold;
        }
        img{
          margin-top:25px;
          margin-bottom:40px;
          width:90%;
        }
      }
    }
  }
`;

export default RegisterWalletModal;
