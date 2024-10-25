// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './CircularCountdown.css';

// const CircularCountdown = ({ duration = 90, backgroundColor = 'rgba(255, 255, 255, 0.1)', progressColor = '#7995D5', textColor = '#000000', restaurantId, orderId }) => {
//   const [timeLeft, setTimeLeft] = useState(duration);
//   const canvasRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         if (prevTime <= 0) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (timeLeft === 0) {
//       fetch('https://menumitra.com/user_api/change_status_to_ongoing', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           restaurant_id: restaurantId,
//           order_id: orderId
//         }),
//       })
//         .then(response => response.json())
//         .then(data => {
//           console.log('Status changed to ongoing:', data);
//           // Hit the new API after count is 0
//           return fetch('https://menumitra.com/user_api/get_order_list', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//               restaurant_id: restaurantId,
//               order_status: 'ongoing',
//               customer_id: JSON.parse(localStorage.getItem('userData'))?.customer_id,
//             }),
//           });
//         })
//         .then(response => response.json())
//         .then(data => {
//           console.log('New order list fetched:', data);
//           if (data.st === 1) {
//             navigate('/MyOrder', { state: { selectedTab: 'ongoing' } });
//           }
//         })
//         .catch(error => console.error('Error:', error));
//     }
//   }, [timeLeft, restaurantId, orderId, navigate]);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');
//     const radius = canvas.width / 2;
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Background circle
//     ctx.beginPath();
//     ctx.arc(radius, radius, radius - 5, 0, 2 * Math.PI);
//     ctx.fillStyle = backgroundColor;
//     ctx.fill();

//     // Progress arc (reversed)
//     ctx.beginPath();
//     ctx.strokeStyle = progressColor;
//     ctx.lineWidth = 6;
//     const angle = (timeLeft / duration) * 2 * Math.PI;
//     ctx.arc(radius, radius, radius - 5, -Math.PI / 2, angle - Math.PI / 2);
//     ctx.stroke();

//     // Draw timer text
//     ctx.font = 'bold 20px Poppins';
//     ctx.fillStyle = textColor;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     const minutes = Math.floor(timeLeft / 60);
//     const seconds = timeLeft % 60;
//     const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
//     ctx.fillText(timerText, radius, radius);

//     // Draw "LEFT" text
//     ctx.font = '12px Arial';
//     ctx.fillStyle = textColor;
//     ctx.fillText('LEFT', radius, radius + 20);
//   }, [timeLeft, duration, backgroundColor, progressColor, textColor]);

//   const handleCancelOrder = () => {
//     fetch('https://menumitra.com/user_api/cancle_order', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         restaurant_id: restaurantId,
//         order_id: orderId,
//         note: "Order cancelled by user"
//       }),
//     })
//       .then(response => response.json())
//       .then(data => {
//         console.log('Order cancelled:', data);
//         navigate('/MyOrder', { state: { selectedTab: 'cancel' } });
//       })
//       .catch(error => console.error('Error cancelling order:', error));
//   };

//   return (
//     <div className="circular-countdown">
//       <canvas ref={canvasRef} width="100" height="100" className="countdown-canvas"></canvas>
//       <button className="btn btn-danger mt-3" onClick={handleCancelOrder}>Cancel the Order</button>
//     </div>
//   );
// };

// export default CircularCountdown;
