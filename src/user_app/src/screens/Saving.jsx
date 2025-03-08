import React, { useState, useEffect } from "react";
import Bottom from "../component/bottom";
import Header from "../components/Header";
import HotelNameAndTable from "../components/HotelNameAndTable";
import { useRestaurantId } from "../context/RestaurantIdContext";

function Saving() {
  const { restaurantId, restaurantName } = useRestaurantId();
  const userData = JSON.parse(localStorage.getItem("userData"));
  const user_id = userData?.user_id || localStorage.getItem("user_id");
  const access_token = localStorage.getItem("access_token");

  const [outletStats, setOutletStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOutlet, setExpandedOutlet] = useState(null); // Track expanded outlet

  useEffect(() => {
    if (!user_id || !access_token) {
      console.error("⚠️ User ID or Token is missing!");
      setError("Session expired. Please log in again.");
      setLoading(false);
      return;
    }

    console.log("🔹 User ID:", user_id);
    console.log("🔹 Access Token:", access_token);

    const requestBody = JSON.stringify({ user_id: String(user_id) });

    fetch("https://men4u.xyz/user_api/get_user_count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: requestBody,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data?.st === 1 && data?.msg === "success" && data?.data) {
          const outletData = data.data.Outlet_wise_data || {};

          // Convert outlet data to an array with outlet names
          const formattedData = Object.values(outletData).map((outlet) => ({
            outletName: outlet.outlet_name || "Unknown Outlet",
            visitedCount: outlet.order_count || 0,
            totalSavings:
              (outlet.regular_discount || 0) + (outlet.special_discount || 0),
          }));

          setOutletStats(formattedData);
        } else {
          throw new Error("Invalid response structure");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        setError("Failed to fetch data");
        setLoading(false);
      });
  }, [user_id, access_token]);

  const toggleExpand = (index) => {
    setExpandedOutlet(expandedOutlet === index ? null : index);
  };

  return (
    <div className="page-wrapper full-height">
      <Header title="Savings" />
      <main className="page-content space-top p-b70">
        <div className="container px-3">
          <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={userData?.customer_type?.tableNumber || "1"}/>
        </div>
        <div className="container pt-3">
          <div className="custom-card my-2 rounded-4 shadow-sm">
            <div className="card-body py-2">
              <div className="row">
                <div className="col-12 text-start">
                  <div className="restaurant">
                    <span className="fw-medium font_size_14 text-center d-block">
                      Total Savings using MenuMitra
                    </span>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12">
                  {loading ? (
                    <p>Loading data...</p>
                  ) : error ? (
                    <p className="text-danger">{error}</p>
                  ) : (
                    <div className="accordion">
                      {outletStats.map((outlet, index) => (
                        <div key={index} className="my-2 p-2 border-bottom">
                          <div
                            className="d-flex justify-content-between align-items-center cursor-pointer"
                            onClick={() => toggleExpand(index)}
                          >
                            <h6 className="m-0">{outlet.outletName}</h6>
                            <i
                              className={`fa-solid ${
                                expandedOutlet === index
                                  ? "fa-chevron-up"
                                  : "fa-chevron-down"
                              }`}
                            ></i>
                          </div>
                          {expandedOutlet === index && (
                           <div className="mt-2">
                           <div className="menu-info d-flex justify-content-between">
                             <div className="halo-icon">
                               <i className="fa-light fa-user-clock"></i>
                               <span className="gray-text font_size_12">
                                 Visited Count: {outlet.visitedCount}
                               </span>
                             </div>
                             <div className="halo-icon">
                               <i className="fa-light fa-piggy-bank"></i>
                               <span className="gray-text font_size_12">
                                 Total Savings: ₹{outlet.totalSavings}
                               </span>
                             </div>
                           </div>
                         </div>
                         
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Bottom />
    </div>
  );
}

export default Saving;
