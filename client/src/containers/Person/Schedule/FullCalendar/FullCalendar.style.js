import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const WDContractorScheduleFullCalendarWrapper = styled('div')`
  .spinWrapper {
    text-align: center;
    padding: 30px 50px;
  }
`;

const ContractorScheduleFullCalendarWrapper = WithDirection(WDContractorScheduleFullCalendarWrapper);

export default ContractorScheduleFullCalendarWrapper;
