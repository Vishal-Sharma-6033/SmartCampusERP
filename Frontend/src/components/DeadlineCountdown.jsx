import React, { useState, useEffect } from 'react';

const DeadlineCountdown = ({ deadline }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [color, setColor] = useState('var(--text-secondary)');

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!deadline) {
        setTimeLeft('No deadline');
        setColor('var(--muted)');
        return;
      }

      const now = new Date();
      const end = new Date(deadline);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('OVERDUE');
        setColor('var(--danger)');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      let text = '';
      if (days > 0) text += `${days}d `;
      text += `${hours}h ${minutes}m left`;

      setTimeLeft(text);

      // Under 24 hours warning
      if (diff < 1000 * 60 * 60 * 24) {
        setColor('var(--warning)');
      } else {
        setColor('var(--text-secondary)');
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // 1 minute ticks

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <span className="font-semibold text-xs" style={{ color }}>
      {timeLeft}
    </span>
  );
};

export default DeadlineCountdown;
