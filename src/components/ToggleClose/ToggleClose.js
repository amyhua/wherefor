import React from 'react';

export default class ToggleClose extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let closedClassName = this.props.closed ? 'closed' : 'open';
    return (
      <div className="toggle-close">
        <div className={`close-btn ${closedClassName}`} onClick={this.props.onToggleClose}></div> 
      </div>
    );
  }
};

ToggleClose.propTypes = {
  onToggleClose: React.PropTypes.func.isRequired,
  closed: React.PropTypes.bool.isRequired
};