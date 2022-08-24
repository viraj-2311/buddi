import styled from 'styled-components';
import { palette } from 'styled-theme';

export const CompanyAutocompleteWrapper = styled.div`
  width: 100%;

  .inputSection {
    position: relative;
    > span {
      position: absolute;
      right: 15px;
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
      padding-left: 15px;
    }
  }

  .searchSection {
    position: absolute;
    left: 0;
    margin-top: 10px;
    width: 100%;
    overflow: auto;
    max-height: 340px;
    border-radius: 5px;
    border: solid 1px #f0f0f7;
    background-color: #ffffff;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12),
      0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);

    .sectionTitle {
      margin: 20px 0px 10px 20px;
    }

    .searchSectionItem {
      padding: 20px 0;
      position: relative;
      display: block;

      &:not(:first-child)::before {
        position: absolute;
        left: 20px;
        top: 0;
        right: 20px;
        content: '';
        border-top: 1px solid #f0f0f7;
      }
      &:hover {
        background-color: aliceblue !important;
      }
    }
    .noRecordDiv {
      padding: 10px;
    }
  }
  .companyDropdownItemWithAvatar {
    margin-left: 10px;
    background-size: 10px;
    background-position: left;
    display: flex;
    flex-direction: row;
    align-items: center;

    .companyAvatar {
      margin-right: 20px;

      .isoCompanyLogoWrapper {
        border-radius: 4px;
        background-color: ${palette('background', 3)};
        padding: 2px;
        display: flex;
        border: 1px solid #f0f0f7;
        overflow: hidden;

        &.isoCompanyImage {
          background: white;
        }
      }
    }

    .companyTitle {
      overflow: hidden;
      justify-content: center;
      height: 35px;
      width: 35px;
      align-items: center;
      display: flex;
      color: ${palette('text', 10)};
      font-weight: bold;
    }

    .companyInfo {
      display: flex;
      width: 100%;
      justify-content: space-between;
      align-items: center;

      h4 {
        font-size: 15px;
        font-weight: bold;
        color: #2f2e50;
      }
    }
  }
`;
