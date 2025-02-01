export const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    return {
      userId: userData?.user_id || localStorage.getItem("user_id"),
      role: userData?.role || localStorage.getItem("role"),
      isGuest: !userData?.user_id && !!localStorage.getItem("user_id")
    };
  };
  
  export const getRestaurantData = () => {
    return {
      restaurantId: localStorage.getItem("restaurantId"),
      restaurantName: localStorage.getItem("restaurantName")
    };
  };