import styled from 'styled-components';
import { palette } from 'styled-theme';

const InvoiceStatusWrapper = styled.div`
  display: inline-block;
  margin: 0 10px 10px 0;
  border-radius: 5px;
  font-size: 13px;
  font-weight: bold;
  color: #ffffff;
  text-transform: capitalize;
  background-color: ${(props) => props.lightColor || palette('primary', 0)};
  overflow: hidden;

  span {
    display: inline-block;
    white-space: nowrap;
    padding: 5px 8px;
    &.count {
      background-color: ${(props) => props.darkColor || 'rgba(0, 0, 0, 0.45)'};
    }
  }
`;

export default InvoiceStatusWrapper;
