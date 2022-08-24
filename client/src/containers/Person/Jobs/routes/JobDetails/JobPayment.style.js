import styled from 'styled-components';
import { palette } from 'styled-theme';

const ContractorJobPaymentWrapper = styled.div`
  width: 100%;

  .paymentInfos {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    color: ${palette('text', 5)};
    &:last-child {
      margin-bottom: 0;
    }

    .paymentInfoLabel {
      font-size: 15px;
      font-weight: bold;
    }

    .paymentInfoDetails {
      .paymentWorkingDay {
        margin-left: 2px;
      }
    }
  }

  .totalPayWrapper {
    text-align: right;
    border-top: solid 1px #e8e8f1;
    padding: 10px 0;

    .totalPayLabel {
      font-size: 15px;
      font-weight: bold;
    }

    .totalPayAmount {
      font-size: 35px;
      font-weight: bold;
    }
  }
`;

export default ContractorJobPaymentWrapper;
