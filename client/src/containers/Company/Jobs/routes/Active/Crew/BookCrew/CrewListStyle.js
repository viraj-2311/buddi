import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CrewByPositionWrapper = styled.div`
  display: flex;
  flex-direction: ${(props) => (props['isMultipleCrew'] ? 'column' : 'row')};

  label.ant-checkbox-wrapper {
    width: auto !important;
    margin: 15px 10px;
  }

  &.bg-crewList {
    background-color: ${palette('grayscale', 12)};
    position: relative;
    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: -20px;
      width: 20px;
      height: 100%;
      background-color: ${palette('grayscale', 12)};
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -20px;
      width: 20px;
      height: 100%;
      background-color: ${palette('grayscale', 12)};
    }
  }
`;

export const BookCrewItemWrapper = styled.div`
  display: flex;
  width: 100%;
  .hide-checkbox {
    visibility: hidden;
  }
`;
