import styled from 'styled-components';
import { palette } from 'styled-theme';

const AntBadge = ComponentName => styled(ComponentName)`
  &.ant-badge {
    .ant-badge-count {
      min-width: 35px;
    }
  }
`;

export default AntBadge;
