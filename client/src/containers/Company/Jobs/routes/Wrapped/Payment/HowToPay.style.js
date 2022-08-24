import styled from 'styled-components';
import Modal from '@iso/components/Modal';

const HowToPayModalWrapper = styled(Modal)`
    border-radius: 7px;
    padding: 0;
  
    .ant-modal-header {
      padding: 39px 35px;
      @media (max-width: 575px) {
        padding:30px;
        .ant-modal-title{
          font-size:20px;
        }
      }
      @media (max-width: 360px) {
        .ant-modal-title{
          font-size:18px;
        }
      }
    }
    .ant-modal-close {
      top: 17px;
      right: 10px;
      @media (max-width: 575px) {
        top: 7px;
      }
    }
    
    .ant-modal-body {
      padding: 35px 40px;
      @media (max-width: 575px) {
        padding:30px;
      }
      
      .payment-methods {
        display: flex;
        justify-content: space-between;
        
        .payment-method-item-selected {
          border-color: #19913d !important;
        }
        
        .payment-method-item {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          
          border-radius: 10px;
          box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
          border: 1px solid #bcbccb;
          background-color: #fff;
          color: #2f2e50;
          padding: 45px 30px;
          cursor: pointer;

          .payment-method-image {
            width: 118px;
            height: 75px;
            border-radius: 10px;
            box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);

            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
          }

          .payment-method-content {
            text-align: center;
            
            .payment-method-title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 20px;
            }

            .payment-method-timing {
              font-size: 13px;
            } 
          }
        }
        
        .payment-method-wallet {
          .payment-method-image {
            border: solid 1px #bcbccb;
            background-image: linear-gradient(to bottom, #2e2c6d, #5838a3 62%, #6b3dbc);
          }
        }

        .payment-method-bank {
          .payment-method-image {
            border: solid 1px #51369a;
          }
        }
      }
      
      .footer-button-container {
        margin-top: 40px;
        margin-bottom: 19px;
        display: flex;
        justify-content: center;
        
        .ant-btn {
          color: #fff;
          width: 254px;
          height: 50px;
          font-size: 15px;
          font-weight: bold;
          background-color: #19913d;
          border-color: #19913d;
        }
      }
      
      @media only screen and (max-width: 700px) {
        .payment-methods {
          flex-direction: column;
          
          .payment-method-wallet {
            margin-bottom: 20px;
          }
        }
      }
    }
`

export default HowToPayModalWrapper