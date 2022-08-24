import styled from "styled-components";
import Alerts from "@iso/components/Feedback/Alert";

const PaymentAlertStyle = styled(Alerts)`
  margin: 40px 30px 10px 25px !important;
  border-radius: 10px !important;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #f0f0f7 !important;
  background-color: #fff !important;
  color: #2f2e50 !important;
  padding: 25px !important;
  @media only screen and (max-width: 650px) {
    padding: 15px !important;
  }

  .ant-alert-message {
    .title {
      display: flex;
      align-items: center;
      color: #2f2e50;
      h3 {
        font-size: 20px;
        font-weight: bold;
        margin-left: 20px;
        color: #2f2e50;
        font-family: 'Open Sans',Roboto,sans-serif;
        @media only screen and (max-width: 900px) {
          font-size: 16px;
          margin-left: 10px;
        }
        @media only screen and (max-width: 650px) {
          font-size: 14px;
          margin-left: 5px;
        }
      }
    }
  }

  .ant-alert-description {
    font-size: 15px;
    line-height: 1.53;
    margin-top: 10px;
    @media only screen and (max-width: 650px) {
      font-size: 12px;
    }
    p {
      color: #2f2e50;
      font-size: 15px;
      max-width: 85%;
      @media only screen and (max-width: 1500px) {
        max-width: 100%;
      }
    }
  }
`;

export default PaymentAlertStyle;
