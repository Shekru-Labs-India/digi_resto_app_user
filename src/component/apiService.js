const API_BASE_URL = 'https://menumitra.com/user_api';

export const fetchMenuData = async (customerId, restaurantId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/get_all_menu_list_by_category`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId, restaurant_id: restaurantId }),
    });

    if (!response.ok) throw new Error('Failed to fetch menu data');

    const data = await response.json();
    return data.st === 1 ? data.data : null;
  } catch (error) {
    console.error('Error fetching menu data:', error);
    return null;
  }
};

export const toggleFavorite = async (customerId, restaurantId, menuId, isFavorite) => {
  try {
    const apiUrl = isFavorite
      ? `${API_BASE_URL}/remove_favourite_menu`
      : `${API_BASE_URL}/save_favourite_menu`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId, restaurant_id: restaurantId, menu_id: menuId }),
    });

    if (!response.ok) throw new Error('Failed to update favorite status');

    const data = await response.json();
    if (data.st === 1) {
      return { success: true, message: isFavorite ? 'Removed from Favourites' : 'Added to Favourites' };
    }
    throw new Error('Failed to update favorite status');
  } catch (error) {
    console.error('Error updating favorite status:', error);
    return { success: false, message: 'Failed to update favorite status' };
  }
};

export const addToCart = async (customerId, restaurantId, menuId, quantity) => {
  try {
    const response = await fetch(`${API_BASE_URL}/add_to_cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_id: customerId, restaurant_id: restaurantId, menu_id: menuId, quantity }),
    });

    if (!response.ok) throw new Error('Failed to add item to cart');

    const data = await response.json();
    if (data.st === 1) {
      return { success: true, cartId: data.cart_id, message: 'Added to cart' };
    }
    throw new Error('Failed to add item to cart');
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return { success: false, message: 'Failed to add item to cart' };
  }
};