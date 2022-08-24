import Modal from '@iso/components/Feedback/Modal';
import styled from 'styled-components';

const JobReinstateMultipleModal = styled(Modal)`
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

export default JobReinstateMultipleModal;
