import React from 'react';
import './styles.css';

const style = {
  fontSize: '1.7em',
  float: 'left',
}

export default (props) => {
  return (
    <div 
      className="avatar"
      style={style}
    >{props.children}</div>
  );
};

