import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';

const ChooseWaysToWrapNPayModalContainer = styled(Modal)`
    .modal-header {
        padding: 15px 20px;
        position: relative;
        text-align: right;
    }
    .modal-content {
        padding: 0 30px 20px;
        .heading {
            margin-bottom: 25px;
            display: block;
            text-align: center;
            .title {
                margin-bottom: 5px;
                font-size: 20px;
                color: #2f2e50;
                font-weight: bold;
                line-height: normal;
            }
            .desc {
                color: #868698;
            }
        }
        .radio-wrap {
            display:block;
            max-height: 380px;
            overflow: hidden;
            overflow-y: auto;
            @media screen and (max-width: 480px) {
                max-height: 320px;
            }
            label {
                display: flex;
                cursor: pointer;
                font-weight: 500;
                position: relative;
                overflow: hidden;
                margin-bottom: 0.375em;
                &:last-child {
                    span {
                        margin-bottom: 0;
                    }
                }
                input {
                    position: absolute;
                    left: -9999px;
                    &:checked + span {
                        background-color: #f5f5f5;
                        &:before {
                            box-shadow: inset 0 0 0 0.4375em #2f2e50;
                        }
                    }
                }
                span {
                    display: flex;
                    align-items: center;
                    padding: 10px 20px;
                    border-radius: 5px;
                    transition: 0.25s ease;
                    border: 1px solid #ebebeb;
                    margin-bottom: 10px;
                
                    &:hover {
                        background-color: #e7e7e7;
                    }
                    &:before {
                        display: flex;
                        flex-shrink: 0;
                        content: "";
                        background-color: #fff;
                        width: 1.5em;
                        height: 1.5em;
                        border-radius: 50%;
                        margin-right: 0.375em;
                        transition: 0.25s ease;
                        box-shadow: inset 0 0 0 0.125em #2f2e50;
                    }
                    .radio-content {
                        padding-left: 20px;
                        .title {
                            font-size: 14px;
                            font-weight: bold;
                            margin-bottom: 10px;
                        }
                        .desc {
                            font-size: 12px;
                            color: #868698;
                        }
                    }
                }
            }
        }
    }
    .modal-footer {
        padding: 20px;
        border-top: 1px solid #f5f5f5;
        .actions-btn {
            display: flex;
            justify-content: center;
            aling-items: center;
            .cancelBtn {
                margin-right: 10px;
            }
            .continueBtn {
                background-color: #1a913e;
                color: #fff;
            }
            .cancelBtn , .continueBtn {
                padding: 15px 30px;
                height: 100%;
                min-width: 150px;
                @media screen and (max-width: 375px) {
                    min-width: unset;
                }
            }
        }
    }
`;

export default ChooseWaysToWrapNPayModalContainer;
