"use client";

import React from 'react';
import styles from '../styles/FloatingEmojis.module.css';

const FloatingEmojis: React.FC = () => {
  const emojis = ['💊', '🚀', '🎮', '🧑‍💻', '🌟'];

  const renderEmojis = () => {
    return emojis.map((emoji, index) => {
      const style = {
        top: `${Math.random() * 90}vh`, // Random initial top position
        left: `${Math.random() * 90}vw`, // Random initial left position
        animationDuration: `${Math.random() * 3 + 2}s`, // Duration between 2s and 5s
        animationDelay: `${Math.random() * 0}s`, // Delay up to 3s
      };
      return (
        <div key={index} className={styles.emoji} style={style}>
          {emoji}
        </div>
      );
    });
  };

  return <div className={styles.emojiContainer}>{renderEmojis()}</div>;
};

export default FloatingEmojis;
