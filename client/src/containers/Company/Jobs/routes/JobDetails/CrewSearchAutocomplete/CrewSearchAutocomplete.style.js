import styled from 'styled-components';
import draggableImg from '@iso/assets/images/draggable.svg';

export const CrewSearchAutocompleteWrapper = styled.div`
  width: 100%;
  
  .inputSection {
    position: relative;
    > span {
      position: absolute;
      left: 10px;
      top: 18px;
      width: 16px;
      height: 16px;
      z-index: 1;
      svg {
        width: 100%;
        height: 100%;
      }
    }

    > input {
      padding-left: 30px;
    }
  }

  .searchSection {
    width: 100%;
    max-height: 450px;
    overflow: auto;
    border-radius: 5px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
    border: solid 1px #f0f0f7;
    background-color: #ffffff;
    margin-top: 10px;
    position: absolute;

    .sectionEnd {
      border-bottom: 1px solid #f0f0f7;
      width: 90%;
      margin: auto;
      margin-top: 10px;
    }

    .sectionTitle {
      margin: 20px 0px 10px 20px;
    }

    .sectionItem {
      &:hover {
        background-color: aliceblue !important;
      }
    }
  }

  .section {
    font-size: 15px;
    font-weight: bold;
    color: #2f2e50;
  }

  .userDropdownItemWithAvatar {
    margin-left: 10px;
    background: url(${draggableImg}) no-repeat center center;
    background-size: 10px;
    background-position: left;
    display: flex;
    flex-direction: row;
    align-items: center;

    .userAvatar {
      margin: 0px 10px;

      img {
        width: 35px;
        height: 35px;
      }
    }

    .userInfo {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;

      h4 {
        font-size: 13px;
        font-weight: bold;
        color: #2f2e50;
      }

      h6 {
        font-size: 11px;
        font-weight: normal;
        color: #2f2e50;
        line-height: normal;
      }
    }
  }
`;

export const VerticalLine = styled.div`
  height: 35px;
  margin-left: 10px;
  border-left: ${({ color }) => `4px solid ${color}`};
`;
