export const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return {
      customerId: userData?.customer_id || localStorage.getItem("customer_id"),
      customerType: userData?.customer_type || localStorage.getItem("customer_type"),
      isGuest: !userData?.customer_id && !!localStorage.getItem("customer_id")
    };
  };
  
  export const getRestaurantData = () => {
    return {
      restaurantId: localStorage.getItem("restaurantId"),
      restaurantName: localStorage.getItem("restaurantName")
    };
  };