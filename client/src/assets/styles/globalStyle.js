import { createGlobalStyle } from 'styled-components';
import { palette, font } from 'styled-theme';
import 'antd/dist/antd.css';

const GlobalStyles = createGlobalStyle`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .logo {
    font-size: 32px;
    font-weight: 700;
    color: #fff;
  }
  
  .ant-modal-mask {
    background: rgba(47, 46, 80, 0.8) !important;
  }
  
  .ant-modal-wrap {
    &.hCentered {
      @media (min-width: 1400px) {
        // margin-left: 318px;
      }
    }
    &.ml-0{
      margin-left: 0px;
    }
    &.last-step-modal{
      .ant-modal{
        width:700px !important;
        @media (max-width: 768px) {
          width:95% !important;
        }
      }
    }
    &.waysToWrapModal {
      .ant-modal-content {
          .ant-modal-body {
              padding: 0;
          }
      }
    }
    &.noHeaderModal {
      .ant-modal-content {
          .ant-modal-body {
              padding: 0;
          }
      }
    }
    &.preivew-report-modal{
      .ant-modal{
        width:95% !important;
        .modal-content{
          padding:0;
        }
        .ant-modal-body{
          padding:0px;
          @media screen and (max-width: 767px) {
            .ant-col-6{
              order:1;
            }
            .ant-col-18{
              order:2;
            }
            .ant-col{
              flex: 0 0 100%;
              max-width: 100%;
            }
          }
          .report-show-outer{
            padding: 25px;
            background: #fff;
            border: 20px solid #bcbccb;
          .report-header{
            color:#fff !important;
            .logo-area{
              padding: 20px;
              background-color: #000;
              display:flex;
              align-items:center;
              height:100%;
              img{
                border-right: 1px solid #cfc7f1;
                padding-right: 15px;
              }
              h3{
                margin-left:20px;
                color:#fff;
                @media screen and (min-width: 1799px) {
                  font-size: 24px;
                }
              }
            }
            .right-address{
               background-color: #f48d3a;
                padding: 20px;
                text-align: right;
                height:100%;
                @media screen and (max-width: 767px) {
                  text-align: left;
                }
              h4{
                color:#fff;
                @media screen and (max-width: 992px) {
                  font-size: 12px;
                }
              }
              p{
                font-size:11px;
                @media screen and (max-width: 992px) {
                  font-size: 9px;
                }
                @media screen and (min-width: 1799px) {
                  font-size: 14px;
                }
              }
            }
            @media screen and (max-width: 767px) {
              .ant-col{
                flex: 0 0 100%;
                max-width: 100%;
              }
            }
          }
          .job-info-outer{
            background: #f0f0f7;
            padding: 15px;
            overflow-x: auto;
            table{
              width:100%;
              white-space: nowrap;
              tr{
                td{
                  font-size:11px;
                  font-weight:600;
                  color:#2f2e50 !important;
                  padding-right: 15px;
                  @media screen and (min-width: 1799px) {
                    font-size: 14px;
                  }
                  &.job-name-td{
                    width:90%;
                    font-weight:600;
                    span{
                      font-weight:500 !important;
                      margin-left: 10px;
                    }
                  }
                  &.crew-amount-td{
                    width:10%;
                    text-align:right;
                    color:#2f2e50 !important;
                    font-size:9px;
                    padding-right: 0px;
                    @media screen and (min-width: 1799px) {
                      font-size: 12px;
                    }
                    h5{
                      font-size:15px;
                      color:#2f2e50 !important;
                      font-weight:600;
                    }
                  }
                }
              }
            }
          }
          .report-main-table{
            overflow-x:auto;
            table{
              font-size:9px;
              width:100%;
              white-space: nowrap;
              border: 1px solid #e3e1e1;
              @media screen and (min-width: 1799px) {
                font-size: 14px;
              }
              thead{
                background-color:#000;
                color:#fff;
                font-weight:600;
                th{
                  padding:10px 8px;
                  &:first-child{
                    padding-left:15px;
                  }
                  &:last-child{
                    padding-right:15px;
                    text-align:right;
                  }
                }
              }
              tr{
                &:nth-child(even){
                  background-color:#f0f0f7;
                }
                td{
                  padding:10px 8px;
                  span{
                    display:block;
                  }
                  &:first-child{
                    padding-left:15px;
                  }
                  &:last-child{
                    padding-right:15px;
                    text-align:right;
                  }
                }
              }
            }
          }
          .report-footer{
            display:flex;
            width: 100%;
            justify-content: space-between;
            padding: 10px 0px;
            align-items: center;
            font-size:10px;
            @media screen and (min-width: 1799px) {
              font-size: 14px;
            }
            .footer-logo{
              img{
                padding-left:5px
              }
            }
            .footer-pagination{
              color: #2f2e50;
              font-weight:600;
            }
            
          }
         }
         .report-right-outer{
          .report-right-title{
            display:flex;
            width: 100%;
            justify-content: space-between;
            padding: 20px 25px 40px;
            align-items: center;
            border-bottom: 1px solid #bcbccb;
              @media screen and (max-width: 1024px) {
                padding: 15px 20px 25px;
              }
            h4{
              font-size: 20px;
              font-weight: bold;
              @media screen and (max-width: 1024px) {
                font-size: 18px;
              }
              @media screen and (max-width: 992px) {
                font-size: 14px;
              }
            }
            .modal-header{
              padding:0px;
            }
          }
          .pagination-action{
            display: flex;
            align-items: center;
            justify-content: center;
            margin:30px 0;
            .page-number-box{
              background-color: #fafbff;
              border: 1px solid #bcbccb;
              border-radius: 4px;
              padding: 15px 30px;
              font-size: 15px;
              margin: 0 10px;
              display:flex;
              align-items: center;
              justify-content: center;
              @media screen and (min-width: 1799px) {
                font-size: 20px;
              }
                @media screen and (max-width: 1024px) {
                  font-size: 12px;
                  padding: 10px 20px;
                  margin: 0 5px;
                }
                @media screen and (max-width: 992px) {
                  font-size: 12px;
                  padding: 10px 10px;
                  margin: 0 5px;
                }
              p{
                margin:0 3px;
                color: #2f2e50;
                &.active{
                  font-weight:600;
                }
              }
            }
            span{
              color: #2f2e50;
              font-size: 22px;
              margin: 0 3px;
              cursor: pointer;
              @media screen and (max-width: 1024px) {
                font-size: 18px;
              }
              &.disabled{
                color:#a7a7a9;
                cursor: no-drop;
              }
            }
          }
          .report-download-btn{
            width: 245px;
            height: 50px;
            margin: 30px auto;
            padding: 15px;
            border-radius: 100px;
            background-image: linear-gradient(to right,#c5370f -10%,#e17f08 112%);
            color: #fff;
            display: block;
            @media screen and (min-width: 1799px) {
              font-size: 20px;
            }
            @media screen and (max-width: 1024px) {
              width: 85%;
            }
          }
         }
        }
      }
    }
    &.requestInvoiceModal {
      margin: 20px;
      .ant-modal {
        width: 100% !important;
        max-width: 950px;
        margin: auto;
        .ant-modal-content {
          max-width: 950px;
          overflow: hidden;
          .ant-modal-body {
            overflow-x: auto;
            @media screen and (max-width: 992px) {
              padding: 0;            }
          }
        }
      }
    }
  }

  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: #f8f8f8!important;
  }

  .ant-row.ant-form-item {
    margin-bottom: 5px;
  }

  .has-success.has-feedback {
    .ant-select {
      .ant-select-selection {
        .ant-select-selection__rendered {
          .ant-select-selection__placeholder {
            display: none !important;
          }
        }
      }
    }
  }

  /*-----------------------------------------------*/ 
  // style for project category menu [ScrumBoard]
  /*-----------------------------------------------*/
  .project-category {
    .ant-select-dropdown-menu {
      .ant-select-dropdown-menu-item {
        padding: 8px 12px;
        color: #000000;
        font-family: 'Roboto';
        font-weight: 400;
      }
    }
  }

  /*-----------------------------------------------*/ 
  // style for project menu [ScrumBoard]
  /*-----------------------------------------------*/
  .ant-dropdown {
    &.project-menu {
      width: 280px;
      top: 133px !important;
      
      .ant-dropdown-menu {
        padding: 0;
        overflow: hidden;

        .ant-dropdown-menu-item {
          min-height: 54px;
          line-height: auto;
          display: flex;
          align-items: center;
          padding: 10px 20px;

          &:first-child {
            padding: 0;
            border-bottom: 1px solid #f4f6fd;

            &:hover,
            &:focus {
              background-color: #ffffff;
            }
          }

          &:hover,
          &:focus {
            background-color: #F3F5FD;
          }

          &:last-child {
            background-color: #E6EAF8;
          }
        }
      }
    }
  }

  /*-----------------------------------------------*/ 
  // style for popover [ScrumBoard]
  /*-----------------------------------------------*/
  .ant-popover {
    .ant-checkbox-group {
      display: flex;
      flex-direction: column;
      .ant-checkbox-group-item {
        margin: 5px 0;
        span {
          font-size: 14px;
          color: #788195;
          text-transform: capitalize;
        }
      }
    }
  }

  /*-----------------------------------------------*/ 
  // style for modal [ScrumBoard]
  /*-----------------------------------------------*/
  .ant-modal-wrap {
    .ant-modal {
      .ant-modal-content {
        border-radius:10px;
        .ant-modal-body {
          .render-form-wrapper {
            padding: 10px;
            h2 {
              margin: 0;
            }
            form {
              padding: 15px 0 3px;
              .field-container {
                margin-bottom: 26px;
              }
            }
          }
        }
      }
      /* @media (max-width: 991px) {
        width: calc(100% - 60px) !important;
      } */
    }
  }


/*-----------------------------------------------*/ 
  // style form previous GlobalStyles
  /*-----------------------------------------------*/

  .ant-table-thead > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr.ant-table-row-hover:not(.ant-table-expanded-row) > td, .ant-table-thead > tr:hover:not(.ant-table-expanded-row) > td, .ant-table-tbody > tr:hover:not(.ant-table-expanded-row) > td {
    background: #f8f8f8!important;
}

body {
  font-family: ${font('primary', 0)};
}

h1,
h2,
h3,
h4,
h5,
h6,
a,
p,
li,
input,
textarea,
span,
div,
img,
svg {
  &::selection {
    background: ${palette('primary', 0)};
    color: #fff;
  }
}

.ant-row:not(.ant-form-item) {
  &:before,
  &:after {
    display: none;
  }
}

.ant-row > div {
  padding: 0;
}

.isoLeftRightComponent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.isoCenterComponent {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
  content: unset !important;
}

.ant-form-item-label > label.ant-form-item-required:not(.ant-form-item-required-mark-optional)::after {
  display: inline-block;
  margin-right: 4px;
  color: #ff4d4f;
  font-size: 14px;
  font-family: SimSun, sans-serif;
  line-height: 1;
  content: '*';
}

.formGroup {
  margin-bottom: 20px;  
}

.fieldLabel {
  color: #868698;
  font-size: 13px;
  display: block;
  margin-bottom: 10px;
  
  i {
    font-size: 12px;
  }
}

.text-center {
  text-align: center;
}

.helper-text {
  color: ${palette('error', 0)};
  font-size: 12px;
  font-style: italic;
}

.mb-20{
  margin-bottom:20px;
}

:root {
  /* Toast styles */
  --toastify-color-success: #38923f;
}

  .table-global {
    width: 100%;
    height: 100%;
    thead {
      tr {
        th {
          background-color: #fff;
          padding: 18px 10px;
          border-bottom: 1px solid #e8e8f1;
        }
      }
    }
    tbody {
      tr {
        td {
          padding: 10px;
        }
      }
    }
  }
  .topbar-overlay-menu {
    .ant-drawer-header{
      .ant-drawer-close{
        color: white;
      }
      border: none;
      background: transparent;
    }
    .ant-drawer-content{
      .ant-drawer-wrapper-body {
        background-image: linear-gradient(to bottom,#2e2c6d,#5838a3 62%,#6b3dbc);
      }
      .ant-drawer-body{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 1rem;
      }
      .nav-text{
        color: white;
        font-size: 1.125rem;
        padding-left: 0.5rem;
      }
      .ant-menu{
        border: none;
        background: transparent;

      }
      .ant-menu-item{
        &.ant-menu-item-selected, 
        &.ant-menu-item-active{
          background-color: transparent;
          background-image: linear-gradient(to right,${palette('themebg', 0)},${palette('themebg', 1)});
          border-radius: 10px;
        }
        
        padding-left: 1rem;
      }
    }
  }

  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item-selected::after{
    border-bottom: 4px solid #f48d3a !important
  }
  .ant-menu-horizontal:not(.ant-menu-dark) > .ant-menu-item::hover{
    &:after{
      border-bottom: 4px solid #f48d3a !important
    }
  }

  .theme-gradient {
    background-color: transparent;
    background-image: linear-gradient(to right,#c5370f,#e17f08) !important;
  }

  .w-100{
    width:100%;
  }
  .w-50{
    width:50% !important;
  }
  .ant-input{
    &:focus{
      box-shadow:none !important;
    }
  }

  .ant-pagination-item-active{
    border-color: ${palette('themecolor', 0)} !important;
    a{
      color: ${palette('themecolor', 0)} !important;
    }
  }

  .ant-pagination-item:focus, .ant-pagination-item:hover{
    border-color: ${palette('themecolor', 0)} !important;
    a{
      color: ${palette('themecolor', 0)} !important;
    }
  }
  .ant-pagination-prev:hover .ant-pagination-item-link, .ant-pagination-next:hover .ant-pagination-item-link{
    border-color: ${palette('themecolor', 0)} !important;
    a{
      color: ${palette('themecolor', 0)} !important;
    }
  }
  .producersCompletedInvoice .ant-checkbox-checked .ant-checkbox-inner{
    background-color: #f48d3a !important;
    border-color: #f48d3a !important;
    &:after {
      background-color: #f48d3a !important;
      }
  }

  .producersCompletedInvoice .ant-checkbox-input:focus  + .ant-checkbox-inner,
  .producersCompletedInvoice .ant-checkbox-input:hover  + .ant-checkbox-inner {
    border-color: #f48d3a !important;
  }

  .ant-picker-cell-today,
  .ant-picker-cell-selected{
    .ant-picker-cell-inner{
      background-color:${palette('themecolor', 0)} !important;
      color:#fff !important;
      &:before{
        border-color:${palette('themecolor', 0)} !important;
      }
    }
  }
  .ant-picker-today-btn,
  .ant-picker-now-btn{
    color:${palette('themecolor', 0)} !important;
  }
  .ant-picker-ok{
    .ant-btn{
      background-color:${palette('themecolor', 0)} !important;
      border-color:${palette('themecolor', 0)} !important;
    }
  }
  .ant-picker-time-panel-cell-selected{
    .ant-picker-time-panel-cell-inner{
      background:rgba(244,141,58,0.2) !important;
    }
  }
  
/*------------css-for-radio-button--dots------*/
.ant-radio-wrapper,
ant-radio-button-wrapper{
	.ant-radio-inner{
		&:after{
			top: 2px !important;
			left: 2px !important;
			width: 10px !important;
			height: 10px !important;
      background-color: #f48d3a !important;
		}
	}
}

.registerWalletModal{
  width:75% !important;
  @media (min-width: 1140px) {
    width:50% !important;
  }    
} 


`;

export default GlobalStyles;
