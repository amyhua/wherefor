import React from 'react';

import OrderList from '../OrderList/OrderList';
import ToggleClose from '../ToggleClose/ToggleClose';

const generationInterval = 1*1000;
const minutesFromNow = (numMinutes) => Date.now() + numMinutes * 1000 * 60;

// spoofed data
const customers = ['Amy', 'Dan', 'Ron', 'Jon', 'Tom', 'Vic', 'Ric', 'Ben'];
const addresses = [
  '1901 Webster Ave.',
  '1365 Park Street',
  '215 Alamo Plaza, Suite E ',
  '2916 Domingo Avenue',
  '2255 Shattuck Avenue',
  '1825 Solano Avenue',
  '145 Main Street',
  '819 Bay Avenue, Suite A'
];
const couriers = ['Jonaton', 'Samuel', 'Sarah-Ashley', 'Veronica', 'Moriarty', 'Walter', 'Sherlock', 'Watson'];
const random = (items) => items[Math.floor(Math.random()*items.length)];

// order generation
let i = 0;
const order = () => {
  // randomly generated
  i++;
  const customer = 'Amy';
  const address = '1635 Prairie Lane';
  const courier = 'John';
  const numString = String(i);
  return {
    id: i,
    number: "0000".slice(0, 4 - numString.length) + numString || i,
    customer: random(customers),
    address: random(addresses),
    courier: random(couriers),
    eta: minutesFromNow(Math.random() * 3) // between 0-3 min from now
  };
};
export default class AndoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [order()],
      closed: false
    };
    this.generateOrders = this.generateOrders.bind(this);
    this.removeOrder = this.removeOrder.bind(this);
    this.toggleClose = this.toggleClose.bind(this);
  }

  generateOrders() {
    let orderGenInterval = setInterval(() => {
      this.setState({
        orders: this.state.orders.concat(order())
      });
    }, generationInterval);
    this.setState({
      orderGenInterval: orderGenInterval
    });
  }

  stopOrders() {
    clearInterval(this.state.orderGenInterval);
    this.setState({
      orderGenInterval: undefined
    });
  }

  removeOrder(orderId) {
    // fn to remove that order
    const orderIdx = this.state.orders.findIndex(order => order.id === orderId);
    this.setState((state) => {
      state.orders.splice(orderIdx, 1);
      return {
        orders: state.orders
      };
    });
    // refresh the interval fn
    // to rely on only mounted react components (now with orders removed)
    this.stopOrders();
    this.generateOrders();
  }

  componentDidMount() {
    // orders: randomly generated orders, created every 15 sec
    this.generateOrders();
  }

  toggleClose() {
    if (this.state.closed) {
      // re-open
      this.generateOrders();
    } else {
      // close
      this.stopOrders();
    }
    this.setState((state) => {
      return {
        closed: !state.closed
      }
    });
  }

  render() {
    return (
      <div className="AndoApp">
        <ToggleClose
          closed={this.state.closed}
          onToggleClose={this.toggleClose} />
        <OrderList
          removeOrder={this.removeOrder}
          orders={this.state.orders} />
      </div>
    );
  }
}
