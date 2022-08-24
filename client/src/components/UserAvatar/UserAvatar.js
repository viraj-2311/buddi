import PropTypes from 'prop-types';
import React from 'react';
import Icon from '@iso/components/icons/Icon';
import { NameAvatar, PictureAvatar } from './UserAvatar.styles';
import { toColor } from '@iso/components/utility/string';

const propTypes = {
  url: PropTypes.string,
  title: PropTypes.string.isRequired,
  size: PropTypes.number,
  active: PropTypes.bool
};
const DEFAULT_SIZE = 37;

const getAvartarFromTitle = (title) => title.slice(0, 2).toUpperCase();
const UserAvatar = ({
  url,
  title,
  size = DEFAULT_SIZE,
  shape = 'square',
  active
}) => {
  const circle = shape === 'circle';
  return (
    <div>
      {url && (
        <PictureAvatar circle={circle} active={active}>
          <Icon
            src={url}
            width={size}
            height={size}
            title={title}
            className='user-avatar'
          />
        </PictureAvatar>
      )}
      {!url && title && (
        <NameAvatar
          title={title}
          size={size}
          color={toColor(title)}
          circle={circle}
          active={active}
          className='user-avatar'
        >
          {getAvartarFromTitle(title)}
        </NameAvatar>
      )}
    </div>
  );
};
UserAvatar.propTypes = propTypes;
export default UserAvatar;
