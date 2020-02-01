import React from 'react';
import Avatar from './avatar.js';

const style = {
  maxWidth: '70%',
}

const myStyle = {
  maxWidth: '70%',
  marginLeft: '30%',
}

const otherStyle = {
  maxWidth: '70%',
}

export default (props) => {
  console.log(props);
  const mine = props.from.isMe;

  return (
    <div 
      className={
        "message-container " + 
          (mine ? 'from-me' : 'from-other')
      }
      style={mine ? myStyle : otherStyle}
    >
      <div
        className={
          mine ? 'float-right' : 'float-left'
      }>
        <Avatar>{props.from.avatar}</Avatar>
      </div>
      <div className="message">{props.children}</div>
    </div>
  );
};
