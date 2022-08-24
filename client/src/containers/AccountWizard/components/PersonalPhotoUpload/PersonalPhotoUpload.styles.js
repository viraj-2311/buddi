import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const PersonalPhotoUploadStyleWrapper = styled.div`
  .uploadWrapper {
    width: 100%;
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f7;
    border-radius: 10px;
    margin-bottom: 50px;
    @media (max-width: 767px) {
      padding: 1.5rem;
      button {
        width: auto;
      }
    }
  }

  .btnWrapper {
    text-align: center;
    @media (max-width: 767px) {
      display: flex;
    }
    button {
      &:first-child {
        margin-right: 0.5rem;
      }
      + button {
        margin-left: 0.5rem;
      }
    }
  }
`;

export default WithDirection(PersonalPhotoUploadStyleWrapper);
