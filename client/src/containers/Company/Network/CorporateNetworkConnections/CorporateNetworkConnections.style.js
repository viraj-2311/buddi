import styled from 'styled-components';
export const CorporateNetworkConnectionsWrapper = styled.div`
  padding: 40px;
  background: #f5f7fa;
  @media only screen and (max-width: 767px) {
    padding: 15px;
  }
`;

export const NoConnectionDiv = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 40px 30px;
  border-radius: 10px;
  background-color: #ffffff;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;
  margin-bottom: 30px;

  .logo-view {
    justify-content: center;
    display: flex;
    text-align:center;
    @media only screen and (max-width: 767px) {
      margin-top: 30px;
      justify-content: center;
      display: flex;
    }
    img {
      width: 100%;
      max-width: 220px;
    }
  }

  .ant-row {
    align-items: center;
    width: 100%;
  }

  h2,
  p {
    color: #2f2e50;
  }

  h2 {
    font-weight: bold;
    font-size: 20px;
    margin-bottom: 20px;
  }

  p {
    font-size: 15px;
    line-height: 1.33;
  }
`;

export const ConnectionListDiv = styled.div`
  margin-bottom: 30px;
  border-radius: 10px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
  border: solid 1px #e8e8f1;
  overflow: hidden;
  padding-bottom: 10px;

  .connectionHeader {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: center;
    background-color: #ffffff;
    padding: 35px 35px;

    .connectionListSortBy {
      display: flex;
      align-items: center;
      strong {
        color: #2f2e50;
        line-height: 1.5715;
        margin: 0 5px;
      }
      svg {
        position: relative;
        top: -2px;
      }
    }
  }

  .connectionListContent {
    flex: 1;
    .ant-spin {
      width: 100%;
      margin: 25px 0 20px;
    }
  }

  h2,
  p {
    color: #2f2e50;
  }
  h2 {
    font-size: 25px;
    font-weight: bold;
  }
  p {
    font-size: 15px;
  }

  .searchSection {
    min-width: 250px;
    @media only screen and (max-width: 767px) {
      width: 100%;
      min-width: 150px;
    }
    .ant-input-affix-wrapper {
      background-color: #fff;
    }
    .ant-input-prefix {
      margin-right: 6px;
    }
  }

  .connectionListTitle {
    padding-right: 20px;
    @media only screen and (max-width: 767px) {
      width: 100%;
      margin-bottom: 15px;
    }
  }
`;

export const ConnectionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10px 25px;
  @media only screen and (max-width: 767px) {
    padding: 10px 15px;
  }
`;

//  DON'T REMOVE BELOW COMMENT --- this company network crew section is no used now, we may need this in a future

// export const CompanyNetworkCrew = styled.div`
//   padding: 30px 30px 0;
//   border-radius: 10px;
//   box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
//   border: solid 1px #e8e8f1;
//   background-color: #ffffff;
//   overflow: hidden;
//   margin-top: 30px;

//   .network-crew-header {
//     display: flex;
//     justify-content: space-between;
//     align-items: center;
//     h2,
//     a {
//       font-weight: bold;
//       color: #2f2e50;
//     }
//     h2 {
//       font-size: 25px;
//     }

//     a {
//       font-size: 15px;
//     }
//   }

//   .swiper-slider {
//     margin: 34px -8px 44px -8px;
//     .swiper-container {
//       padding: 0 50px;
//       max-width: 100%;
//       &:before,
//       &:after {
//         content: '';
//         position: absolute;
//         width: 44px;
//         height: 100%;
//         left: -1px;
//         top: 0;
//         background-color: #ffffff;
//         z-index: 2;
//       }
//       &:after {
//         left: auto;
//         right: -1px;
//       }
//       .swiper-button-next,
//       .swiper-button-prev {
//         color: #2f2e50;
//         outline: none;
//         left: 0;
//         text-align: center;
//         width: 30px;
//         height: 30px;
//         background-color: #5c4da0;
//         border-radius: 50px;
//         opacity: 1;

//         &:after {
//           width: 0;
//           height: 0;
//           font-size: 0;
//           border-top: 7px solid transparent;
//           border-bottom: 7px solid transparent;
//           border-right: 7px solid #fff;
//           border-left: 0px solid transparent;
//         }
//         &.swiper-button-disabled {
//           background-color: #e0e1e9;
//         }
//       }

//       .swiper-button-next {
//         left: auto;
//         right: 0;
//         &:after {
//           border-left: 7px solid #fff;
//           border-right: 0px solid transparent;
//         }
//       }

//       .swiper-button-prev {
//         &:after {
//           margin-right: 1px;
//         }
//       }

//       .swiper-slide {
//         .ant-card {
//           color: #2f2e50;
//           padding: 25px 35px 40px;
//           border-radius: 10px;
//           box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.04);
//           border: solid 1px #e8e8f1;
//           background-color: #ffffff;
//           text-align: center;
//           position: relative;
//           overflow: hidden;
//           &:before {
//             content: '';
//             position: absolute;
//             width: 100%;
//             height: 70px;
//             top: 0;
//             left: 0;
//             z-index: 0;
//             background-image: linear-gradient(
//               to bottom,
//               #2e2c6d,
//               #5838a3 62%,
//               #6b3dbc
//             );
//           }
//           * {
//             flex-wrap: wrap;
//             padding: 0;
//             justify-content: center;
//           }
//           .ant-card-body {
//             position: relative;
//             padding: 0;
//           }
//         }
//       }
//     }
//   }
// `;
