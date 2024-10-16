import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OrderList = ({ restaurantId, customerId, orderStatus }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://menumitra.com/user_api/get_order_list",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              restaurant_id: restaurantId,
              order_status: orderStatus,
              customer_id: customerId,
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data.st === 1 && data.lists) {
            setOrders(data.lists);
          } else {
            console.error("Invalid data format:", data);
          }
        } else {
          console.error("Network response was not ok.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (customerId && restaurantId) {
      fetchOrders();
    }
  }, [restaurantId, customerId, orderStatus]);

  const calculateOldPrice = (totalBill) => {
    return (parseFloat(totalBill) * 1.1).toFixed(2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row g-3">
      {orders.map((order) => (
        <div key={order.order_number} className="card mb-3">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-6">
                <h5 className="card-title mb-1">#{order.order_number}</h5>
              </div>
              <div className="col-6 text-end">
                <span className="card-text text-muted mb-0">
                  {order.date_time}
                </span>
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-3">
                <p className="mb-0 fs-6">
                  <i className="ri-store-2-line pe-2"></i>
                  {order.restaurant_name}
                </p>
              </div>
              <div className="col-3 text-start">
                <p className="mb-0 fs-6">
                  <i className="ri-bowl-line pe-2"></i>{order.menu_count}
                </p>
              </div>
              <div
                className="col-4"
                style={{ position: "absolute", right: "-10px" }}
              >
                <div className="price-wrapper">
                  <h6 className="current-price fs-3">₹{order.total_bill}</h6>
                  <span className="old-price">₹{calculateOldPrice(order.total_bill)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
