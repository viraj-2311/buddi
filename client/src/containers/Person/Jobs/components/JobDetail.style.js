import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const WDJobDetailWrapper = styled.div`
  width: 100%;

  .divider {
    margin: 15px -20px;
    border: 2px solid #e0e0e0;
  }

  .jobInfoWrapper {
    .jobInfoHead {
      display: inline-block;
      font-size: 18px;
      font-weight: 600;
      color: #333333;
      min-width: 378px;
      background-color: #f2f2f2;
      padding: 10px 35px;
      margin-bottom: 15px;
    }

    .jobInfos {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .infoLabel {
        position: relative;
        min-width: 130px;
        margin-right: 25px;
        text-align: right;

        &::after {
          content: ':';
          position: absolute;
          right: -10px;
        }
      }

      .infoDetails {
        text-align: left;
      }
    }
  }
`;

const AcceptanceLevelSpan = styled.span`
  &.levelNumber {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 5px;
    font-size: 10px;
    text-align: center;
    line-height: 24px;
    color: #ffffff;

    background: ${(props) => props.color};
  }
`;

const JobDetailWrapper = WithDirection(WDJobDetailWrapper);

export default JobDetailWrapper;
export { AcceptanceLevelSpan };
