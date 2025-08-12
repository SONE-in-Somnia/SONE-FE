"use client";

import React, { useState, useEffect } from 'react';
import styles from '../styles/FloatingEmojis.module.css';

interface StyledEmoji {
  emoji: string;
  style: React.CSSProperties;
}

const FloatingEmojis: React.FC = () => {
  const [styledEmojis, setStyledEmojis] = useState<StyledEmoji[]>([]);
  const baseEmojis = ['💊', '🚀', '🎮', '🧑‍💻', '🌟'];

  // This effect runs only on the client, after the initial render.
  useEffect(() => {
    const generateEmojis = () => {
      return baseEmojis.map((emoji) => {
        const style = {
          top: `${Math.random() * 90}vh`, // Random initial top position
          left: `${Math.random() * 90}vw`, // Random initial left position
          animationDuration: `${Math.random() * 3 + 2}s`, // Duration between 2s and 5s
          animationDelay: `${Math.random() * 3}s`, // Delay up to 3s
        };
        return { emoji, style };
      });
    };

    setStyledEmojis(generateEmojis());
  }, []); // The empty dependency array ensures this runs only once.

  return (
    <div className={styles.emojiContainer}>
      {styledEmojis.map((item, index) => (
        <div key={index} className={styles.emoji} style={item.style}>
          {item.emoji}
        </div>
      ))}
    </div>
  );
};

export default FloatingEmojis;