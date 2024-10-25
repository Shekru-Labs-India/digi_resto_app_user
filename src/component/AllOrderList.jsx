import React from 'react';
import CompanyVersion from '../constants/CompanyVersion';

const AllOrderList = () => {
  const staticOrders = [
    {
      order_id: 1,
      order_number: '12345',
      order_date: '2023-06-15',
      total_amount: '50.00',
      restaurant_name: 'Tasty Bites'
    },
    {
      order_id: 2,
      order_number: '67890',
      order_date: '2023-06-14',
      total_amount: '35.50',
      restaurant_name: 'Spice Garden'
    },
    {
      order_id: 3,
      order_number: '11223',
      order_date: '2023-06-13',
      total_amount: '75.25',
      restaurant_name: 'Pizza Palace'
    }
  ];

  return (
    <div className="page-wrapper full-height">
      <main className="page-content pt-0">
        <div className="container py-1 px-0">
          <div className="d-flex justify-content-center">
            <h2>All Orders</h2>
          </div>
          {staticOrders.map((order) => (
            <div className="card rounded-3" key={order.order_id}>
              <div className="card-body py-0">
                <div className="row text-start">
                  <div className="col-12">
                    <div className="row mt-2">
                      <div className="col-1 d-flex align-items-center">
                        <i className="ri-file-list-3-line font_size_14 fw-medium"></i>
                      </div>
                      <div className="col-10 d-flex align-items-center">
                        <span className="font_size_14 fw-medium m-0">
                          {order.order_number}
                        </span>
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col-1 d-flex align-items-center">
                        <i className="ri-store-2-line text-primary"></i>
                      </div>
                      <div className="col-10 d-flex align-items-center">
                        <span className="text-primary font_size_12">
                          {order.restaurant_name}
                        </span>
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col-1 d-flex align-items-center">
                        <i className="ri-time-line text-primary"></i>
                      </div>
                      <div className="col-10 d-flex align-items-center">
                        <span className="text-primary font_size_12">
                          {order.order_date}
                        </span>
                      </div>
                    </div>
                    <div className="row mt-1 pb-1">
                      <div className="col-1">
                        <i className="ri-money-dollar-circle-line gray-text"></i>
                      </div>
                      <div className="col-10 d-flex align-items-center">
                        <span className="gray-text font_size_14">
                          Total: ${order.total_amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <CompanyVersion />
    </div>
  );
}

export default AllOrderList;