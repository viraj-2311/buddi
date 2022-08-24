import React, { useEffect, useRef } from 'react';

const ClickAwayListener = ({ onClickAway, noClickArea, children, ...rest }) => {
  const ref = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // eslint-disable-next-line
  }, []);

  const handleClickOutside = (event) => {
    if (noClickArea && noClickArea.contains(event.target)) return;
    if (ref && ref.current.contains(event.target)) return;

    onClickAway();
  };

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
};

export default ClickAwayListener;
