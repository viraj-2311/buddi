import styled from 'styled-components';
import bgImage from '@iso/assets/images/buddi-band-with-bg.webp';

const LogoWrapper = styled.div`
  width: 100%;
  height: 100%;
  min-width: 375px;
  background: url(${bgImage}) no-repeat top center;
  background-size: cover;
  @media only screen and (max-width: 767px) {
    height: 35vh;
  }
`;

export default LogoWrapper;
