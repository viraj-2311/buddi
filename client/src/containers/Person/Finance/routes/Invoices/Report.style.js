import styled from 'styled-components';
import { palette } from 'styled-theme';

const FinanceReportWrapper = styled.ul`
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  border: 1px solid ${palette('border', 10)};
  box-shadow: 1px 5px 5px 0 ${palette('border', 10, 0.15)};
  border-radius: 10px;
  overflow: hidden;

  li {
    flex: 1;
    border-left: 1px solid ${palette('border', 0)};
    cursor: pointer;
    margin-left: -1px;
    
    &:first-child {
      border: none;
    }
    @media (max-width: 767px) {
      min-width: 50%;
      &:first-child {
        min-width: 100%;
      }
    }

    @media (max-width: 480px) {
      min-width: 100%;
    }
  }
`;

const WidgetBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  padding: 20px;
  background-color: #ffffff;
  overflow: hidden;

  .isoColorIndicator {
    display: flex;
    width: 4px;
    margin: 0px 10px 0px 0px;
    flex-shrink: 0;
  }

  .isoWidgetText {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 5px;

    .isoWidgetLabel {
      font-size: 13px;
      font-weight: bold;
      color: ${palette('text', 5)};
    }

    .isoWidgetPrice {
      font-size: 30px;
      font-weight: bold;
      margin: 0 0 4px;
      color: ${palette('text', 5)};
      @media (max-width: 767px) {
        font-size: 24px;
      }
    }
  }
`;

export { WidgetBox };

export default FinanceReportWrapper;
