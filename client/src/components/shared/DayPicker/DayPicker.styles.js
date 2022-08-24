import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const DayPickerStyleWrapper = styled.div`
  position: relative;

  .ant-radio-group {
    width: 100%;
    text-align: center;
  }

  .daypickerwrapper {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    text-align: center;
    max-width: 300px;

    .ant-radio-group {
      .ant-radio-button-wrapper {
        font-size: 13px;
      }
    }
  }

  .ant-input-affix-wrapper {
    height: 50px;
  }

  .DayPicker-wrapper {
    overflow: hidden;
    vertical-align: top;
    background: #fff;
    border-radius: 2px;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
    transition: margin 0.3s;

    .DayPicker-Day {
      line-height: 18px;
    }
  }
`;

export const DayPickerSection = styled.div`
  position: relative;

  .DayPicker {
    .DayPicker-wrapper {
      padding-bottom: 60px;
    }
  }
`;

export const ActionDiv = styled.div`
  position: absolute;
  width: 100%;
  bottom: 20px;
  .doneBtn {
    height: 40px;
  }
`;

export default WithDirection(DayPickerStyleWrapper);
