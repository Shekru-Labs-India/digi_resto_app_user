# API Service Documentation

## Overview

This API service provides a centralized way to make API calls with automatic inclusion of the `device_token` parameter in all requests. It uses Axios interceptors to ensure that every API request includes this parameter without requiring manual addition in each API call.

## Features

- Automatically adds `device_token` to all API requests
- Single source of truth for device token management
- Automatically handles authorization headers 
- Consistent error handling
- Simplified API methods

## How to Use

### Import the API Service

```javascript
import api from '../services/apiService';
```

### Making API Calls

#### GET Request

```javascript
// The device_token will be automatically added as a query parameter
try {
  const response = await api.get('/user_api/get_menu_details', {
    menu_id: menuId,
    outlet_id: restaurantId
  });
  
  // Access response data directly
  const data = response.data;
  
  // Process the data
  if (data.st === 1) {
    // Success
  } else {
    // Handle API error
  }
} catch (error) {
  // Handle network error
}
```

#### POST Request

```javascript
// The device_token will be automatically added to the request body
try {
  const response = await api.post('/user_api/add_to_favorites', {
    user_id: userData.user_id,
    menu_id: menuId,
    outlet_id: restaurantId
  });
  
  // Process the response
  const data = response.data;
  if (data.st === 1) {
    // Success
  } else {
    // Handle API error
  }
} catch (error) {
  // Handle network error
}
```

#### PUT Request

```javascript
// Update an existing resource
try {
  const response = await api.put('/user_api/update_profile', {
    user_id: userData.user_id,
    name: newName,
    email: newEmail
  });
  
  // Process the response
  const data = response.data;
  if (data.st === 1) {
    // Success
  } else {
    // Handle API error
  }
} catch (error) {
  // Handle network error
}
```

#### DELETE Request

```javascript
// Delete a resource
try {
  const response = await api.delete(`/user_api/remove_favorite?menu_id=${menuId}`);
  
  // Process the response
  const data = response.data;
  if (data.st === 1) {
    // Success
  } else {
    // Handle API error
  }
} catch (error) {
  // Handle network error
}
```

## Device Token Management

The service automatically manages the device token:

1. It first checks if a device token exists in localStorage
2. If not found, it generates a unique token and stores it
3. This token is then included in all API requests

## Authorization Header

When a user is logged in, the service automatically includes the authentication token in the request headers.

## Error Handling

All API errors are caught in the try/catch block, allowing you to handle them appropriately in your components. 