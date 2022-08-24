import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';

const ProfileLayoutWrapper = styled.div`
  width: 100%;
  .left-menu {
    margin-bottom: 15px;
    width: 100%;
    @media only screen and (min-width: 768px) {
      min-width: 250px;
      max-width: 300px;
    }
  }
  .right-content {
    flex: 1;
    min-width: 300px;
    padding-left: 15px;
    padding-right: 15px;
  }
  .fieldLabel {
    display: block;

    &.required::after {
      content: '*';
      color: ${palette('error', 0)};
    }
  }

  .ant-select .ant-select-arrow {
    color: #bcbccb;
    right: 15px;
    left: inherit;
  }

  .helper-text {
    color: ${palette('error', 0)};
  }

  .section {
    margin-bottom: 30px;

    .sectionTitle {
      font-size: 18px;
      color: #333333;
      margin-bottom: 25px;
    }

    .sectionHead {
      font-size: 20px;
      font-weight: bold;
      color: #2f2e50;
    }
  }
  .side-nav {
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #d9d9e2;
    margin-bottom: 20px;
    overflow: hidden;

    .ant-card-body {
      padding: 0;
    }
    h2 {
      font-size: 30px;
      font-weight: bold;
      padding: 28px 30px 25px;
    }
    li {
      border-top: 1px solid #b4b4c6;
      a {
        display: block;
        font-size: 20px;
        color: #2f2e50;
        padding: 24px 30px;
        border-left: solid 5px transparent;
      }
      &.active a {
        font-weight: bold;
        border-color: #f48d3a;
        background-color: #fafbff;
      }
    }
  }
  .company-section {
    border-radius: 10px;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
    border: solid 1px #f0f0f7;
    text-align: center;
    padding: 6px 10px;
    img {
      max-width: 100%;
    }

    h3,
    p {
      color: #2f2e50;
      margin-bottom: 30px;
    }

    h3 {
      font-size: 20px;
      font-weight: bold;
      line-height: normal;
    }
    p {
      font-size: 15px;
    }
  }
`;

const ProfileLayoutContentWrapper = styled.div`
  padding: 30px;
  display: flex;
  flex-flow: row wrap;
  overflow: hidden;

  @media only screen and (max-width: 767px) {
    padding: 50px 20px;
  }

  @media (max-width: 580px) {
    padding: 15px;
  }
`;

export { ProfileLayoutContentWrapper };

export default WithDirection(ProfileLayoutWrapper);
