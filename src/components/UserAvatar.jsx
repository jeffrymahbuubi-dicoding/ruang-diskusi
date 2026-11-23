import React from 'react';
import PropTypes from 'prop-types';

function UserAvatar({ name, avatar = '', size = 40 }) {
  if (!avatar) {
    return (
      <span
        className="user-avatar user-avatar--empty"
        role="img"
        aria-label={`Avatar ${name}`}
        style={{ width: size, height: size }}
      >
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      className="user-avatar"
      src={avatar}
      alt={`Avatar ${name}`}
      width={size}
      height={size}
    />
  );
}

UserAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  size: PropTypes.number,
};

export default UserAvatar;
