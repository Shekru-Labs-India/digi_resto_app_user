import React, { useState, useEffect, useRef } from 'react';
import './CircularCountdownTimer.css'; // We'll create this file for the styles

const CircularCountdownTimer = () => {
  const [time, setTime] = useState(90); // Set default time to 90 seconds
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');
  const intervalRef = useRef(null);
  const clockRef = useRef(null);

  useEffect(() => {
    // Start the timer automatically with 90 seconds
    startTimer(90);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = (seconds = 90) => {
    setIsRunning(true);
    setTime(seconds);
    const totalSeconds = seconds;
    let secondsLeft = totalSeconds;

    intervalRef.current = setInterval(() => {
      secondsLeft -= 1;
      setTime(secondsLeft);
      updateClockFace(secondsLeft, totalSeconds);

      if (secondsLeft <= 0) {
        clearInterval(intervalRef.current);
        setIsRunning(false);
      }
    }, 1000);
  };

  const updateClockFace = (secondsLeft, totalSeconds) => {
    const percentage = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
    const halfWay = Math.round(totalSeconds / 2);
    const increment = 360 / totalSeconds;

    if (clockRef.current) {
      if (secondsLeft > halfWay) {
        const nextDeg = (90 + (increment * (totalSeconds - secondsLeft))) + 'deg';
        clockRef.current.style.backgroundImage = `linear-gradient(90deg, #e6f3f0 50%, transparent 50%, transparent), linear-gradient(${nextDeg}, #0d775e 50%, #e6f3f0 50%, #e6f3f0)`;
      } else {
        const nextDeg = (-90 + (increment * (halfWay - secondsLeft))) + 'deg';
        clockRef.current.style.backgroundImage = `linear-gradient(${nextDeg}, #0d775e 50%, transparent 50%, transparent), linear-gradient(270deg, #0d775e 50%, #e6f3f0 50%, #e6f3f0)`;
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div>
      <div className="clock-wrap">
        <div className="clock" ref={clockRef}>
          <span className="count">{formatTime(time)}</span>
        </div>
      </div>
      <div className="action">
        <div className="input">
         
        </div>
      </div>
    </div>
  );
};

export default CircularCountdownTimer;
