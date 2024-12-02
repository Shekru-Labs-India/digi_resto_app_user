import React, { useState, useEffect } from "react";
import CompanyVersion from "../constants/CompanyVersion";
import config from "./config"

const AllOrderList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const restaurantId = localStorage.getItem("restaurantId");
  const restaurantName = localStorage.getItem("restaurantName");


  useEffect(() => {
    fetch( `${config.apiDomain}/user_api/get_all_orders_of_restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurant_id: restaurantId,
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.clear()
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      });
  }, [restaurantId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="page-wrapper full-height">
      <main className="page-content pt-0">
        <div className="container py-1 px-0">
          <div className="d-flex justify-content-center">
            <div className="fw-bold">{restaurantName}</div>
          </div>
          {data && data.st === 1 && data.lists && data.lists.ongoing && (
            <div className="container">
              {data.lists.ongoing.map((order) => (
                <div className="card rounded-4" key={order.order_number}>
                  <div className="card-body py-0">
                    <div className="row text-start">
                      <div className="col-12">
                        <div className="row mt-2">
                          <div className="col-1 d-flex align-items-center">
                            <i className="ri-file-list-3-line font_size_14 fw-medium"></i>
                          </div>
                          <div className="col-10 d-flex align-items-center">
                            <span className="font_size_14 fw-medium m-0">
                              Order Number: {order.order_number}
                            </span>
                          </div>
                        </div>
                        <div className="row mt-1 pb-1">
                          <div className="col-1">
                            <i className="fa-solid fa-bars gray-text"></i>
                          </div>
                          <div className="col-10 d-flex align-items-center">
                            <span className="gray-text font_size_14">
                              Menu Count: {order.menu_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllOrderList;
