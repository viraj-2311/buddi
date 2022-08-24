import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';
import bgImage from '@iso/assets/images/buddi-band-large-bg.webp';

const EmailVerificationStyleWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: url(${bgImage}) no-repeat center center;

  &:before {
    content: '';
    width: 100%;
    height: 100%;
    display: flex;
    position: absolute;
    z-index: 1;
    top: 0;
    left: ${(props) => (props['data-rtl'] === 'rtl' ? 'inherit' : '0')};
    right: ${(props) => (props['data-rtl'] === 'rtl' ? '0' : 'inherit')};
  }

  .isoEmailVerificationText {
    font-size: 30px;
    color: #ffffff;
  }
`;

export default WithDirection(EmailVerificationStyleWrapper);
