import styled from 'styled-components';
import { palette } from 'styled-theme';
import WithDirection from '@iso/lib/helpers/rtl';



export const ErrorMessageDiv = styled.div`
  display: flex;
  display: flex;
  justify-content: flex-end;
  font-size: 13px;
  .cross-icon {
    font-size: 13px;
    align-self: center;
    margin: 0px 5px 1px 0px;
  }
`;

export const CardWrapper = styled.div`
.ant-select-focused.ant-select-single:not(.ant-select-customize-input) .ant-select-selector:not(.ant-select-disabled.ant-select-single:not(.ant-select-customize-input) .ant-select-selector){
  box-shadow:none !important;
  outline:none !important;
  border-color: #e17f08 !important;
}
input{
  &:focus,
  &:hover{
    box-shadow:none !important;
    outline:none !important;
    border-color: #e17f08 !important;
  }
}
  .width-limit {
    min-width: 220px;
    @media only screen and (max-width: 425px) {
      min-width: 280px;
    }
  }
  .width-selected-limit {
    min-width: 120px;
  }
  .helper-text.lowercase {
    display: flex;
    justify-content: flex-end;
    font-size: 13px;
    .cross-icon {
      font-size: 13px;
      align-self: center;
      margin: 0px 5px 1px 0px;
    }
  }
  .profileCard {
    border-radius: 10px;
    .ant-card-body {
      padding: 0;
    }
    /* .ant-select-arrow {
      color: #bcbccb;
      right: 15px;
      left: inherit;
    } */
  }

  .profileImageInformationSection {
    margin-bottom: 30px;
    .sectionHead {
      font-size: 25px;
      font-weight: bold;
      color: #2f2e50;
    }
  }

  .profileImageSection {
    margin-top: 35px;
  }

  .informationForm {
    margin-top: 18px;
    position: relative;
  }
  .section {
    margin-bottom: 0;
    .sectionHead {
      font-size: 20px;
      font-weight: normal;
      color: #2f2e50;
    }
  }
    .pp-hr{
      transform: translate(-5%, 0px);
      width: 112%;
      border-color: #e9e9e9 !important;
      text-shadow: none !important;
      box-shadow: none !important;
      background: no-repeat !important;
      margin: 35px 0 20px 0;

      opacity:0.4 !important;
    }
  }
`;

export const FormWrapper = styled.div`
  

  .p-profile-collapse{
    *{
      font-family: 'OpenSans', sans-serif;
      box-shadow:none;
      outline:none;
      &:focus,
      &:hover{
        box-shadow:none !important;
        outline:none !important;
      }
    }
    
    .ant-collapse{
      border:none;
      .ant-collapse-item{
        background-color: #fff;
        .ant-collapse-arrow {
          font-size: 15px;
          font-weight: 900;
          right:0;
        }
        &:last-child{
            border-bottom:none;
        }
        .ant-collapse-header{
          font-size:18px !important;
          font-weight: normal;
          font-stretch: normal;
          font-style: normal;
          line-height: normal;
          letter-spacing: normal;
          text-align: left;
          color: #2f2e50 !important;
          font-family: 'OpenSans',sans-serif;
          padding: 15px 0 !important;
        }
        .ant-collapse-content {
          border-top: none;
          .ant-collapse-content-box{
            margin-bottom:0px;
            padding: 0px 0px 16px;

            textarea{
              background: #fafbff;
              border: 1px solid #bcbccb;
              border-radius: 5px;
            }
          }
        }
      }
    }

    .remove-btn{
      .closeCircle{
        margin-top:0;
        color:#9697a7;
      }
      span{
        color:#2f2e50;
      }
    }
    // .edu-add-more{
    //   margin-top: -20px;
    // }
    .width-limit{
      margin-bottom:20px;
      @media screen and (max-width:574px){
        min-width:100%;
      }
    }
    .closeCircle {
      margin-top: 15px;
    }
    .width-selected-limit {
      @media screen and (max-width:574px){
        min-width: calc(100% - 45px);
        margin-bottom:20px;
      }
    }
    .wl-responsive{
      @media screen and (max-width:574px){
        min-width: calc(100% - 45px);
        margin-bottom:20px;
      }
    }
    .ant-row{
      @media screen and (max-width:574px){
        row-gap: 0 !important
      }
    }
  }

  .disableResize {
    resize: none;
  }

  .infoText {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      margin-right: 5px;
    }
  }

  .infoMarginTop {
    margin-top: 25px;
  }

  .infoOneRow {
    margin-bottom: 30px;
    margin-top: -10px;
  }
`;

const PersonaProfileWrapper = styled.div`
  .submit-btn-wrapper {
    margin-top: 30px;
    display: flex;
    justify-content: start;
    @media screen and (max-width:575px){
     display:block;
    }
    button:first-child {
      margin-right: 15px;
    }
  }
  .settingsSectionCollapse {
    .settingsSectionPanel {
      margin-bottom: 30px;
      border: none;

      .ant-collapse-header {
        font-size: 18px;
      }
    }
  }

  .actionRow,
  .moreInfoActionRow {
    margin-top: 10px;
    button {
      min-width: 141px;
      margin-right:15px;
      @media screen and (max-width:575px){
        margin-right:0px;
        min-width:100%;
        margin-bottom:15px;
      }
    }
      .ant-col{
        @media screen and (max-width:575px){
         width:100%;
        }
      }
  }

  .infoCircle {
    color: ${palette('primary', 0)};
  }

  .add-more {
    margin-bottom: 25px;
    .addBtn {
      color: ${palette('primary', 0)};
    }
  }

  .closeCircle {
    color: #9697a7;
    margin-top: 28px;
    margin-left: 15px;
  }

  .muted {
    font-size: 10px;
    color: #828282;

    &.align-right {
      text-align: right;
    }
  }

  .ant-collapse-borderless {
    background: none;
    margin-bottom: 40px;
    > .ant-collapse-item > .ant-collapse-header {
      padding: 24px 40px 16px 0px;
      font-size: 20px;
      .ant-collapse-arrow {
        left: auto;
        right: 0;
        svg {
          height: 16px;
          width: 16px;
          transform: rotate(90deg) !important;
        }
      }
    }

    > .ant-collapse-item-active > .ant-collapse-header .ant-collapse-arrow {
      svg {
        transform: rotate(-90deg) !important;
      }
    }
    .ant-collapse-content > .ant-collapse-content-box {
      /* padding-left: 0; */
      /* padding-right: 0; */
      padding: 0;
      .ant-input {
        border-radius: 5px;
        border: solid 1px #bcbccb;
        background-color: #fafbff;
      }
    }
  }
`;
export const RemoveButton = styled.div`
  justify-content: flex-end;
  align-content: end;
  align-items: end;
  display: flex;
  width: 100%;
  margin-right: 20px;
`;

export default WithDirection(PersonaProfileWrapper);
