import React from 'react';
import moment from 'moment';

function inFutureText(val, unit) {
  return `in ${val} ${unit}`;
}

function inPastText(val, unit) {
  return `${val} ${unit} ago!`;
}
const secondLong = 1000;
const minuteLong = 60*secondLong;
const hourLong = minuteLong*60;

// red: overdue. yellow: due within 1min. green: due > 1min later.
const dueSoonThreshold = minuteLong * 2;
const dueSoonClassName = (timeFromNow) => {
  if (timeFromNow <= 0)
    return 'overdue';
  else if (timeFromNow > 0 && timeFromNow < dueSoonThreshold)
    return 'due-soon';
  else
    return 'due-later'; 
};
const showOrder = (filterClass, timeFromNow) => {
  // filterClass: 'overdue', 'due-soon', or 'due-later'
  return filterClass === 'all' || dueSoonClassName(timeFromNow) === filterClass;
};
const fadeInterval = 300;

export default class Order extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      etaFromNow: '',
      removingClass: ''
    };
    this.removeOrder = this.removeOrder.bind(this);
  }

  removeOrder(orderId) {
    // allow time for fading gracefully
    let self = this;
    return () => {
      // self.setState({
      //   removingClass: 'removing'
      // });
      // setTimeout(() => {
      //   self.props.removeOrder(orderId);
      // }, fadeInterval + 250);
      self.props.removeOrder(orderId);
    };
  }

  componentDidMount() {
    var self = this;
    this.setState({
      etaFromNow: moment(this.props.eta, 'x').fromNow()
    });
    let interval = setInterval(() => {
      // update eta from now every second
      var now = Date.now();
      var diff = this.props.eta - now; // time from now
      var val;
      var unit;
      // count down for seconds + minutes from now
      if (Math.abs(diff) < minuteLong) {
        val = Math.abs(Math.floor(diff / secondLong));
        unit = val === 1 ? 'second' : 'seconds';
      } else if (Math.abs(diff) < hourLong) {
        val = Math.abs(Math.floor(diff / minuteLong));
        unit = val === 1 ? 'minute' : 'minutes';
      }
      self.setState({
        etaFromNow: diff > 0 ?
          inFutureText(val, unit) :
          inPastText(val, unit),
        diff: diff
      });
    }, 1000);
    this.setState({
      interval: interval
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
  }

  render() {
    // eta given by unix ms timestamp, to be processed by moment.js
    let etaFormatted = moment(this.props.eta, 'x').format('h:mma');
    return (
      <div className={dueSoonClassName(this.state.diff) +
        ' order ' +
        (this.state.removingClass) + ' ' +
        (showOrder(this.props.filter, this.state.diff) ? 'visible' : 'hidden')}>
        <span className="column order-no">{this.props.number}</span>
        <span className="column pickup">
          <div className="time">{etaFormatted}</div>
          <div className={dueSoonClassName(this.state.diff) + ' due'}>{this.state.etaFromNow}</div>
        </span>
        <span className="column customer">
          {this.props.customer}
        </span>
        <span className="column address">
          {this.props.address}
        </span>
        <span className="column courier">
          {this.props.courier}
        </span>
        <span className="column action-btn" onClick={this.removeOrder(this.props.id)}>
          PICKED UP &#x2713;
        </span>
      </div>
    );
  }
};

Order.propTypes = {
  filter: React.PropTypes.string.isRequired,
  id: React.PropTypes.number.isRequired,
  number: React.PropTypes.string.isRequired,
  customer: React.PropTypes.string.isRequired,
  address: React.PropTypes.string.isRequired,
  courier: React.PropTypes.string.isRequired,
  eta: React.PropTypes.number.isRequired
};