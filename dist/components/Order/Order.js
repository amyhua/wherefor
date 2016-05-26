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
const dueSoonThreshold = minuteLong;
const dueSoonClassName = (diff) => {
  if (diff <= 0)
    return 'overdue';
  else if (diff > 0 && diff < dueSoonThreshold)
    return 'due-soon';
  else
    return 'due-later'; 
}
export default class AndoApp extends React.Component {
  constructor() {
    super();
    this.state = {
      etaFromNow: ''
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
    var etaFormatted = moment(this.props.eta, 'x').format('h:mma')
    
    return (
      <div className={dueSoonClassName(this.state.diff) + ' order'}>
        <span className="order-no">{this.props.number}</span>
        <span className="pickup">
          <div className="time">{etaFormatted}</div>
          <div className={dueSoonClassName(this.state.diff) + ' due'}>{this.state.etaFromNow}</div>
        </span>
        <span className="customer">
          {this.props.customer}
        </span>
        <span className="address">
          {this.props.address}
        </span>
        <span className="courier">
          {this.props.courier}
        </span>
        <span className="action-btn">
          <a href="#">&#x2713;</a>
        </span>
      </div>
    );
  }
}
