import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SigninButton from "../constants/SigninButton";
import { useRestaurantId } from "../context/RestaurantIdContext";
import Bottom from "../component/bottom";
import "../assets/css/toast.css";
import "../assets/css/Tab.css";
import OrderGif from "./OrderGif";
// import LoaderGif from "./LoaderGIF";
import Header from "../components/Header";

import config from "../component/config";
import { usePopup } from "../context/PopupContext";
import RestaurantSocials from "../components/RestaurantSocials";
import { isNonProductionDomain } from "../component/config";
import Notice from "../component/Notice";
import HotelNameAndTable from "../components/HotelNameAndTable";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import MenuMitra from "../assets/logos/menumitra_logo_128.png";


const titleCase = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    ?.map((word) => word.charAt(0)?.toUpperCase() + word.slice(1))
    .join(" ");
};

const calculateOriginalPrice = (grandTotal) => {
  const numericTotal = parseFloat(grandTotal);
  const originalPrice = (numericTotal / 0.6).toFixed(2); // 40% discount means price is 60% of original
  return originalPrice;
};


// Add generatePDF utility function
const generatePDF = async (orderData) => {
  try {
    if (!orderData?.order_details) {
      throw new Error("Order details not found");
    }

    const { order_details, menu_details } = orderData;
    const outlet_name = localStorage.getItem("outlet_name") || order_details.outlet_name || "";
    const outlet_address = localStorage.getItem("outlet_address") || "-";
    const outlet_mobile = localStorage.getItem("outlet_mobile") || "-";
    const website_url = "https://menumitra.com";
    const customerName = localStorage.getItem("customerName") || order_details.customer_name || "Guest";

    const content = document.createElement('div');
    content.innerHTML = `
      <div style="padding: 40px; max-width: 100%; margin: auto; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div style="display: flex; align-items: center;">
            <img src="${MenuMitra}" alt="MenuMitra Logo" style="width: 35px; height: 35px;" />
            <span style="font-size: 20px; font-weight: bold; margin-left: 8px;">MenuMitra</span>
          </div>
          <span style="color: #d9534f; font-size: 20px; font-weight: normal;">Invoice</span>
        </div>

        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
          <div>
            <p style="margin: 0; font-weight: bold;">Hello, ${customerName}</p>
            <p style="margin: 5px 0 0 0; color: #333;">Thank you for shopping from our store and for your order.</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0;">Order no: ${order_details.order_number}</p>
            <p style="margin: 5px 0 0 0; color: #666;">${order_details.date || ""} ${order_details.time || ""}</p>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <th style="text-align: left; padding: 8px 0; border-bottom: 1px solid #ddd; color: #333;">Item</th>
            <th style="text-align: center; padding: 8px 0; border-bottom: 1px solid #ddd; color: #333;">Quantity</th>
            <th style="text-align: right; padding: 8px 0; border-bottom: 1px solid #ddd; color: #333;">Price</th>
          </tr>
          ${menu_details.map(item => `
            <tr>
              <td style="padding: 8px 0; color: #d9534f;">${item.menu_name}</td>
              <td style="text-align: center; padding: 8px 0;">${item.quantity}</td>
              <td style="text-align: right; padding: 8px 0;">₹ ${item.price.toFixed(2)}</td>
            </tr>
          `).join('')}
        </table>

        <div style="border-top: 1px solid #ddd; margin-top: 20px;">
          <div style="text-align: right; margin-top: 10px;">
            <p style="margin: 5px 0; font-size: 15px;"><span style="font-weight: bold;">Total:</span> ₹${order_details.total_bill_amount?.toFixed(2)}</p>
            ${order_details.discount_percent > 0 
              ? `<p style="margin: 5px 0; font-size: 15px;"><span style="font-weight: bold;">Discount (${order_details.discount_percent}%):</span> -₹${order_details.discount_amount?.toFixed(2) || "-"}</p>` 
              : ""
            }
            ${order_details.special_discount 
              ? `<p style="margin: 5px 0; font-size: 15px;">Special Discount: -₹${order_details.special_discount?.toFixed(2) || "-"}</p>`
              : ""
            }
            <p style="margin: 5px 0; font-size: 15px;"><span style="font-weight: bold;">Total after Discount:</span> ₹${order_details.total_bill_with_discount?.toFixed(2) || "-"}</p>
            ${order_details.charges > 0 
              ? `<p style="margin: 5px 0; font-size: 15px;">Extra Charges: +₹${order_details.charges?.toFixed(2) || "-"}</p>`
              : ""
            }
            <p style="margin: 5px 0; font-size: 15px;"><span style="font-weight: bold;">Service Charges (${order_details.service_charges_percent || 1}%):</span> +₹${order_details.service_charges_amount?.toFixed(2) || "-"}</p>
            <p style="margin: 5px 0; font-size: 15px;"><span style="font-weight: bold;">GST (${order_details.gst_percent || 1}%):</span> +₹${order_details.gst_amount?.toFixed(2) || "-"}</p>
            <p style="margin: 5px 0; font-size: 15px; font-weight: bold;">Grand Total: ₹${order_details.grand_total?.toFixed(2)}</p>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 30px;">
          <div>
            <p style="margin: 0 0 10px 0; font-weight: bold;">Billing Information</p>
            <p style="margin: 5px 0;">► ${outlet_name}</p>
            <p style="margin: 5px 0;">► ${outlet_address}</p>
            <p style="margin: 5px 0;">► ${outlet_mobile}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Payment Method</p>
            <p style="margin: 5px 0; text-transform: uppercase;">${order_details.payment_method || "CASH"}</p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 40px;">
          <p style="font-style: italic; margin-bottom: 20px;">Have a nice day.</p>
          <div style="margin: 20px 0;">
            <div style="display: inline-flex; align-items: center; justify-content: center; margin-bottom: 10px;">
              <img src="${MenuMitra}" alt="MenuMitra Logo" style="width: 25px; height: 25px;" />
              <span style="font-size: 16px; font-weight: bold; margin-left: 8px;">MenuMitra</span>
            </div>
          </div>
          <p style="margin: 3px 0; color: #666; font-size: 13px;">info@menumitra.com</p>
          <p style="margin: 3px 0; color: #666; font-size: 13px;">+91 9172530151</p>
          <p style="margin: 3px 0; color: #666; font-size: 13px;">${website_url}</p>
        </div>
      </div>
    `;

    document.body.appendChild(content);

    try {
      const canvas = await html2canvas(content, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        useCORS: true
      });
      
      document.body.removeChild(content);
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${order_details.order_number}.pdf`);

      window.showToast("success", "Invoice downloaded successfully");
    } catch (error) {
      // Clean up in case of error
      if (document.body.contains(content)) {
        document.body.removeChild(content);
      }
      throw error;
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
    window.showToast("error", "Failed to generate invoice");
  }
};

const MyOrder = () => {
  const location = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("isDarkMode") === "true";
  });
  const { restaurantName, restaurantId } = useRestaurantId();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("completed");
  const [orders, setOrders] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user_id, setUser_id] = useState(null);
  const [role, setRole] = useState(null);
  const [activeOrders, setActiveOrders] = useState({
    placed: [],
    cooking: [],
    served: []
  });
  const [completedTimers, setCompletedTimers] = useState(new Set());
  const { showLoginPopup } = usePopup();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setIsLoggedIn(!!userData?.user_id);
    setUser_id(userData?.user_id);
    setRole(userData?.role);
  }, []);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData"));
      const sectionId = localStorage.getItem("sectionId");
      console.log('MyOrder: Fetching active orders');
      
      if (!userData?.user_id || !restaurantId) {
        console.log('MyOrder: Missing user_id or restaurantId, skipping active orders fetch');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${config.apiDomain}/user_api/get_ongoing_or_placed_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            user_id: userData.user_id,
            outlet_id: localStorage.getItem("outlet_id"),
            section_id: sectionId,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");

        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
        return;
      }

      const data = await response.json();
      console.log('MyOrder: Received active orders:', data);

      if (response.ok && data.st === 1) {
        const orders = data.data || [];
        if (orders?.length > 0) {
          // Group orders by their status
          const placedOrders = orders?.filter(o => o.status === "placed") || [];
          const cookingOrders = orders?.filter(o => o.status === "cooking") || [];
          const servedOrders = orders?.filter(o => o.status === "served") || [];

          const activeOrders = {
            placed: placedOrders,
            cooking: cookingOrders,
            served: servedOrders
          };

          // Update localStorage
          const existingOrders = JSON.parse(localStorage.getItem("allOrderList") || "{}");
          const updatedOrders = {
            ...existingOrders,
            placed: placedOrders,
            ongoing: [...cookingOrders, ...servedOrders]
          };
          
          localStorage.setItem("allOrderList", JSON.stringify(updatedOrders));
          console.log('MyOrder: Updated localStorage with active orders:', updatedOrders);

          setActiveOrders(activeOrders);
        } else {
          console.log('MyOrder: No active orders found');
          setActiveOrders({ placed: [], cooking: [], served: [] });
        }
      } else {
        console.log('MyOrder: No valid active orders in response');
        setActiveOrders({ placed: [], cooking: [], served: [] });
      }
    } catch (error) {
      console.error('MyOrder: Error fetching active orders:', error);
      setActiveOrders({ placed: [], cooking: [], served: [] });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedAndCancelledOrders = async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData"));
      console.log('MyOrder: Fetching orders for user:', userData?.user_id);
      
      if (!userData?.user_id || !restaurantId) {
        console.log('MyOrder: Missing user_id or restaurantId, skipping fetch');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${config.apiDomain}/user_api/get_completed_and_cancle_order_list`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            outlet_id: localStorage.getItem("outlet_id"),
            order_status: activeTab === "cancelled" ? "cancle" : activeTab,
            user_id: userData.user_id,
            role: userData.role,
            section_id: userData.sectionId,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");

        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        console.log('MyOrder: Received orders data:', data);

        if (data.st === 1 && data.lists) {
          const mappedData = {};
          if (activeTab === "cancelled" && data.lists.cancelled) {
            mappedData.cancelled = data.lists.cancelled;
          } else if (activeTab === "completed" && data.lists.paid) {
            mappedData.completed = data.lists.paid;
          }

          // Save to localStorage
          const existingOrders = JSON.parse(localStorage.getItem("allOrderList") || "{}");
          console.log('MyOrder: Existing orders in localStorage:', existingOrders);
          
          const updatedOrders = {
            ...existingOrders,
            ...mappedData
          };
          
          localStorage.setItem("allOrderList", JSON.stringify(updatedOrders));
          console.log('MyOrder: Updated localStorage with new orders:', updatedOrders);

          setOrders(mappedData);
        } else {
          console.log('MyOrder: No valid lists in response');
          setOrders({});
        }
      } else {
        console.error('MyOrder: API request failed');
        setOrders({});
      }
    } catch (error) {
      console.error('MyOrder: Error fetching orders:', error);
      setOrders({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user_id && restaurantId) {
      fetchActiveOrders();
    }
  }, [user_id, restaurantId]);

  useEffect(() => {
    if (user_id && restaurantId) {
      fetchCompletedAndCancelledOrders();
    }
  }, [activeTab, user_id, restaurantId]);

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("theme-dark");
    } else {
      document.body.classList.remove("theme-dark");
    }
  }, [isDarkMode]);

  const toTitleCase = (text) => {
    if (!text) return "";
    return text.replace(/\b\w/g, (char) => char?.toUpperCase());
  };

  const calculateOrderCount = (orders) => {
    if (!orders) return 0;

    try {
      return Object.values(orders).reduce((acc, curr) => {
        if (!curr) return acc;

        // Handle canceled orders which might be under 'cancle' key
        if (curr.cancle) {
          return acc + (Array.isArray(curr.cancle) ? curr.cancle?.length : 0);
        }

        // Handle regular orders
        if (Array.isArray(curr)) {
          return acc + curr?.length;
        }
        if (typeof curr === "object") {
          return (
            acc +
            Object.values(curr).reduce((sum, val) => {
              return sum + (Array.isArray(val) ? val?.length : 0);
            }, 0)
          );
        }
        return acc;
      }, 0);
    } catch (error) {
      return 0;
    }
  };

  // Add this function to fetch order details when needed
  const fetchOrderDetailsForPDF = async (order) => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/get_order_details`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            order_id: order.order_id,
            section_id: localStorage.getItem("sectionId"),
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");

        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);

        return;
      }

      if (response.ok) {
        const data = await response.json();
        if (data.st === 1 && data.lists) {
          await generatePDF(data.lists);
        } else {
          window.showToast("error", "Failed to generate invoice");
        }
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      window.showToast("error", "Failed to generate invoice");
    }
  };

  return (
    <div className="page-wrapper">
      <Header
        title="Orders"
        count={
          Object.values(activeOrders).reduce((total, orders) => total + orders?.length, 0)
        }
      />

      <main className="page-content space-top p-b70">
        {/* {isNonProductionDomain() && <Notice />} */}
        <div className="container px-3 py-0 mb-0">
        <HotelNameAndTable
            restaurantName={restaurantName}
            tableNumber={role?.tableNumber || "1"}
          />
          {activeOrders.placed?.map((order) => (
            <OrderCard
              key={`placed-${order.order_id}`}
              order={order}
              status="placed"
              setActiveOrders={setActiveOrders}
              completedTimers={completedTimers}
              setCompletedTimers={setCompletedTimers}
              setActiveTab={setActiveTab}
              fetchOrders={fetchActiveOrders}
            />
          ))}

          {/* Render cooking orders */}
          {activeOrders.cooking?.map((order) => (
            <OrderCard
              key={`cooking-${order.order_id}`}
              order={order}
              status="cooking"
              setActiveOrders={setActiveOrders}
              fetchOrders={fetchActiveOrders}
            />
          ))}

          {/* Render served orders */}
          {activeOrders.served?.map((order) => (
            <OrderCard
              key={`served-${order.order_id}`}
              order={order}
              status="served"
              setActiveOrders={setActiveOrders}
              fetchOrders={fetchActiveOrders}
              fetchCompletedAndCancelledOrders={fetchCompletedAndCancelledOrders}
            />
          ))}

{isLoggedIn && (
          <div className="nav nav-tabs nav-fill" role="tablist">
            {["completed", "cancelled"]?.map((tab) => (
              <div
                key={tab}
                className={`nav-link px-0 ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "completed" && (
                  <i className="far fa-check-circle text-success me-2 fs-5"></i>
                )}
                {tab === "cancelled" && (
                  <i className="far fa-times-circle text-danger me-2 fs-5"></i>
                )}
                {tab.charAt(0)?.toUpperCase() + tab.slice(1)}
              </div>
            ))}
          </div>
)}

          {!isLoggedIn && (
  <div
  className="container overflow-hidden d-flex justify-content-center align-items-center"
  style={{ height: "68vh" }}
>
  <div className="m-b20 dz-flex-box text-center">
    <div className="dz-cart-about">
      <div className="mb-3">
        <button
          className="btn btn-outline-primary rounded-pill"
          onClick={showLoginPopup}
        >
          <i className="fa-solid fa-lock me-2 fs-6"></i> Login
        </button>
      </div>
      <span>Please login to access order</span>
    </div>
  </div>
  </div>
)}
          <Bottom />
        </div>

        <div className="container pt-0">
          {loading ? (
            <div id="">
              <div className="loader">{/* <LoaderGif /> */}</div>
            </div>
          ) : !user_id ? (
            <div
              className="container overflow-hidden d-flex justify-content-center align-items-center"
              style={{ height: "80vh" }}
            >
              <div className="m-b20 dz-flex-box text-center">
                <div className="dz-cart-about">
                  <div className="">
                    <button
                      className="btn btn-outline-primary rounded-pill"
                      onClick={showLoginPopup}
                    >
                      <i className="fa-solid fa-lock me-2 fs-6"></i> Login
                    </button>
                  </div>
                  <span className="mt-4">
                    Access fresh flavors with a quick login.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {user_id && user_id ? (
                <div className="default-tab style-2 pb-5 mb-3">
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade p-b70 ${
                        activeTab === "completed" ? "show active" : ""
                      }`}
                      id="completed"
                      role="tabpanel"
                    >
                      <OrdersTab
                        orders={orders[activeTab]}
                        type={activeTab}
                        activeTab={activeTab}
                        setOrders={setOrders}
                        setActiveTab={setActiveTab}
                        fetchOrderDetailsForPDF={fetchOrderDetailsForPDF}
                      />
                    </div>
                    <div
                      className={`tab-pane fade p-b70 ${
                        activeTab === "cancelled" ? "show active" : ""
                      }`}
                      id="cancelled"
                      role="tabpanel"
                    >
                      <OrdersTab
                        orders={orders[activeTab]}
                        type={activeTab}
                        activeTab={activeTab}
                        setOrders={setOrders}
                        setActiveTab={setActiveTab}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <SigninButton />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export const OrderCard = ({
  order,
  status,
  fetchOrders,
  setActiveOrders,
  completedTimers = new Set(),
  setActiveTab,
  fetchCompletedAndCancelledOrders,
  setCompletedTimers = () => {},
  fetchOrderDetailsForPDF,
}) => {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelReasonError, setCancelReasonError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const paymentTimeoutRef = useRef(null);
  const [isProcessingUPI, setIsProcessingUPI] = useState(false);
  const [isProcessingPhonePe, setIsProcessingPhonePe] = useState(false);
  const [isProcessingGPay, setIsProcessingGPay] = useState(false);
  const timeoutRef = useRef({});
  const { showLoginPopup } = usePopup();
  

  const [customerName, setCustomerName] = useState("");
  const titleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      ?.map((word) => word.charAt(0)?.toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const customerName = localStorage.getItem("customerName");
    setCustomerName(customerName);
  }, []);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };
  const handleCompleteClick = () => {
    setShowCompleteModal(true);
  };
  const handleCompleteOrder = async () => {
    if (!paymentMethod) {
      window.showToast("error", "Please select a payment method.");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/complete_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            order_id: order.order_id,
            outlet_id: order.outlet_id,
            payment_method: paymentMethod, // Added payment method
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");

        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        fetchCompletedAndCancelledOrders();
        window.showToast("success", data.msg);

        // Update the state to remove the order from "ongoing"
        setActiveOrders((prevOrders) => {
          const updatedOngoing = prevOrders.ongoing?.filter(
            (o) => o.order_id !== order.order_id
          );

          return {
            placed: prevOrders.placed,
            ongoing: updatedOngoing,
          };
        });
        fetchOrders();
        setShowCompleteModal(false); // Close the modal
      } else {
        window.showToast("error", data.msg || "Failed to complete the order.");
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const handleCardPayment = async () => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/complete_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            order_id: order.order_id,
            outlet_id: order.outlet_id,
            payment_method: "card",
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");

        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        
        window.showToast("success", data.msg);

        // Update the state to remove the order from "ongoing"
        setActiveOrders((prevOrders) => {
          const updatedOngoing = prevOrders.ongoing?.filter(
            (o) => o.order_id !== order.order_id
          );

          return {
            placed: prevOrders.placed,
            ongoing: updatedOngoing,
          };
        });

        // Fetch both active and completed orders
        fetchOrders();
        fetchCompletedAndCancelledOrders();
        setShowCompleteModal(false); // Close the modal
        
      } else {
        window.showToast("error", data.msg || "Failed to complete the order.");
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const handleCashPayment = async () => {
    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/complete_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            order_id: order.order_id,
            outlet_id: order.outlet_id,
            payment_method: "cash",
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");

        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
        showLoginPopup();
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", data.msg);
        fetchCompletedAndCancelledOrders();
        // Update the state to remove the order from "ongoing"
        setActiveOrders((prevOrders) => {
          const updatedOngoing = prevOrders.ongoing?.filter(
            (o) => o.order_id !== order.order_id
          );

          return {
            placed: prevOrders.placed,
            ongoing: updatedOngoing,
          };
        });
        fetchOrders();
        
        setShowCompleteModal(false); // Close the modal
      } else {
        console.clear();
        window.showToast("error", data.msg || "Failed to complete the order.");
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const handleCancelReasonChange = (e) => {
    const value = e.target.value;
    setCancelReason(value);
    
    if (value.trim().length > 0 && value.trim().length < 3) {
      setCancelReasonError("Cancellation reason should be at least 3 characters long.");
    } else {
      setCancelReasonError("");
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      setCancelReasonError("Please select a reason to cancel the order.");
      return;
    }

    if (cancelReason.trim().length < 3) {
      setCancelReasonError("Cancellation reason should be at least 3 characters long.");
      return;
    }

    try {
      const response = await fetch(
        `${config.apiDomain}/user_api/cancle_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            outlet_id: order.outlet_id,
            order_id: order.order_id,
            note: cancelReason,
          }),
        }
      );

      if (response.status === 401) {
        const restaurantCode = localStorage.getItem("restaurantCode");
        const tableNumber = localStorage.getItem("tableNumber");
        const sectionId = localStorage.getItem("sectionId");
        localStorage.removeItem("user_id");
        localStorage.removeItem("userData");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("access_token");
        localStorage.removeItem("customerName");
        localStorage.removeItem("mobile");
        showLoginPopup();
        setShowCancelModal(false);
        navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.st === 1) {
        window.showToast("success", data.msg);
        setShowCancelModal(false);
        fetchOrders();
        setActiveOrders((prevOrders) => ({
          placed: prevOrders.placed?.filter(
            (o) => o.order_id !== order.order_id
          ),
          ongoing: prevOrders.ongoing,
        }));
        setActiveTab("cancelled");
      } else if (data.st === 2) {
        window.showToast("error", data.msg || "Unable to cancel order at this time.");
      } else {
        console.clear();
        window.showToast("error", data.msg || "Failed to cancel the order.");
      }
    } catch (error) {
      console.clear();
      window.showToast("error", "An error occurred. Please try again later.");
    }
  };

  const handleOrderClick = (orderNumber, orderId) => {
    console.log('MyOrder: Attempting to navigate to TrackOrder');
    console.log('MyOrder: Order Number:', orderNumber);
    console.log('MyOrder: Order ID:', orderId);
    console.log('MyOrder: Navigation path:', `/user_app/TrackOrder/${orderNumber}`);
    
    // Log the current state of allOrderList
    const allOrders = JSON.parse(localStorage.getItem("allOrderList") || "{}");
    console.log('MyOrder: Current allOrderList in localStorage:', allOrders);
    
    try {
      // Store orderId in localStorage before navigation
      localStorage.setItem('current_order_id', orderId?.toString());
      navigate(`/user_app/TrackOrder/${orderNumber}`, { 
        state: { 
          orderId: orderId,
          from: 'order_card' 
        } 
      });
      console.log('MyOrder: Navigation initiated successfully');
    } catch (error) {
      console.error('MyOrder: Navigation failed:', error);
    }
  };

  const handleGenericUPI = async () => {
    if (isProcessingUPI) return;

    try {
      setIsProcessingUPI(true);
      if (timeoutRef.current.upi) clearTimeout(timeoutRef.current.upi);

      const amount = Math.round(parseFloat(order.grand_total));
      const transactionNote = encodeURIComponent(
        `${customerName} is paying Rs. ${amount} to ${order.outlet_name} for order no. #${order.order_number}`
      );
      const encodedRestaurantName = encodeURIComponent(order.outlet_name);
      const upiId = "hivirajkadam@okhdfcbank";

      const paymentUrl = `upi://pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${order.order_id}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;

      await initiatePayment("upi", paymentUrl, setIsProcessingUPI, "upi");
    } catch (error) {
      console.clear();

      window.showToast(
        "error",
        "UPI payment initiation failed. Please try again."
      );
      setIsProcessingUPI(false);
    }
  };

  const handlePhonePe = async () => {
    if (isProcessingPhonePe) return;
    console.log(customerName);
    try {
      setIsProcessingPhonePe(true);
      if (timeoutRef.current.phonepe) clearTimeout(timeoutRef.current.phonepe);

      const amount = Math.round(parseFloat(order.grand_total));
      const transactionNote = encodeURIComponent(
        `${customerName} is paying Rs. ${amount} to ${order.outlet_name} for order no. #${order.order_number}`
      );
      const encodedRestaurantName = encodeURIComponent(order.outlet_name);
      const upiId = "hivirajkadam@okhdfcbank";

      const paymentUrl = `phonepe://pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${order.order_id}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;

      await initiatePayment(
        "phonepay",
        paymentUrl,
        setIsProcessingPhonePe,
        "phonepe"
      );
    } catch (error) {
      console.clear();
      window.showToast(
        "error",
        "PhonePe payment initiation failed. Please try again."
      );
      setIsProcessingPhonePe(false);
    }
  };

  const handleGooglePay = async () => {
    if (isProcessingGPay) return;

    try {
      setIsProcessingGPay(true);
      if (timeoutRef.current.gpay) clearTimeout(timeoutRef.current.gpay);

      const amount = Math.round(parseFloat(order.grand_total));

      const transactionNote = encodeURIComponent(
        `${customerName} is paying Rs. ${amount} to ${order.outlet_name} for order no. #${order.order_number}`
      );
      const encodedRestaurantName = encodeURIComponent(order.outlet_name);
      const upiId = "hivirajkadam@okhdfcbank";

      const paymentUrl = `gpay://upi/pay?pa=${upiId}&pn=${encodedRestaurantName}&tr=${order.order_id}&tn=${transactionNote}&am=${amount}&cu=INR&mc=1234`;

      await initiatePayment(
        "gpay",
        paymentUrl,
        setIsProcessingGPay,
        "gpay"
      );
    } catch (error) {
      console.clear();
      window.showToast(
        "error",
        "Google Pay payment initiation failed. Please try again."
      );
      setIsProcessingGPay(false);
    }
  };

  const initiatePayment = async (
    method,
    paymentUrl,
    setProcessing,
    timeoutKey
  ) => {
    const response = await fetch(
      `${config.apiDomain}/user_api/complete_order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          order_id: order.order_id,
          outlet_id: order.outlet_id,
          payment_method: method,
        }),
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("userData");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("access_token");
      localStorage.removeItem("customerName");
      localStorage.removeItem("mobile");
      const restaurantCode = localStorage.getItem("restaurantCode");
      const tableNumber = localStorage.getItem("tableNumber");
      const sectionId = localStorage.getItem("sectionId");

      navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);
      showLoginPopup();
      return;
    }

    if (response.ok) {
      fetchCompletedAndCancelledOrders();
      setActiveOrders((prevOrders) => {
        const updatedOngoing = prevOrders.ongoing?.filter(
          (o) => o.order_id !== order.order_id
        );

        return {
          placed: prevOrders.placed,
          ongoing: updatedOngoing,
        };
      });

      fetchOrders();
      if (/android/i.test(navigator.userAgent)) {
        window.location.href = paymentUrl;
        timeoutRef.current[timeoutKey] = setTimeout(() => {
          if (!document.hidden) {
            window.showToast(
              "error",
              `No ${method} app found. Please install the app.`
            );
          }
          setProcessing(false);
        }, 3000);
       
      } else if (/iphone|ipad|ipod/i.test(navigator.userAgent)) {
        window.location.href = paymentUrl;
        timeoutRef.current[timeoutKey] = setTimeout(() => {
          if (!document.hidden) {
            setProcessing(false);
          }
        }, 2000);
      } else {
        window.location.href = paymentUrl;
        timeoutRef.current[timeoutKey] = setTimeout(() => {
          if (!document.hidden) {
            window.showToast(
              "error",
              `No ${method} app found. Please install the app.`
            );
          }
          setProcessing(false);
        }, 3000);
      }
    }
  };

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      Object.values(timeoutRef.current).forEach((timeout) => {
        if (timeout) clearTimeout(timeout);
      });
      setIsProcessingUPI(false);
      setIsProcessingPhonePe(false);
      setIsProcessingGPay(false);
    };
  }, []);

  const isDarkMode = localStorage.getItem("isDarkMode");
  // console.log("isDarkMode ->" + isDarkMode);

  const getOrderTypeIcon = (orderType) => {
    switch (orderType?.toLowerCase()) {
      case "parcel":
        return <i className="fa-solid fa-hand-holding-heart"></i>;
      case "drive-through":
        return <i className="fa-solid fa-car-side"></i>;
      case "dine-in":
        return <i className="fa-solid fa-utensils"></i>;
      default:
        return null; // or a default icon if needed
    }
  };

  const renderStatusSpecificUI = () => {
    switch (status?.toLowerCase()) {
      case "placed":
        return (
          <div className="d-flex flex-column gap-2">
            {!completedTimers.has(order.order_id) && (
              <TimeRemaining
                orderId={order.order_id}
                completedTimers={completedTimers}
                order={order}
              />
            )}
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-center">
                <CircularCountdown
                  orderId={order.order_id}
                  onComplete={() => {
                    setCompletedTimers(
                      (prev) => new Set([...prev, order.order_id])
                    );
                  }}
                  setActiveOrders={setActiveOrders}
                  order={order}
                />
              </div>
              <button
                className="btn btn-sm btn-outline-danger rounded-pill px-4"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancelClick();
                }}
              >
                Cancel Order
              </button>
            </div>
          </div>
        );

      case "cooking":
        return (
          <div className="d-flex justify-content-center  align-items-center py-2">
            <div className="d-flex align-items-center">
              <i className="fa-solid fa-fire text-warning me-2"></i>
              <span className="gray-text">Your order is being prepared</span>
            </div>
          </div>
        );

      // case "served":
      //   return (
      //     <div className="d-flex justify-content-end">
      //       <button
      //         className="btn btn-sm btn-outline-success rounded-pill px-4"
      //         onClick={(e) => {
      //           e.stopPropagation();
      //           handleCompleteClick();
      //         }}
      //       >
      //         Complete Order
      //       </button>
      //     </div>
      //   );

      default:
        return null;
    }
  };

  return (
    <div className="container p-0">
      <div className="custom-card my-2 rounded-4 shadow-sm">
        <div
          className="card-body py-2"
          onClick={(e) => {
            e.stopPropagation();
            handleOrderClick(order.order_number, order.order_id);
          }}
        >
          <div className="row align-items-center">
            <div className="col-4">
              <span className="fw-semibold font_size_14">
                <i className="fa-solid fa-hashtag pe-2 font_size_14"></i>
                {order.order_number}
              </span>
            </div>
            <div className="col-8 text-end">
              <span className="gray-text font_size_12">
                {order.time?.split(":").slice(0, 2).join(":") +
                  " " +
                  order.time?.slice(-2)}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="col-12 text-start">
              <div className="restaurant">
                <i className="fa-solid fa-store pe-2 font_size_14"></i>
                <span className="fw-medium font_size_14">
                  {order.outlet_name?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-3 text-start pe-0">
              <span className="font_size_12 gray-text font_size_12 text-nowrap">
                {getOrderTypeIcon(order.order_type) || (
                  <i className="fa-solid fa-utensils"></i>
                )}
                <span className="ms-2">{order.order_type || "Dine In"}</span>
              </span>
            </div>
            <div className="col-9 text-end">
              <div className="font_size_12 gray-text font_size_12 text-nowrap">
                <span className="fw-medium gray-text">
                  <i className="fa-solid fa-location-dot ps-2 pe-1 font_size_12 gray-text"></i>
                  {order.section_name
                    ? `${titleCase(order.section_name)}${
                        order.order_type?.toLowerCase() === "drive-through" || 
                        order.order_type?.toLowerCase() === "parcel" 
                          ? "" 
                          : ` - ${order.table_number}`
                      }`
                    : "Dine In"}
                </span>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="menu-info">
                <i className="fa-solid fa-bowl-rice pe-2 gray-text font_size_12"></i>
                <span className="gray-text font_size_12">
                  {order.menu_count === 0
                    ? "No Menus"
                    : `${order.menu_count} Menu`}
                </span>
              </div>
            </div>
            <div className="col-6 text-end">
              <span className="text-info font_size_14 fw-semibold">
                ₹{order.grand_total.toFixed(2)}
              </span>
              {order.grand_total !== (
                order.grand_total / (1 - order.discount_percent / 100) ||
                order.grand_total
              ) && (
                <span className="text-decoration-line-through ms-2 gray-text font_size_12 fw-normal">
                  ₹
                  {(
                    order.grand_total / (1 - order.discount_percent / 100) ||
                    order.grand_total
                  ).toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="card-footer bg-transparent border-top-0 pt-0 px-3">
          {renderStatusSpecificUI()}
        </div>

        {showCompleteModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="col-6 text-start">
                    <div className="modal-title font_size_16 fw-medium">
                      Complete Order
                    </div>
                  </div>

                  <div className="col-6 text-end">
                    <div className="d-flex justify-content-end">
                      <span
                        className="m-2 font_size_16"
                        onClick={() => setShowCompleteModal(false)}
                        aria-label="Close"
                      >
                        <i className="fa-solid fa-xmark gray-text font_size_14 pe-3"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="modal-body">
                  <p className="text-center">
                    Are you sure you want to complete this order?
                  </p>
                  <div className="d-flex flex-column align-items-center gap-3">
                    <button
                      className="btn btn-info text-white w-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleGenericUPI();
                      }}
                      disabled={isProcessingUPI}
                    >
                      {isProcessingUPI ? (
                        "Processing..."
                      ) : (
                        <>
                          Pay{" "}
                          <span className="fs-4 mx-1">
                            ₹{order.grand_total}
                          </span>{" "}
                          via
                          <span className="ms-2">Other UPI Apps</span>
                          <img
                            className="text-white ms-1"
                            src="https://img.icons8.com/ios-filled/50/FFFFFF/bhim-upi.png"
                            width={45}
                            alt="UPI"
                          />
                        </>
                      )}
                    </button>

                    <button
                      className="btn text-white w-100"
                      style={{ backgroundColor: "#5f259f" }}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePhonePe();
                      }}
                      disabled={isProcessingPhonePe}
                    >
                      {isProcessingPhonePe ? (
                        "Processing..."
                      ) : (
                        <>
                          Pay with PhonePe
                          <span className="fs-4 mx-1">
                            ₹{order.grand_total}
                          </span>
                          <img
                            className="ms-1"
                            src="https://img.icons8.com/?size=100&id=OYtBxIlJwMGA&format=png&color=000000"
                            width={45}
                            alt="PhonePe"
                          />
                        </>
                      )}
                    </button>

                    <button
                      className="btn text-white w-100 d-flex align-items-center justify-content-center gap-2"
                      style={{ backgroundColor: "#1a73e8" }} // Updated to Google Pay's brand color
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleGooglePay();
                      }}
                      disabled={isProcessingGPay}
                    >
                      {isProcessingGPay ? (
                        "Processing..."
                      ) : (
                        <>
                          Pay with Google Pay
                          <span className="fs-4 mx-1">
                            ₹{order.grand_total}
                          </span>
                          <img
                            className="ms-1"
                            src="https://developers.google.com/static/pay/api/images/brand-guidelines/google-pay-mark.png"
                            width={45}
                            alt="Google Pay"
                          />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-center">
                  <div>or make payment via:</div>
                </div>
                <div className="d-flex justify-content-center pt-2 mb-4">
                  <button
                    type="button"
                    className={`px-2 bg-white mb-2 me-4 rounded-pill py-1 text-dark ${
                      paymentMethod === "card"
                        ? "bg-success text-white"
                        : "border "
                    }`}
                    onClick={() => {
                      // setPaymentMethod("Card");
                      // handleCompleteOrder();
                      handleCardPayment();
                    }}
                  >
                    <i className="ri-bank-card-line me-1"></i>
                    Card
                  </button>
                  <button
                    type="button"
                    className={`px-2 bg-white mb-2 me-2 rounded-pill py-1 text-dark ${
                      paymentMethod === "cash"
                        ? "bg-success text-white"
                        : "border border-muted"
                    }`}
                    onClick={() => {
                      // setPaymentMethod("Cash");
                      // handleCompleteOrder();
                      handleCashPayment();
                    }}
                  >
                    <i className="ri-wallet-3-fill me-1"></i>
                    Cash
                  </button>
                </div>

                {/* <hr className="my-4" />
                <div className="modal-body d-flex justify-content-around px-0 pt-2 pb-3">
                  <button
                    type="button"
                    className="btn btn-outline-dark rounded-pill font_size_14"
                    onClick={() => setShowCompleteModal(false)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success rounded-pill"
                    onClick={handleCompleteOrder}
                  >
                    <i className="ri-checkbox-circle-line text-white me-2 fs-5"></i>
                    Confirm Complete
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        )}

        {showCancelModal && (
          <div
            className="modal fade show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <div className="col-6 text-start">
                    <div className="modal-title font_size_16 fw-medium">
                      Cancel Order
                    </div>
                  </div>
                  <div className="col-6 text-end">
                    <button
                      className="btn p-0 fs-3 text-muted"
                      onClick={() => setShowCancelModal(false)}
                    >
                      <i className="fa-solid fa-xmark text-dark font_size_14 pe-3"></i>
                    </button>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowCancelModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="cancelReason" className="form-label">
                      <span className="text-danger">*</span>
                      Please provide a reason for cancellations
                    </label>
                    <textarea
                      id="cancelReason"
                      className={`form-control border ${cancelReasonError ? 'border-danger' : 'border-primary'}`}
                      rows="3"
                      value={cancelReason}
                      onChange={handleCancelReasonChange}
                      placeholder="Enter your reason here..."
                    ></textarea>
                    {cancelReasonError && (
                      <div className="text-danger font_size_12 mt-1">
                        {cancelReasonError}
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-body">
                  <span className="text-danger">Reason for cancellation:</span>
                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input border border-light"
                      id="delay"
                      name="cancelReason"
                      value="Delivery Delays: Waiting too long, I lost patience."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="delay">
                      <span className="fw-semibold">Delivery Delays:</span>

                      <div className="">Waiting too long, I lost patience.</div>
                    </label>
                  </div>
                  <div className="form-check mt-3">
                    <input
                      type="radio"
                      className="form-check-input border border-light"
                      id="mind"
                      name="cancelReason"
                      value="Change of Mind: Don't want it anymore, found something better."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="mind">
                      <span className="fw-semibold">Change of Mind:</span>
                      <div className="">
                        Don't want it anymore, found something better.
                      </div>
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input border border-light"
                      id="price"
                      name="cancelReason"
                      value="Pricing Concerns: Extra charges made it too expensive."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="price">
                      <span className="fw-semibold">Pricing Concerns:</span>
                      <div className="">
                        Extra charges made it too expensive.
                      </div>
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input border border-light"
                      id="error"
                      name="cancelReason"
                      value="Order Errors: Wrong customization or item, not worth it."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="error">
                      <span className="fw-semibold">Order Errors:</span>
                      <div className="">
                        Wrong customization or item, not worth it.
                      </div>
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      type="radio"
                      className="form-check-input border border-light"
                      id="quality"
                      name="cancelReason"
                      value="Poor Reviews/Quality Doubts: Doubts about quality, I canceled quickly."
                      onChange={(e) => setCancelReason(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="quality">
                      <span className="fw-semibold">
                        Poor Reviews/Quality Doubts:
                      </span>
                      <div className="">
                        Doubts about quality, I canceled quickly.
                      </div>
                    </label>
                  </div>
                </div>
                <hr className="my-4" />
                <div className="">
                  <div className="container d-flex justify-content-between">
                    <span className="col-3">
                      <button
                        type="button"
                        className="btn px-4 font_size_14 rounded-pill border border-1 border-muted bg-transparent text-dark"
                        onClick={() => setShowCancelModal(false)}
                      >
                        Close
                      </button>
                    </span>

                    <span className="col-6 d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-danger rounded-pill text-nowrap text-white px-3"
                        onClick={handleConfirmCancel}
                      >
                        <i className="fa-regular fa-circle-xmark text-white me-2 fs-5"></i>
                        Confirm Cancel
                      </button>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const OrdersTab = ({ orders, type, activeTab, setOrders, setActiveTab, fetchOrderDetailsForPDF }) => {
  const [checkedItems, setCheckedItems] = useState({});
  const navigate = useNavigate();
  const { showLoginPopup } = usePopup();
  const [expandAll, setExpandAll] = useState(false);
  const { restaurantId } = useRestaurantId();
  const [timeLeft, setTimeLeft] = useState(90);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [completedTimers, setCompletedTimers] = useState(new Set());

  useEffect(() => {
    if (orders && Object.keys(orders)?.length > 0) {
      // Get the first date (top-most order group)
      const firstDate = Object.keys(orders)[0];

      // Set only the first date group to be expanded
      setCheckedItems({
        [`${firstDate}-${type}`]: true,
      });
    } else {
      setCheckedItems({});
    }

    setExpandAll(false);
  }, [orders, type]);

  const handleOrderMore = (orderId) => {
    navigate("/user_app/Menu", {
      state: {
        existingOrderId: orderId,
        isAddingToOrder: true,
      },
    });
  };
  const toggleChecked = (date) => {
    setCheckedItems((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const handleOrderClick = (orderNumber, orderId) => {
    console.log('MyOrder: Attempting to navigate to TrackOrder');
    console.log('MyOrder: Order Number:', orderNumber);
    console.log('MyOrder: Order ID:', orderId);
    console.log('MyOrder: Navigation path:', `/user_app/TrackOrder/${orderNumber}`);
    
    // Log the current state of allOrderList
    const allOrders = JSON.parse(localStorage.getItem("allOrderList") || "{}");
    console.log('MyOrder: Current allOrderList in localStorage:', allOrders);
    
    try {
      // Store orderId in localStorage before navigation
      localStorage.setItem('current_order_id', orderId?.toString());
      navigate(`/user_app/TrackOrder/${orderNumber}`, { 
        state: { 
          orderId: orderId,
          from: 'orders_tab' 
        } 
      });
      console.log('MyOrder: Navigation initiated successfully');
    } catch (error) {
      console.error('MyOrder: Navigation failed:', error);
    }
  };

  // Add this new useEffect for periodic API check
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Check all orders in completedTimers
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [completedTimers]);

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  const toggleExpandAll = () => {
    const newExpandAll = !expandAll;
    setExpandAll(newExpandAll);
    const newCheckedItems = {};
    if (orders) {
      Object.keys(orders).forEach((date) => {
        newCheckedItems[`${date}-${type}`] = newExpandAll;
      });
    }
    setCheckedItems(newCheckedItems);
  };

  const renderOrders = () => {
    if (!orders || Object.keys(orders)?.length === 0) {
      return (
        <div className="text-center py-4">
          <p>No menus available</p>
          <Link
            to="/user_app/Menu"
            className="btn btn-sm btn-outline-primary rounded-pill px-3 mt-3"
          >
            <i className="bx bx-plus me-1 fs-4"></i> Order More
          </Link>
        </div>
      );
    }

    // Special handling for cancelled orders which might be nested differently
    let ordersToRender = orders;
    if (type === "cancelled" && orders.cancelled) {
      ordersToRender = orders.cancelled;
    }

    const getOrderTypeIcon = (orderType) => {
      switch (orderType?.toLowerCase()) {
        case "parcel":
          return <i className="fa-solid fa-hand-holding-heart"></i>;
        case "drive-through":
          return <i className="fa-solid fa-car-side"></i>;
        case "dine-in":
          return <i className="fa-solid fa-utensils"></i>;
        default:
          return null;
      }
    };

    return (
      <>
        {/* Add collapse/expand all button */}
        <div className="d-flex justify-content-end mb-2 pe-0">
          <div className="tab-label mb-2">
            <button
              className="btn btn-link text-decoration-none pe-0 pb-0"
              onClick={() => {
                const allDates = Object.keys(ordersToRender);
                const newCheckedItems = {};

                // If any item is collapsed, expand all. Otherwise, collapse all
                const shouldExpand = allDates.some(
                  (date) => !checkedItems[`${date}-${type}`]
                );

                allDates.forEach((date) => {
                  newCheckedItems[`${date}-${type}`] = shouldExpand;
                });

                setCheckedItems(newCheckedItems);
              }}
            >
              <span className="d-flex align-items-center">
                <span className="gray-text pe-2 font_size_10">
                  {Object.values(checkedItems).every(Boolean)
                    ? "Collapse All"
                    : "Expand All"}
                </span>
                <span className="icon-circle">
                  <i
                    className={`fas fa-chevron-down arrow-icon ${
                      Object.values(checkedItems).every(Boolean)
                        ? "rotated"
                        : ""
                    }`}
                  ></i>
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Existing order rendering code */}
        {Object.entries(ordersToRender)?.map(([date, dateOrders]) => {
          // Ensure dateOrders is always an array
          const activeOrders = Array.isArray(dateOrders)
            ? dateOrders
            : Object.values(dateOrders);

          if (activeOrders?.length === 0) return null;

          const dateTypeKey = `${date}-${type}`;

          return (
            <div className="tab mt-0" key={dateTypeKey}>
              <input
                type="checkbox"
                id={`chck${dateTypeKey}`}
                checked={checkedItems[dateTypeKey] || false}
                onChange={() => toggleChecked(dateTypeKey)}
              />
              <label
                className="tab-label mb-2"
                htmlFor={`chck${dateTypeKey}`}
                onClick={(e) => {
                  e.preventDefault();
                  toggleChecked(dateTypeKey);
                }}
              >
                <span>{date}</span>
                <span className="d-flex align-items-center">
                  <span className="gray-text pe-2 small-number">
                    {activeOrders?.length}
                  </span>
                  <span className="icon-circle">
                    <i
                      className={`fas fa-chevron-down arrow-icon ${
                        checkedItems[dateTypeKey] ? "rotated" : ""
                      }`}
                    ></i>
                  </span>
                </span>
              </label>
              <div
                className="tab-content"
                style={{
                  // display: checkedItems[dateTypeKey] ? 'block' : 'none',
                  // maxHeight: checkedItems[dateTypeKey] ? '1000px' : '0',
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-out",
                }}
              >
                {activeOrders?.map((order) => (
                  <div
                    className="custom-card my-2 rounded-4 shadow-sm"
                    key={order.order_number}
                  >
                    <div
                      className="card-body py-2"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOrderClick(order.order_number, order.order_id);
                      }}
                    >
                      {/* Card body content remains the same */}
                      <div className="row align-items-center">
                        <div className="col-6">
                          <span className="fw-semibold font_size_14">
                            <i className="fa-solid fa-hashtag pe-2 font_size_14"></i>
                            {order.order_number}
                          </span>
                        </div>
                        <div className="col-6 text-end">
                          <span className="gray-text font_size_12">
                            {order.time}
                          </span>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12 text-start">
                          <div className="restaurant">
                            <i className="fa-solid fa-store pe-2 font_size_14"></i>
                            <span className="fw-medium font_size_14">
                              {order.outlet_name?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6 text-start pe-0">
                          {/* <i className="fa-solid fa-location-dot ps-2 pe-1 font_size_12 gray-text"></i> */}
                          <span className="font_size_12 gray-text font_size_12 text-nowrap">
                            {getOrderTypeIcon(order.order_type) || (
                              <i className="fa-solid fa-utensils"></i>
                            )}
                            <span className="ms-2">
                              {order.order_type || "Dine In"}
                            </span>
                          </span>
                        </div>
                        <div className="col-6 text-end">
                          <div className="font_size_12 gray-text font_size_12 text-nowrap">
                            <span className="fw-medium gray-text">
                              <i className="fa-solid fa-location-dot ps-2 pe-1 font_size_12 gray-text"></i>
                              {order.section_name
                                ? `${titleCase(order.section_name)}${
                                    order.order_type?.toLowerCase() === "drive-through" || 
                                    order.order_type?.toLowerCase() === "parcel" 
                                      ? "" 
                                      : ` - ${order.table_number}`
                                  }`
                                : "Dine In"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-6">
                          <div className="menu-info">
                            <i className="fa-solid fa-bowl-rice pe-2 gray-text font_size_12"></i>
                            <span className="gray-text font_size_12">
                              {order.menu_count === 0
                                ? "No Menus"
                                : `${order.menu_count} Menu`}
                            </span>
                          </div>
                        </div>
                        <div className="col-6 text-end">
  <span className="text-info font_size_14 fw-semibold">
    ₹{order.grand_total.toFixed(2)}
  </span>

  {/* Conditionally render the line-through price */}
  {order.grand_total !==
    (order.grand_total / (1 - order.discount_percent / 100) ||
      order.grand_total) && (
    <span className="text-decoration-line-through ms-2 gray-text font_size_12 fw-normal">
      ₹
      {(
        order.grand_total /
          (1 - order.discount_percent / 100) ||
        order.grand_total
      ).toFixed(2)}
    </span>
  )}
</div>

                      </div>
                    </div>

                    <div className="card-footer bg-transparent border-top-0 pt-0 px-3">
                      {activeTab === "completed" && (
                        <div className="container py-0">
                          <div className="row align-items-center">
                            <div className="col-6 ps-0">
                              <div className="text-start text-nowrap">
                                <span className="text-success">
                                  <i className="far fa-check-circle me-1"></i>
                                  Paid
                                </span>
                              </div>
                            </div>
                            <div className="col-6 pe-0 d-flex justify-content-end align-items-center gap-2">
                              {activeTab === "completed" && (
                                <button 
                                  className="btn btn-light py-1 px-2 mb-2 me-2 rounded-pill font_size_12"
                                  onClick={() => handleDownloadInvoice(order, navigate, showLoginPopup)}
                                >
                                  <i className="fa-solid fa-download me-2"></i>
                                  Invoice &nbsp;
                                </button>
                              )}
                              {/* {order.payment_method && (
                                <div className="border border-success rounded-pill py-0 px-1 font_size_12 text-center text-nowrap text-success">
                                  {order.payment_method}
                                </div>
                              )} */}
                            </div>
                          </div>
                        </div>
                      )}

                      {activeTab === "cancelled" && (
                        <div className="text-center">
                          <span className="text-danger">
                            <i className="fa-regular fa-circle-xmark me-1"></i>
                            Order cancelled
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="">
          <RestaurantSocials />
        </div>
      </>
    );
  };

  // Add debugging logs
  useEffect(() => {
    // console.log("Orders:", orders);
    // console.log("Type:", type);
    // console.log("CheckedItems:", checkedItems);
  }, [orders, type, checkedItems]);

  return (
    <>
      <div className="row g-1">{renderOrders()}</div>
      <Bottom />
    </>
  );
};

export const TimeRemaining = ({ orderId, completedTimers = new Set(), order }) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isExpired, setIsExpired] = useState(false);
  const timerRef = useRef(null);
  

  useEffect(() => {
    if (completedTimers?.has(orderId)) {
      setIsExpired(true);
      return;
    }

    const getOrderTimeInMs = (timeStr) => {
      if (!timeStr) return null;
      const now = new Date();
      const [time, period] = timeStr.split(" ");
      const [hours, minutes, seconds] = time.split(":");
      let hrs = parseInt(hours);
      
      if (period === "PM" && hrs !== 12) hrs += 12;
      if (period === "AM" && hrs === 12) hrs = 0;
      
      const orderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hrs, parseInt(minutes), parseInt(seconds));
      
      if (orderDate > now) {
        orderDate.setDate(orderDate.getDate() - 1);
      }
      
      return orderDate.getTime();
    };

    const orderTimeMs = getOrderTimeInMs(order?.time);
    if (!orderTimeMs) {
      setIsExpired(true);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const elapsed = now - orderTimeMs;
      const remaining = Math.max(90 - Math.floor(elapsed / 1000), 0);

      if (remaining === 0) {
        setIsExpired(true);
        clearInterval(timerRef.current);
        return;
      }
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    timerRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [orderId, completedTimers, order?.time]);

  if (isExpired || timeLeft === 0) return null;
  return (
    <div className="text-dark font_size_14 text-center mb-2">
      You can cancel this order within{" "}
      <span className="fw-semibold">{timeLeft}s</span>
    </div>
  );
};

export const CircularCountdown = ({
  orderId,
  onComplete,
  setActiveOrders,
  order,
  setActiveTab,
  fetchOrders,
}) => {
  const [timeLeft, setTimeLeft] = useState(90);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef(null);
  

  useEffect(() => {
    const getOrderTimeInMs = (timeStr) => {
      if (!timeStr) return null;
      const now = new Date();
      const [time, period] = timeStr.split(" ");
      const [hours, minutes, seconds] = time.split(":");
      let hrs = parseInt(hours);
      
      if (period === "PM" && hrs !== 12) hrs += 12;
      if (period === "AM" && hrs === 12) hrs = 0;
      
      const orderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hrs, parseInt(minutes), parseInt(seconds));
      
      if (orderDate > now) {
        orderDate.setDate(orderDate.getDate() - 1);
      }
      
      return orderDate.getTime();
    };

    const orderTimeMs = getOrderTimeInMs(order?.time);
    if (!orderTimeMs) {
      handleTimerComplete();
      return;
    }

    const now = new Date().getTime();
    const elapsed = now - orderTimeMs;

    if (elapsed >= 90000) {
      handleTimerComplete();
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const elapsed = now - orderTimeMs;
      const remaining = Math.max(90 - Math.floor(elapsed / 1000), 0);

      if (remaining <= 0) {
        clearInterval(timerRef.current);
        handleTimerComplete();
        return;
      }
      setTimeLeft(remaining);
    };

    calculateTimeLeft();
    timerRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [orderId, order?.time]);

  const handleTimerComplete = async () => {
    setTimeLeft(0);
    setIsCompleted(true);

    // fetchOrders();
    window.location.reload();

    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentCustomerId = userData?.user_id || localStorage.getItem("user_id");
      const restaurantId = order.restaurant_id;
      const sectionId = userData?.sectionId || localStorage.getItem("sectionId");

      if (!currentCustomerId || !restaurantId) return;

      // First update the order status in ongoing/placed orders
      const response = await fetch(
        `${config.apiDomain}/user_api/get_ongoing_or_placed_order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            user_id: currentCustomerId,
            outlet_id: localStorage.getItem("outlet_id"),
            section_id: sectionId,
          }),
        }
      );

      const data = await response.json();
      
      // Handle the ongoing/placed orders update
      if (response.ok && data.st === 1) {
        const orders = data.data || [];
        let orderList = { placed: [], ongoing: [] };
        localStorage.setItem(
          "timeOfPlacedOrder",
          data.data?.map((order) => order.time)
        );

        window.location.reload();

        if (orders?.length > 0) {
          // Group orders by their status
          const placedOrders = orders?.filter(o => o.status === "placed");
          const ongoingOrders = orders?.filter(o => o.status === "ongoing");

          orderList = {
            placed: placedOrders,
            ongoing: ongoingOrders
          };
        }

        setActiveOrders(orderList);

        // If this was a cancel or complete action, update all orders list
        if (order.status === "cancelled" || order.status === "completed") {
          // Fetch all orders to update the full order list
          const allOrdersResponse = await fetch(
            `${config.apiDomain}/user_api/get_all_orders`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
              body: JSON.stringify({
                user_id: currentCustomerId,
                restaurant_id: restaurantId,
                section_id: sectionId,
              }),
            }
          );

          const allOrdersData = await allOrdersResponse.json();
          
          if (allOrdersData.st === 1) {
            // Update localStorage with new order lists
            localStorage.setItem("allOrderList", JSON.stringify(allOrdersData.data));
            
            // If order was cancelled, move it to cancelled list
            if (order.status === "cancelled") {
              const cancelledOrders = allOrdersData.data.cancelled || {};
              const today = new Date().toISOString().split('T')[0];
              
              if (!cancelledOrders[today]) {
                cancelledOrders[today] = [];
              }
              cancelledOrders[today].push(order);
              
              // Update cancelled orders in localStorage
              const updatedAllOrders = {
                ...allOrdersData.data,
                cancelled: cancelledOrders
              };
              localStorage.setItem("allOrderList", JSON.stringify(updatedAllOrders));
            }
          }
        }
      } else {
        setActiveOrders({ placed: [], ongoing: [] });
      }
    } catch (error) {
      console.clear();
      setActiveOrders({ placed: [], ongoing: [] });
    }

    // Call the onComplete callback if provided
    if (onComplete) {
      onComplete();
    }

    // Show appropriate toast message based on order status
    if (order.status === "cancelled") {
      window.showToast("success", "Order cancelled successfully!");
    } else if (order.status === "completed") {
      window.showToast("success", "Order completed successfully!");
    } else {
      window.showToast("info", "Order status updated!");
    }
  };

  const percentage = (timeLeft / 90) * 100;

  return (
    <div className="circular-countdown">
      <svg viewBox="0 0 36 36" className="circular-timer">
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#eee"
          strokeWidth="3"
        />
        <path
          d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="#2196f3"
          strokeWidth="3"
          strokeDasharray={`${percentage}, 100`}
        />
      </svg>
      <div className="timer-text-overlay text-dark">{timeLeft}s</div>
    </div>
  );
};

// Add this function to fetch single order details and generate PDF
const handleDownloadInvoice = async (order, navigate, showLoginPopup) => {
  try {
    window.showToast("info", "Generating invoice...");

    const response = await fetch(
      `${config.apiDomain}/user_api/get_order_details`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          order_id: order.order_id,
          section_id: localStorage.getItem("sectionId"),
        }),
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("userData");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("access_token");
      localStorage.removeItem("customerName");
      localStorage.removeItem("mobile");
      showLoginPopup();
      
      const restaurantCode = localStorage.getItem("restaurantCode");
      const tableNumber = localStorage.getItem("tableNumber");
      const sectionId = localStorage.getItem("sectionId");

      navigate(`/user_app/${restaurantCode}/${tableNumber}/${sectionId}`);



      return;
    }

    if (!response.ok) {
      throw new Error("Failed to fetch order details");
    }

    const data = await response.json();
    if (data.st !== 1 || !data.lists) {
      throw new Error("Invalid order data received");
    }

    await generatePDF(data.lists);

  } catch (error) {
    console.error("Error generating invoice:", error);
    window.showToast("error", "Failed to generate invoice");
  }
};

export default MyOrder;