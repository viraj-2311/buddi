import styled from 'styled-components';
import WithDirection from '@iso/lib/helpers/rtl';

const PersonalProfileStyleWrapper = styled.div`
  .titleDescription {
    text-align: center;
  }

  .actionBtnWrapper {
    padding-top: 2.5rem;
    text-align: center;
    margin-top: 30px;

    button {
      &:first-child {
        margin-right: 0.5rem;
      }
      + button {
        margin-left: 0.5rem;
      }
    }
    @media (max-width: 767px) {
      display: flex;
      justify-content: center;
    }
  }
`;

export default WithDirection(PersonalProfileStyleWrapper);
