import styled from 'styled-components';
import { palette } from 'styled-theme';

const CrewItemWrapper = styled.div`
  &.crewItem {
    height: 50px;
    border: none;
    padding: 5px 0 !important;
    @media screen and (max-width: 1024px) {
      padding: 5px 10px;
    }
  }

  .draggableIndicator {
    position: absolute;
    left: 0;
    left: -15px;
  }

  .clickAwayArea {
    width: 100%;
    height: 100%;
    cursor: pointer;

    .editorWrapper {
      background: #ffffff;
      border: solid 1px #e0e1e9;
      border-radius: 5px;
      position: relative;

      .ant-input {
        height: 40px;
        padding: 0 10px;
        border: none;
        background: none;
        box-shadow: none;
        font-size: 14px;
      }

      .addCrewBtn {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 2;
      }
    }

    &.no-pointer-events {
      pointer-events: none;
    }
  }

  .declined {
    color: #2f2e50;
  }

  .crewNameWrapper {
    display: flex;
    align-items: center;
    position: relative;

    .acceptMessage {
      position: absolute;
      right: 0;
      transform: translate(calc(100% + 2px), -50%);
    }
  }

  .memoActionLink {
    font-size: 12px;
    color: #2f80ed;
    font-weight: bold;
    padding: 4px 12px;
    cursor: pointer;
    min-width: 105px;
    display: inline-block;
    text-align: center;

    img {
      width: 15px;
      height: 29px;
    }

    .crewPrice {
      font-size: 15px;
      font-weight: bold;
      color: ${palette('text', 5)};
      margin-left: 10px;
      text-decoration: none;
    }

    &.declinedDeal,
    &.declinedHold {
      background: #e25656;
      color: #ffffff;
      cursor: text;
      border-radius: 5px;
      cursor: pointer;
    }

    &.sentHold,
    &.sentDeal {
      background: #808bff;
      color: #ffffff;
      border-radius: 15px;
    }

    &.savedDeal {
      background: #bcbccb;
      color: #ffffff;
      border-radius: 15px;
    }

    &.createDeal {
      background: #51369a;
      color: #ffffff;
      border-radius: 15px;
    }

    &.createHold {
      background: #ffc06a;
      color: #ffffff;
      border-radius: 15px;
    }
  }

  .userDropdownItemWithAvatar {
    display: flex;
    flex-direction: row;
    align-items: center;

    .userAvatar {
      margin-right: 15px;

      img {
        width: 30px;
        height: 30px;
      }
    }

    .userInfo {
      .userStatus {
        color: ${palette('error', 0)};
        font-size: 12px;
        font-style: italic;
        line-height: 1.33;
      }
    }
  }

  .memoZone {
    background: #ffffff;
    border: solid 1px #e0e1e9;
    border-radius: 5px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    &.declined {
      background: #ffe4e4;
    }

    .placeholder {
      color: #bdbdbd;
    }
  }
`;

const AcceptanceLevelDiv = styled.div`
  &.acceptLevel {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 10px;
    font-size: 9px;
    font-weight: bold;
    text-align: center;
    line-height: 20px;
    color: #ffffff;

    background: ${(props) => props.color};
  }
`;
export default CrewItemWrapper;

export { AcceptanceLevelDiv };
