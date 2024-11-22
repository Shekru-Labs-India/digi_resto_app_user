import { useNetwork } from '../context/NetworkContext';

export const useNetworkAwareApi = () => {
  const { isOnline, setShowNetworkModal, networkAwareFetch } = useNetwork();

  const fetchWithNetwork = async (apiCall, options = {}) => {
    if (!isOnline) {
      setShowNetworkModal(true);
      throw new Error('No internet connection');
    }

    try {
      return await networkAwareFetch(apiCall, options);
    } catch (error) {
      if (!navigator.onLine) {
        setShowNetworkModal(true);
      }
      throw error;
    }
  };

  return { fetchWithNetwork };
};