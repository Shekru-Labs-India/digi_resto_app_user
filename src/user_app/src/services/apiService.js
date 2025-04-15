import axios from 'axios';
import config from '../component/config';

// Create a single instance of Axios
const apiClient = axios.create({
  baseURL: config.apiDomain,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get browser and platform info for device name
export const getDeviceName = () => {
  const platform = navigator.platform || 'Unknown Platform';
  const userAgent = navigator.userAgent;
  let browserInfo = 'Unknown Browser';

  // Detect browser
  if (userAgent.includes('Chrome')) {
    browserInfo = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browserInfo = 'Firefox';
  } else if (userAgent.includes('Safari')) {
    browserInfo = 'Safari';
  } else if (userAgent.includes('Edge')) {
    browserInfo = 'Edge';
  } else if (userAgent.includes('Opera')) {
    browserInfo = 'Opera';
  }

  return `Web_${browserInfo}_${platform}`.replace(/\s+/g, '_');
};

// Get device token from a single source of truth
export const getDeviceToken = () => {
  // First try to get from userData if user is logged in
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  if (userData?.device_token) {
    return userData.device_token;
  }
  
  // If not in userData, try to get from localStorage
  let deviceToken = localStorage.getItem('device_token');
  
  // // If not found anywhere, generate a new one
  // if (!deviceToken) {
  //   // Generate a unique device token (could be uuid, device fingerprint, etc.)
  //   deviceToken = `web_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  //   localStorage.setItem('device_token', deviceToken);
  // }
  
  return deviceToken;
};

// Get device ID for web browsers
export const getDeviceId = () => {
  let deviceId = localStorage.getItem('device_id');
  
  if (!deviceId) {
    // Generate a unique device ID using timestamp and random string
    deviceId = `web_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('device_id', deviceId);
  }
  
  return deviceId;
};

// Get device model/name for web browsers
export const getDeviceModel = () => {
  const platform = navigator.platform || 'Unknown';
  const browserName = (() => {
    const ua = navigator.userAgent;
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    return 'Unknown';
  })();
  
  return `${browserName} on ${platform}`;
};

// Add request interceptor to add device_token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const deviceName = getDeviceName();
    const deviceId = getDeviceId();
    const deviceModel = getDeviceModel();
    
    // For GET requests, add to query parameters
    if (config.method === 'get') {
      config.params = {
        ...config.params || {},
        device_token: getDeviceToken(),
        device_id: deviceId,
        device_model: deviceModel
      };
    } 
    // For POST, PUT, DELETE requests, add to the request body
    else if (config.data) {
      // If data is FormData
      if (config.data instanceof FormData) {
        config.data.append('device_token', getDeviceToken());
        config.data.append('device_id', deviceId);
        config.data.append('device_model', deviceModel);
      } 
      // If data is JSON
      else if (typeof config.data === 'object') {
        config.data.device_token = getDeviceToken();
        config.data.device_id = deviceId;
        config.data.device_model = deviceModel;
      }
    }
    
    // Add authorization header if available
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Simplified API methods
export const api = {
  get: (url, params = {}) => apiClient.get(url, { params }),
  post: (url, data = {}) => apiClient.post(url, data),
  put: (url, data = {}) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url),
};

export default api; 