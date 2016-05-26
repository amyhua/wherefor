import React from 'react';

import Order from '../Order/Order';

export default class AndoApp extends React.Component {
  render() {
    var eta = Date.now() + 1000*60*.1;
    return (
      <div className="AndoApp">
        <button className="close-btn">Close</button>
        <div className="cards-header">
          <span className="order-no">Order</span>
          <span className="pickup">Pickup</span>
          <span className="due"></span>
          <span className="customer">Customer</span>
          <span className="address">Address</span>
          <span className="courier">Courier</span>
        </div>
        <div className="cards">
          <Order
            number="0001"
            customer="Amy"
            address="1635 Prairie Lane, Lincoln, NE 68123"
            courier="Seamless"
            eta={eta} />
        </div>
      </div>
    );
  }
}
