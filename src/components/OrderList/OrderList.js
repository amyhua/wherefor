import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Order from '../Order/Order';

export default class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: 'all'
    };
    this.filter = this.filter.bind(this);
  }

  filter(orderType) {
    // add 'hidden' class to all order besides those of `orderType`
    return () => this.setState({
      filter: orderType
    });
  }

  render() {
    let orders = this.props.orders.map((order) => {
      return <Order
        key={order.number}
        filter={this.state.filter}
        removeOrder={this.props.removeOrder}
        {...order} />;
    });
    let filterClassName = (filterName) => `filter ${filterName} ${this.state.filter == filterName ? 'on' : 'off'}`;
    return (
      <div className="order-list">
        <div className="meta">
          {orders.length} {orders.length == 1 ? 'order' : 'orders'} remaining
        </div>
        <div className="filters">
          <span onClick={this.filter('all')} className={filterClassName('all')}>Show All</span>
          <span onClick={this.filter('overdue')} className={filterClassName('overdue')}>Overdue</span>
          <span onClick={this.filter('due-soon')} className={filterClassName('due-soon')}>Due Soon</span>
          <span onClick={this.filter('due-later')} className={filterClassName('due-later')}>Due Later</span>
        </div>
        <div className="cards-header">
          <span className="column order-no">Order</span>
          <span className="column pickup">Pickup</span>
          <span className="column customer">Customer</span>
          <span className="column address">Address</span>
          <span className="column courier">Courier</span>
          <span className="column action-btn"></span>
        </div>
        <div className="cards">
          <ReactCSSTransitionGroup transitionName="fade" transitionEnterTimeout={500} transitionLeaveTimeout={600}>
            {orders}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
};

OrderList.propTypes = {
  orders: React.PropTypes.array.isRequired
};