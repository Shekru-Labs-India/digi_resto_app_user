export const getTableNumber = () => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  return userData?.tableNumber || localStorage.getItem("tableNumber");
};
