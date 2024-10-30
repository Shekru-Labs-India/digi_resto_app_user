import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useRestaurantId } from "../context/RestaurantIdContext";

// Validate and redirect based on restaurant code
const ValidateAndNavigate = () => {
  const { restaurantCode } = useParams();
  const { setRestaurantCode, error } = useRestaurantId();

  useEffect(() => {
    setRestaurantCode(restaurantCode);
  }, [restaurantCode, setRestaurantCode]);

  if (error) {
    return <Navigate to="/user_app/Signinscreen" replace />;
  }

  return <Navigate to={`/user_app/${restaurantCode}/1`} replace />;
};

export default ValidateAndNavigate;
