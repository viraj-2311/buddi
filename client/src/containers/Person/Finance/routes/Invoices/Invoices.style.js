import React from 'react';
import styled from 'styled-components';
import { palette } from 'styled-theme';
import { Modal } from 'antd';
const AntModal = (props) => <Modal {...props} />;

const ContractorInvoicesWrapper = styled.div`
  width: 100%;
  padding: 20px 25px;

  .pageTitle {
    font-size: 25px;
    font-weight: bold;
    color: #2f2e50;
  }

  .financeReportWrapper {
    margin-top: 20px;
  }

  .totalPaidWidget {
    min-width: 260px;
    .totalPaidWidgetLabelWrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .paidMonthDropdown {
      width: 110px;

      .ant-select-selector {
        border-radius: 10px;
        height: 25px;
      }

      @media (max-width: 567px) {
        width: 100px;
      }
    }
  }

  .invoiceListWrapper {
    margin-top: 15px;

    .actionWrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      flex-wrap: wrap;

      @media (max-width: 567px) {
        .ant-radio-group {
          width: 100%;
        }
      }
      @media (max-width: 991px) {
        flex-direction: column;
        align-items: start;
      }

      .sortBy {
        width: 196px;
        margin-bottom: 10px;

        .ant-select-selector {
          border-radius: 25px;
        }
      }
    }

    .ant-radio-button-wrapper {
      @media (max-width: 567px) {
        min-width: 50%;
      }
      height: 35px;
      line-height: 35px;
    }
    .request-invoice {
      min-width: 300px;
    }
  }
`;

const LocationSpan = styled.span`
  display: flex;
  align-items: center;
  svg {
    margin-right: 10px;
  }
`;

const TotalInvoice = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const ActionDiv = styled.div`
  svg {
    height: 25px;
    width: 25px;
    color: #2f2e50;
  }
`;

const FilterAction = styled.div`
  @media (max-width: 567px) {
    width: 100%;
    .sortBy,
    button.ant-btn {
      width: 100% !important;
    }
    .createInvoice {
      margin: 0 10px 10px 0;
    }
  }

  .createInvoice {
    width: 196px;
    margin-right: 20px;
    margin-bottom: 10px;
  }

  @media (max-width: 991px) {
    margin-top: 20px;
  }
`;

const LeftActionDiv = styled.div`
  margin-left: -16px;
  display: flex;

  .ant-btn.ant-btn-circle {
    color: #2f2e50;
    margin-right: 14px;
    background: #f5f7fa;
    border: none;
    width: 35px;
    height: 35px;
    min-width: 0;
    &:last-child {
      margin-right: 0;
    }
  }
`;

const NoUnPaidInvoiceDiv = styled.div`
  text-align: center;
  padding: 200px 30px;
  margin: 20px 0;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;

  h2 {
    font-size: 25px;
    color: #2f2e50;
    font-weight: bold;
    margin-top: 30px;
  }
  img {
    width: 100%;
    max-width: 296px;
  }
`;
const InvoicePreviewModal = styled(AntModal)`
  .ant-modal-content {
    border-radius: 10px;
  }

  .ant-modal-body {
    padding: 0;
    background: ${palette('color', 14)};
    color: ${palette('text', 0)};
    max-height: 1200px;
    overflow-y: auto;
    border-radius: 10px;
  }
`;
export {
  LocationSpan,
  TotalInvoice,
  FilterAction,
  ActionDiv,
  LeftActionDiv,
  InvoicePreviewModal,
  NoUnPaidInvoiceDiv,
};

export default ContractorInvoicesWrapper;
