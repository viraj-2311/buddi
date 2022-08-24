import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const ContractorProfileWrapper = styled.div`
  .createCompanyText {
    font-size: 18px;
    margin-bottom: 25px;

    .createCompanyBtn {
      margin-left: 15px;
      border-radius: 22px;
    }
  }

  .hintWord {
    color: ${palette('error', 0)};
  }

  .settingsSectionCollapse {
    .settingsSectionPanel {
      margin-bottom: 30px;
      border: none;

      .ant-collapse-header {
        font-size: 18px;
      }
    }
  }
`;

export default WithDirection(ContractorProfileWrapper);
