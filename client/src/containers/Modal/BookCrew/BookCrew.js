import React from 'react';
import {useSelector} from 'react-redux';
import Confirm from '../Confirm';
import Success from '../Success';

export default () => {
  const { confirm: {props: confirmProps} } = useSelector(state => state.Modal.bookCrew);

  return (
    <>
      <Confirm {...confirmProps} />
      <Success />
    </>
  );
}
