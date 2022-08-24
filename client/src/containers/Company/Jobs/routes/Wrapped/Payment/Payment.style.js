import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Select } from 'antd';

const WrappedJobPaymentWrapper = styled.div`
  width: 100%;
.d-flex{
  display:flex;
}
  .jobPaymentWrapper {
    &.download-report-job-screen{
      .paymentTable{
        @media only screen and (max-width: 1400px) {
          width:100%
        }
      }
      .paymentActionButtons{
        width:auto;
        @media only screen and (max-width: 992px){
          margin-bottom:15px;
        }
        .actionButtons{
          @media only screen and (min-width: 575px) {
            flex-direction: inherit;
          }
        }
        .left{
          justify-content: space-between;
          align-items: center;
          width: calc(100% - 250px - 35px);
          margin-right:0px;
          @media only screen and (max-width: 1400px) {
            width:100%
          }
          @media only screen and (max-width: 992px){
            margin-bottom:0px;
          }

          .downloadBtn{
            span{
              margin-right:10px;
            }
          }
          .crewActual{
            display:flex;
            align-items: center;
            
            @media only screen and (min-width: 768px) and (max-width: 944px){
              margin-top:15px;
            }
            @media only screen and (min-width: 768px) and (max-width: 992px){
              width:100%;
              justify-content: end;
            }
            .title-crew{
              margin-right: 12px;
              font-size:15px;
              color:#2f2e50;
              font-weight: bold;
            }
            .ant-input{
              background-color:#e0efdf;
              border-color:#e0e1e9;
              font-size:15px;
              color:#2f2e50;
              font-weight: bold;
              width:auto;
              @media only screen and (min-width: 768px) and (max-width: 1550px){
                height:45px;
                max-width: 180px;
              }
            }
          }
        }
      }
    }
    padding-left: 30px;
    padding-top: 30px;
    padding-bottom: 30px;
    @media only screen and (max-width: 768px) {
      padding-left: 15px;
      padding-right: 15px;
      padding-bottom: 5px;
    }

    .paymentActionButtons {
      display: flex;
      margin-right: 30px;
      flex-direction: row;
      justify-content: space-between;
      margin-bottom: 25px;
      flex-wrap: wrap;

      @media (max-width: 575px) {
        margin-right: 0px;
      }

      .actionButtons {
        display: flex;
        align-items: center;
        width: calc(100% - 20px);
        @media (max-width: 767px) {
          align-items: flex-start;
          padding-left: 20px;
        }
        button,
        .ant-select {
          &.ant-btn-round {
            min-width: 170px;
            justify-content: center;
          }

          &.payApprovedBtn {
            background-color: #19913d;
            border-color: #19913d;
            color: #ffffff;
            margin: 0 0 0 20px;
            &:hover,
            &:focus {
              background-color: #19913d;
              border-color: #19913d;
            }
            @media (max-width: 767px) {
              margin-bottom: 30px;
            }
          }

          &.downloadBtn {
            margin: 0 0 0px 20px;
            border-color: #19913d;
            width: 200px;
            color: #2f2e50;
            display: flex;
            align-items: center;
            cursor: pointer;
            // span {
            //   margin-right: 10px;
            // }
            @media (max-width: 767px) {
              margin-bottom: 15px;
            }
          }

          &.ant-btn-round {
            @media (max-width: 400px) {
              width: 180px;
            }
          }
        }

        .download-select-outer {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          position: relative;
          height: 50px;
          @media (max-width: 767px) {
            margin-bottom: 15px;
          }
          @media only screen and (min-width: 768px) and (max-width: 1550px) {
            height:45px;
          }
          .download-icon {
            cursor: pointer;
            background: #19913d;
            height: 100%;
            color: #fff;
            width: 45px;
            border-top-right-radius: 50%;
            border-bottom-right-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            svg{
              margin-right:5px;
            }

            @media (max-width: 767px) {
              margin-top: -16px;
            }
          }
        }

        @media only screen and (max-width: 767px) {
          flex-direction: column;
        }
      }

      .left {
        margin-right: 10px;
        display: flex;
        flex-wrap: wrap;
        width: calc(100% - 250px - 60px);
        margin-right: 30px;
        @media (max-width: 1024px) {
          width: 100%;
          margin-bottom: 15px;
        }

        .ant-checkbox-wrapper {
          display: flex;
          align-self: center;
        }

        // .checkbox {
        //   margin-bottom: 30px;
        // }
      }

      .right {
        display: flex;
        width: 250px;
        .ant-input{
          background-color:#e0efdf;
          border-color:#e0e1e9;
          font-size:15px;
          color:#2f2e50;
          font-weight: bold;
          @media only screen and (min-width: 768px) and (max-width: 1550px) {
            height:45px;
          }
        }
        @media (max-width: 1024px) {
          width: 100%;
          margin-bottom: 15px;
        }

        @media (max-width: 1024px) {
          margin-right: 20px;
        }
        @media (max-width: 575px) {
          min-width: auto;
          margin-right: 0px;
        }

        .crewActual {
          display: flex;
          align-items: center;
          @media (max-width: 575px) {
            flex-wrap: wrap;
            margin-right: 0px;
          }

          /* margin-right: 30px; */
          .title-crew {
            width: 208px;
            // margin-bottom: 20px;
          }
          label {
            flex-shrink: 0;
            font-size: 15px;
            font-weight: bold;
            color: ${palette('text', 5)};
            margin-right: 20px;
            // margin-bottom: 20px;
          }

          input {
            background: #e0efdf;
            border-color: #e0e1e9;
            color: ${palette('text', 5)};
            pointer-events: none;
            // margin-bottom: 20px;
          }
        }

        .jobDocumentBtn {
          background-color: #ffffff;
          border-color: #19913d;
          color: #19913d;

          &:hover,
          &:focus {
            border-color: #19913d;
          }
        }
      }
    }
  }

  .paymentTableWrapper {
    margin-bottom: 25px;

    .paymentTable {
      width: calc(100% - 250px - 60px);
      margin-bottom: 30px;
      margin-right: 30px;
      @media (max-width: 1024px) {
        width: 100%;
      }
      .inner-scroll {
        overflow-x: auto;
      }
      .table-global{
        thead{
          tr{
            th{
              @media (min-width: 1799px) {
                font-size:15px !important;
              }
            }
          }
        }
        tbody{
          tr{
            td{
              text-align: left !important;
              padding: 0 10px !important;
              font-size:11px;
              @media (min-width: 1799px) {
                font-size:15px !important;
              }
            }
          }
        }
      }
    }
    .summary {
      width: 250px;
      margin-right: 30px;
      h3 {
        font-size: 11px;
        @media (min-width: 1799px) {
          font-size:15px !important;
        }
        @media (max-width: 992px) {
          font-size:15px;
        }
      }
      @media (max-width: 1024px) {
        width: 100%;
      }
      @media (max-width: 575px) {
        margin-right: 0px;
      }
    }
  }
`;

export const CardWrapper = styled.div`
  margin-bottom: 30px;
  .ant-card {
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  }
  .ant-card-body {
    padding: 20px;
  }
`;

export const CardBody = styled.div`
  h3 {
    border-bottom: 1px solid #b4b4c6;
    padding-bottom: 18px;
    font-size: 20px;
    font-weight: bold;
  }
  li {
    margin-top: 18px;
    font-weight: bold;

    a {
      display: flex;
      align-items: center;
      color: #2f2e50;
      font-size:11px;
      @media (min-width: 1799px) {
        font-size:15px !important;
      }


      strong {
        margin-left: auto;
      }
    }
  }
`;

export const StatusSpan = styled.span`
  width: 7px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(props) => props.color};
  display: inline-block;
  margin-right: 10px;
`;

export const ChooseDownloadSelect = styled(Select)`
  &.ant-select {
    width: 130px !important;
    // min-width:calc(100% - 45px) !important;
    // max-width:calc(100% - 45px) !important;

    .ant-select-selector {
      border-radius: 50px;
      height: 50px;
      padding: 0 13px;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-color: #19913d !important;
      width: 100% !important;
      min-width: 100% !important;
      @media only screen and (min-width: 768px) and (max-width: 1550px) {
        height:45px;
      }
      &:after {
        content: '';
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
      input {
        width: 100% !important;
        min-width: 100% !important;
        &:focus {
          box-shadow: none;
        }
      }
      // .ant-select-selection-search-input {
      //   height: 100%;
      // }
      .ant-select-selection-item,
      .ant-select-selection-placeholder {
        line-height: 48px;
        font-weight: bold;
        color: #2f2e50;
        opacity: 1;
        @media only screen and (min-width: 768px) and (max-width: 1550px) {
          line-height: 45px;
        }
      }
    }
  }
  .ant-select-arrow {
    display: none;
  }
`;

export const ChooseDownloadSelectDropdownWrapper = styled.div``;

export const ChooseDownloadSelectOptions = Select.Option;

export default WrappedJobPaymentWrapper;

