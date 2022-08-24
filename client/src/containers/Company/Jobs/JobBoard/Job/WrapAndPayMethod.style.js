import styled from 'styled-components';
import Modal from '@iso/components/Modal';

const WrapAndPayMethodModalWrapper = styled(Modal)`
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #f0f0f7;
    background-color: #fff;
    padding: 0;
  
    .ant-modal-body {
      padding: 30px 30px 57px;
      
      .inner-content {
        .title-block {
          margin-top: 31px;
          text-align: center;
          color: #43425d;

          .title {
            font-size: 25px;
            font-weight: bold;
            margin-bottom: 11px;
          }
          
          .sub-title {
            font-size: 15px;
          }
        }
        
        .wrap-and-pay-methods {
          margin-top: 34px;

          .wrap-method-view {
            padding: 30px 52px 30px 30px;
            border-radius: 10px;
            border: 1px solid #f0f0f7;
            color: #43425d;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            
            &.ant-radio-wrapper-checked {
              background-color: #f0f0f7;
            }

            .ant-radio-inner {
              border-color: #bcbccb;
            }

            .ant-radio-inner::after {
              background-color: #19913d;
            }
            
            .wrap-method-inner-content {
              margin-left: 12px;
              
              .wrap-method-title {
                font-size: 17px;
                font-weight: bold;
                margin-bottom: 11px;
              }

              .wrap-method-description {
                font-size: 13px;
              } 
            }
          }
          
          .footer-button-container {
            margin-top: 20px;
            
            .ant-form-item-control-input {
              margin: 0 auto; 
              
              button {
                width: 198px;
                font-size: 15px;
                font-weight: bold;
                height: 54px;
                border-radius: 50px;
              }
              
              .continue-btn {
                background-color: #38923F;
                color: #fff;
                border: 0;
                margin-left: 20px;
              }
              
              .cancel-btn {
                color: #2f2e50;
                border-color: #2f2e50;
              }
            }
          }
        }
      }
    }
`

export default WrapAndPayMethodModalWrapper