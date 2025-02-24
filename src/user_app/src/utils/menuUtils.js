import config from "../config";

export const fetchMenuPrices = async (restaurantId, menuId) => {
  try {
    const response = await fetch(
      `${config.apiDomain}/user_api/get_full_half_price_of_menu`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          outlet_id: localStorage.getItem("outlet_id"),
          menu_id: menuId,
        }),
      }
    );

    if (response.status === 401) {
      localStorage.removeItem("user_id");
      localStorage.removeItem("userData");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("access_token");
      return {
        success: false,
        error: "unauthorized",
        status: 401
      };
    }

    const data = await response.json();
    if (response.ok && data.st === 1) {
      return {
        success: true,
        data: data.menu_detail
      };
    }
    return {
      success: false,
      error: data.msg || "Failed to fetch price information"
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to fetch price information"
    };
  }
}; 